"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, CheckCircle2, TestTube2, AlertCircle, FileText, 
  ArrowRight, Package, ShieldCheck, ChevronLeft
} from "lucide-react";
import { REUSE_PATHWAYS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function PathwaysContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batch_id") || "";

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<any>(REUSE_PATHWAYS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState(batchId);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: bList } = await supabase
          .from('batches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBatches(bList || []);
        if (batchId && !selectedBatchId) {
          setSelectedBatchId(batchId);
        }
      }
    }
    loadData();
  }, [batchId]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto" 
      dir="rtl"
    >
      
      {/* TITLE BANNER */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-950 to-emerald-900 p-8 rounded-3xl shadow-lg border border-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            {batchId && selectedBatch && (
              <div className="flex items-center gap-2 mb-4">
                <Link 
                  href={`/pit-management/batches/${batchId}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-950 bg-emerald-300 px-4 py-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>الدفعة المحددة: {selectedBatch.batch_number}</span>
                </Link>
              </div>
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-2">مستكشف المسارات التحويلية (Pathway Explorer)</span>
            <h2 className="text-2xl md:text-3xl font-black">مسارات الاستفادة الحيوية والصناعية</h2>
            <p className="text-sm text-emerald-100/80 mt-2 font-medium max-w-xl leading-relaxed">
              استكشف المسارات المرشحة والمحتملة لتوظيف نوى التمر بناءً على الفحص البصري، تمهيداً للاختبارات المخبرية.
            </p>
          </div>

          <Link
            href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <TestTube2 className="w-5 h-5" />
            <span>توثيق تجربة جديدة</span>
          </Link>
        </div>
      </motion.div>

      {/* CENTRAL PATHWAY EXPLORER INTERACTIVE FLOW */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-8 relative">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">شبكة المسارات المحتملة</span>
          <h3 className="text-xl font-black text-emerald-950">اختر المسار التحويلي لاستكشاف متطلباته</h3>
        </div>

        {/* HORIZONTAL PATHWAY NODES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
          {REUSE_PATHWAYS.map((path) => {
            const isSelected = selectedPathway.id === path.id;
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={path.id}
                onClick={() => setSelectedPathway(path)}
                className={`p-5 rounded-3xl border-2 text-right transition-all flex flex-col justify-between space-y-4 min-h-[140px] shadow-sm ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 shadow-md ring-4 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="space-y-3">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold inline-block ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    استخدام محتمل
                  </span>
                  <h4 className={`text-sm font-black leading-snug ${isSelected ? "text-emerald-950" : "text-slate-700"}`}>
                    {path.name}
                  </h4>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* SELECTED PATHWAY EXPANDED DETAILS */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedPathway.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-4 py-1 rounded-full">
                  المسار المحدد
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">الموثوقية: {selectedPathway.evidence_level}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-950">{selectedPathway.name}</h3>
            </div>

            <Link
              href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : `/pit-management/experiments/new`}
              className="inline-flex items-center gap-2 bg-emerald-950 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shrink-0"
            >
              <TestTube2 className="w-5 h-5 text-emerald-400" />
              <span>انتقال للمعمل المخبري</span>
            </Link>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100 font-medium">
            {selectedPathway.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-3">
              <h4 className="font-black text-emerald-950 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                متطلبات وتجهيز المعالجة
              </h4>
              <p className="text-slate-700 leading-relaxed font-medium text-sm">{selectedPathway.processing_requirements}</p>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-3">
              <h4 className="font-black text-blue-950 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                الاختبارات المخبرية المطلوبة
              </h4>
              <p className="text-slate-700 leading-relaxed font-medium text-sm">{selectedPathway.required_tests}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* NEXT STEP */}
      <motion.div variants={itemVariants} className="bg-emerald-950 text-white p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">الخطوة التالية</span>
          <h4 className="text-lg font-black text-white">تسجيل وتوثيق تجربة معملية لهذا المسار</h4>
        </div>

        <Link
          href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md shrink-0"
        >
          <span>متابعة الرحلة</span>
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </motion.div>

    </motion.div>
  );
}

export default function PathwaysPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 text-emerald-600 text-sm font-bold flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-8 h-8 animate-spin" />
        جاري تحميل مستكشف المسارات...
      </div>
    }>
      <PathwaysContent />
    </Suspense>
  );
}
