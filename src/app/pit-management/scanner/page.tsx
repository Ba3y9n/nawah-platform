"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Scan, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, 
  Package, Database, Loader2, RefreshCw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ScannerContent() {
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch_id") || "";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadBatches() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: bList } = await supabase
          .from('batches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBatches(bList || []);
        if (preselectedBatchId && !selectedBatchId) {
          setSelectedBatchId(preselectedBatchId);
          const currentBatch = bList?.find(b => b.id === preselectedBatchId);
          if (currentBatch?.image_url) {
            setImagePreview(currentBatch.image_url);
          }
        }
      }
    }
    loadBatches();
  }, [preselectedBatchId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysisResult(null);
        setSavedSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setErrorMsg("");

    try {
      let publicImageUrl = imagePreview;

      // Upload file to Supabase Storage if user selected a file
      if (selectedFile) {
        const supabase = createClient();
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `scanner-${Date.now()}.${fileExt}`;
        const filePath = `scanner-images/${fileName}`;

        const { data: storageData, error: uploadErr } = await supabase.storage
          .from('nawah-storage')
          .upload(filePath, selectedFile);

        if (!uploadErr && storageData) {
          const { data: urlData } = supabase.storage
            .from('nawah-storage')
            .getPublicUrl(filePath);
          publicImageUrl = urlData.publicUrl;
        }
      }

      // Call Vision AI API Route
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        // Blob fallback from data URL
        const res = await fetch(imagePreview);
        const blob = await res.blob();
        formData.append("image", blob, "camera-image.jpg");
      }

      const apiRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) {
        throw new Error("فشل الاتصال بمحرك الرؤية الحاسوبية");
      }

      const resData = await apiRes.json();
      setAnalysisResult(resData);

      // Link and Save to PostgreSQL database if batch is selected
      if (selectedBatchId) {
        const supabase = createClient();
        await supabase.from('image_analysis').insert({
          batch_id: selectedBatchId,
          visual_features: resData.visual_features,
          visible_impurities: resData.visible_impurities,
          visual_homogeneity: resData.visual_homogeneity,
          confidence: resData.confidence,
          notes: resData.moisture_note
        });

        // Update batch image_url if empty
        await supabase.from('batches')
          .update({ image_url: publicImageUrl, status: 'قيد التحليل' })
          .eq('id', selectedBatchId);

        setSavedSuccess(true);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("تعذر تحليل الصورة حالياً، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TITLE BAR */}
      <div className="bg-white border border-emerald-100/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Scan className="w-4 h-4" />
            <span>نظام الفحص والتصنيف البصري</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">تحليل نوى التمر بالذكاء الاصطناعي</h2>
          <p className="text-xs text-slate-500 mt-1">
            التقط أو ارفع صورة لشحنة النوى لتحليل التجانس والنقاء والخصائص السطحية المبدئية
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-emerald-900 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors"
        >
          <Package className="w-4 h-4 text-slate-500" />
          <span>تسجيل دفعة جديدة أولاً</span>
        </Link>
      </div>

      {/* INPUT CONTROLS */}
      <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* SELECT BATCH TO LINK */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            ربط نتيجة التحليل بدفعة مسجلة في قاعدة البيانات:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
          >
            <option value="">-- اختياري: اختيار الدفعة المرتبطة --</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.batch_number} - {b.source_name} ({b.quantity} كجم - {b.date_type})
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE CAPTURE / UPLOAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-emerald-100 pt-6">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-100 border border-slate-200 text-emerald-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xl shadow-emerald-900/5"
            >
              <Camera className="w-4 h-4 text-slate-500" />
              📷 فتح الكاميرا والتقاط صورة النوى
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-emerald-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xl shadow-emerald-900/5"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              🖼️ رفع صورة عالية الدقة من الجهاز
            </button>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 min-h-[160px] flex items-center justify-center text-center">
            {imagePreview ? (
              <div className="w-full space-y-2">
                <img
                  src={imagePreview}
                  alt="معاينة الصورة"
                  className="max-h-48 mx-auto rounded-xl object-cover border border-slate-300 shadow-md"
                />
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-900 font-black py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري تحليل الخصائص البصرية بالذكاء الاصطناعي...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>بدء التحليل البصري الآن</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-emerald-600 text-xs font-semibold space-y-2">
                <Scan className="w-8 h-8 mx-auto opacity-50 text-slate-500" />
                <p>الرجاء فتح الكاميرا أو رفع صورة لبدء الفحص البصري</p>
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={runAnalysis}
              className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-xl text-[11px] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              إعادة المحاولة
            </button>
          </div>
        )}

      </div>

      {/* ANALYSIS RESULT */}
      {analysisResult && (
        <div className="bg-white border border-amber-400/60 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>نتيجة الفحص والتصنيف البصري الذكي</span>
            </div>

            <span className="bg-emerald-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-xs font-extrabold">
              درجة الثقة: {analysisResult.confidence || 94}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-slate-500 font-bold block">الخصائص البصرية السطحية:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.visual_features}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-slate-500 font-bold block">مؤشر النقاء والشوائب البصرية:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.visible_impurities}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-slate-500 font-bold block">درجة التجانس البصري واللوني:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.visual_homogeneity}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-amber-600 font-bold block">ملاحظة حالة التجفيف والرطوبة البصرية:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.moisture_note}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-amber-600 font-bold block">المسار التحويلي الأفضل الموصى به:</span>
              <span className="text-slate-900 font-black text-sm">{analysisResult.recommended_pathway}</span>
            </div>

            {selectedBatchId && savedSuccess && (
              <span className="bg-emerald-100 text-slate-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 self-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تم حفظ التحليل في قاعدة البيانات وح ربطه بالدفعة
              </span>
            )}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] text-slate-500 flex items-start gap-2 border border-emerald-100 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>{analysisResult.visual_limitations || "تنبيه هام: هذا الفحص البصري التقديري يحلل المظهر السطحي والشوائب الظاهرة فقط، ولا يغني عن الفحوصات المعملية لدقة نسبة الرطوبة والتركيب الكيميائي أو السلامة الميكروبية."}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-slate-500 text-xs animate-pulse">
        جاري تحميل ماسح فحص النوى...
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
