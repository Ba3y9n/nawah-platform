"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Scan, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, 
  Package, Database, Loader2, RefreshCw, ShieldAlert, FileText, ChevronLeft, ArrowRight
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

      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        const res = await fetch(imagePreview);
        const blob = await res.blob();
        formData.append("image", blob, "camera-image.jpg");
      }

      const apiRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) {
        throw new Error("تعذر الاتصال بمحرك الفحص البصري");
      }

      const resData = await apiRes.json();
      setAnalysisResult(resData);

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

        await supabase.from('batches')
          .update({ image_url: publicImageUrl, status: 'قيد التحليل' })
          .eq('id', selectedBatchId);

        setSavedSuccess(true);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("تعذر إجراء الفحص البصري التقديري حالياً، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      
      {/* TITLE BAR WITH STEP INDICATOR */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Scan className="w-3.5 h-3.5" />
              <span>المرحلة 03 من رحلة النواة: التحليل البصري</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-emerald-950">نتيجة التحليل البصري التقديري (Visual Assessment)</h2>
            <p className="text-xs text-slate-500 mt-1">
              استخراج المؤشرات المرئية السطحية وتحديد الشوائب والتجانس البصري لشحنة النواة
            </p>
          </div>

          <Link
            href="/pit-management/batches"
            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors shrink-0"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>سجل الدفعات</span>
          </Link>
        </div>

        {/* METHODOLOGY DISCLAIMER */}
        <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            تنبيه هام: هذا فحص بصري تقديري للمظهر السطحي والشوائب الظاهرة فقط بالذكاء الاصطناعي، ولا يغني عن الفحوصات المعملية المعتمدة لتحديد الرطوبة والتركيب الكيميائي والسلامة الميكروبية.
          </p>
        </div>
      </div>

      {/* INPUT CONTROLS CONTAINER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* SELECT BATCH TO LINK */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-950 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            ربط نتيجة الفحص البصري بدفعة مسجلة في المنظومة:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-slate-100 pt-6">
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
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>فتح الكاميرا والتقاط صورة النوى</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>رفع صورة عالية الدقة من الجهاز</span>
            </button>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[160px] flex items-center justify-center text-center">
            {imagePreview ? (
              <div className="w-full space-y-3">
                <img
                  src={imagePreview}
                  alt="معاينة صورة النوى"
                  className="max-h-48 mx-auto rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>جاري استخراج الخصائص والمؤشرات البصرية...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>تشغيل الفحص البصري بالذكاء الاصطناعي</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-slate-500 text-xs font-medium space-y-2">
                <Scan className="w-8 h-8 mx-auto opacity-40 text-emerald-800" />
                <p>قم بالتقاط أو رفع صورة نوى التمر لبدء الفحص البصري</p>
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

      {/* VISUAL ANALYSIS RESULT CONTAINER WITH NEXT STEP FLOW */}
      {analysisResult && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5 text-emerald-950 font-black text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>بطاقة نتيجة التحليل البصري (Visual Analysis Result)</span>
            </div>

            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              درجة الثقة البصرية: {analysisResult.confidence || 92}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold block text-[10px]">الملاحظات البصرية السطحية:</span>
              <p className="text-slate-800 font-medium leading-relaxed">{analysisResult.visual_features}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold block text-[10px]">مؤشر النقاء والشوائب البصرية:</span>
              <p className="text-slate-800 font-medium leading-relaxed">{analysisResult.visible_impurities}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold block text-[10px]">التجانس البصري واللوني:</span>
              <p className="text-slate-800 font-medium leading-relaxed">{analysisResult.visual_homogeneity}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold block text-[10px]">الرطوبة الظاهرية التقديرية:</span>
              <p className="text-slate-800 font-medium leading-relaxed">{analysisResult.moisture_note}</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">المسار التحويلي المرشح (Potential Use):</span>
              <span className="text-emerald-950 font-black text-sm">{analysisResult.recommended_pathway}</span>
            </div>

            {selectedBatchId && savedSuccess && (
              <span className="bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                تم حفظ الفحص وربطه بالدفعة
              </span>
            )}
          </div>

          {/* NEXT STEP DIRECTIONAL PANEL (الخطوة التالية في الرحلة) */}
          <div className="bg-emerald-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">الخطوة التالية في الرحلة</span>
              <h4 className="text-sm font-black text-white mt-0.5">استكشاف مسارات الاستفادة المحتملة بناءً على التحليل</h4>
            </div>

            <Link
              href={selectedBatchId ? `/pit-management/pathways?batch_id=${selectedBatchId}` : "/pit-management/pathways"}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md shrink-0"
            >
              <span>استكشف الاستخدامات المحتملة</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
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
        جاري تحميل محرك التحليل البصري...
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
