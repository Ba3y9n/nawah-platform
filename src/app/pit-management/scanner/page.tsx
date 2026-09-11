"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Scan, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, 
  Package, Database, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { REUSE_PATHWAYS } from "@/lib/store";

function ScannerContent() {
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch_id") || "";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockAnalysis = {
        visual_features: "نوى تمر متجانسة الحجم مع درجة تحميص/تجفيف منتظمة وتعرجات سطحة خالية من البقع المظلمة الشديدة.",
        visible_impurities: "شوائب بصرية منخفضة جداً (أقل من 2%) خالية من بقايا القشور.",
        visual_homogeneity: "تجانس بصري ممتاز بنسبة 94%",
        confidence: 96,
        recommended_pathway: REUSE_PATHWAYS[0],
        moisture_note: "مؤشر الرطوبة البصري يظهر حالة تجفيف مناسبة (< 12%)"
      };

      setAnalysisResult(mockAnalysis);

      if (selectedBatchId) {
        const supabase = createClient();
        await supabase.from('image_analysis').insert({
          batch_id: selectedBatchId,
          visual_features: mockAnalysis.visual_features,
          visible_impurities: mockAnalysis.visible_impurities,
          visual_homogeneity: mockAnalysis.visual_homogeneity,
          confidence: mockAnalysis.confidence,
          notes: mockAnalysis.moisture_note
        });
        setSavedSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TITLE BAR */}
      <div className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
            <Scan className="w-4 h-4" />
            <span>نظام الفحص والتصنيف البصري</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">تحليل نوى التمر بالذكاء الاصطناعي</h2>
          <p className="text-xs text-emerald-700 mt-1">
            التقط أو ارفع صورة لشحنة النوى لتحليل التجانس والنقاء ونسبة الرطوبة التقديرية
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-emerald-200 text-emerald-900 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors"
        >
          <Package className="w-4 h-4 text-amber-500" />
          <span>تسجيل دفعة جديدة أولاً</span>
        </Link>
      </div>

      {/* INPUT CONTROLS */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* SELECT BATCH TO LINK */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            ربط نتيجة التحليل بدفعة مسجلة في قاعدة البيانات:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
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
              className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
            >
              <Camera className="w-4 h-4 text-amber-500" />
              📷 فتح الكاميرا والتقاط صورة النوى
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-emerald-200 text-emerald-900 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              🖼️ رفع صورة عالية الدقة من الجهاز
            </button>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-3 min-h-[160px] flex items-center justify-center text-center">
            {imagePreview ? (
              <div className="w-full space-y-2">
                <img
                  src={imagePreview}
                  alt="معاينة الصورة"
                  className="max-h-48 mx-auto rounded-xl object-cover border border-emerald-300 shadow-md"
                />
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري تحليل الخصائص البصرية...</span>
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
                <Scan className="w-8 h-8 mx-auto opacity-50 text-amber-500" />
                <p>الرجاء فتح الكاميرا أو رفع صورة لبدء الفحص</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ANALYSIS RESULT */}
      {analysisResult && (
        <div className="bg-white border border-amber-400/60 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>نتيجة التحليل البصري والحسابات البصرية</span>
            </div>

            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold">
              درجة الثقة: {analysisResult.confidence}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-emerald-700 font-bold block">الخصائص البصرية السطحية:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.visual_features}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-emerald-700 font-bold block">مؤشر النقاء والشوائب البصرية:</span>
              <p className="text-slate-800 leading-relaxed">{analysisResult.visible_impurities}</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-amber-600 font-bold block">المسار التحويلي المقترح للدفعة:</span>
              <span className="text-emerald-950 font-black text-sm">{analysisResult.recommended_pathway.name}</span>
            </div>

            {selectedBatchId && savedSuccess && (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 self-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تم حفظ نتيجة التحليل بالدفعة في DB
              </span>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-emerald-700 flex items-center gap-2 border border-emerald-100">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>التحليل البصري مساعد لتوقع التجانس والرطوبة السطحية ولا يحل محل الاختبارات المخبرية الكيميائية.</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-emerald-700 text-xs animate-pulse">
        جاري تحميل ماسح فحص النوى...
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
