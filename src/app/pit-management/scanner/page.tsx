"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Scan, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, 
  Package, Database, Loader2, RefreshCw, ShieldAlert, ChevronLeft, Hexagon, ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="max-w-5xl mx-auto space-y-8" dir="rtl">
      
      {/* HEADER BAR WITH FRAMER MOTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-950 p-8 rounded-3xl shadow-xl border border-emerald-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-emerald-900/80 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-700 mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>محرك الذكاء الاصطناعي للفحص البصري</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">نظام التحليل البصري التقديري</h2>
            <p className="text-sm text-emerald-200/80 mt-2 max-w-xl leading-relaxed">
              استخرج المؤشرات المرئية، حدد الشوائب والتجانس البصري لشحنة النواة عبر رفع صورة عالية الدقة.
            </p>
          </div>

          <Link
            href="/pit-management/batches"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-colors shrink-0 backdrop-blur-md"
          >
            <Package className="w-4 h-4" />
            <span>العودة للسجلات</span>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl text-sm text-amber-950 flex items-start gap-3 shadow-sm"
      >
        <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong className="block mb-1 text-amber-800">تنبيه هام (Disclaimers):</strong>
          هذا فحص بصري تقديري للمظهر السطحي والشوائب الظاهرة فقط عبر نماذج الرؤية الحاسوبية، ولا يغني عن الفحوصات المعملية المعتمدة للرطوبة والتركيب الكيميائي والسلامة الميكروبية.
        </p>
      </motion.div>

      {/* INTERACTIVE WORKSPACE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
      >
        
        {/* BATCH LINKING */}
        <div className="space-y-3">
          <label className="text-sm font-black text-emerald-950 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            توجيه الفحص لدفعة مسجلة:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer font-medium"
          >
            <option value="">-- فحص حر (بدون حفظ في سجل) --</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.batch_number} - {b.source_name} ({b.quantity} كجم)
              </option>
            ))}
          </select>
        </div>

        {/* SCANNER VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4 border-t border-slate-100">
          
          <div className="flex flex-col gap-4 justify-center">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleImageChange} className="hidden" />

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => cameraInputRef.current?.click()}
              className="group flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-50 to-white hover:from-emerald-50 hover:to-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 p-8 rounded-3xl font-bold transition-all shadow-sm"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm">التقاط صورة عبر الكاميرا</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-50 to-white hover:from-emerald-50 hover:to-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 p-8 rounded-3xl font-bold transition-all shadow-sm"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm">رفع صورة عالية الدقة</span>
            </motion.button>
          </div>

          {/* VIEWPORT & SCANNER ANIMATION */}
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center min-h-[350px] shadow-inner border-4 border-slate-800">
            {imagePreview ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={imagePreview}
                  alt="معاينة"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                {/* AI SCANNER LINE (Framer Motion) */}
                {isAnalyzing && (
                  <>
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_#34d399] z-10"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 z-0 animate-pulse"></div>
                  </>
                )}

                <div className="relative z-20 w-full px-8 pb-8 pt-20 flex flex-col items-center h-full justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-2xl text-sm transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 backdrop-blur-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري المعالجة البصرية...</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5" />
                        <span>بدء التحليل الذكي</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm font-medium space-y-4 flex flex-col items-center">
                <div className="relative">
                  <Hexagon className="w-16 h-16 opacity-20 text-emerald-400 animate-spin-slow" />
                  <Scan className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 text-emerald-300" />
                </div>
                <p>بانتظار الصورة للمسح الضوئي...</p>
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold">{errorMsg}</span>
            </div>
            <button
              onClick={runAnalysis}
              className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة
            </button>
          </motion.div>
        )}

      </motion.div>

      {/* ANALYSIS RESULT (Framer Motion List) */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3 text-emerald-950 font-black text-xl">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <span>التقرير البصري الذكي</span>
              </div>
              <span className="bg-slate-900 text-emerald-400 px-5 py-2 rounded-full text-sm font-bold shadow-inner">
                درجة الثقة: {analysisResult.confidence || 92}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "الخصائص السطحية", text: analysisResult.visual_features },
                { title: "الشوائب المكتشفة", text: analysisResult.visible_impurities },
                { title: "التجانس البصري", text: analysisResult.visual_homogeneity },
                { title: "مؤشر الرطوبة", text: analysisResult.moisture_note },
              ].map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx} 
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  <span className="text-slate-400 font-bold block text-xs uppercase mb-2 group-hover:text-emerald-600 transition-colors">{item.title}</span>
                  <p className="text-slate-800 font-medium leading-relaxed text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <span className="text-emerald-600 font-bold block text-xs uppercase mb-1">المسار التحويلي المقترح للدفعة</span>
                <span className="text-emerald-950 font-black text-lg">{analysisResult.recommended_pathway}</span>
              </div>
              {selectedBatchId && savedSuccess && (
                <span className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  تم الحفظ في السجل
                </span>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-emerald-950 text-white p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block mb-1">الخطوة التالية</span>
                <h4 className="text-lg font-black text-white">استكشاف المسارات التطبيقية</h4>
              </div>
              <Link
                href={selectedBatchId ? `/pit-management/pathways?batch_id=${selectedBatchId}` : "/pit-management/pathways"}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md shrink-0"
              >
                <span>متابعة الرحلة</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 text-emerald-600 text-sm font-bold flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        جاري تهيئة محرك الفحص...
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
