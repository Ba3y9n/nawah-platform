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
      <motion.div variants={itemVariants} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#F0FDF4] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <div>
            {batchId && selectedBatch && (
              <div className="flex items-center gap-2 mb-4">
                <Link 
                  href={`/pit-management/batches/${batchId}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] bg-[#F0FDF4] px-4 py-2 rounded-full border border-[#86EFAC]/50 hover:bg-[#DCFCE7] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>الدفعة المحددة: {selectedBatch.batch_number}</span>
                </Link>
              </div>
            )}
            <span className="text-[11px] font-black uppercase tracking-widest text-[#059669] block mb-2">مستكشف المسارات التحويلية</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">مسارات الاستفادة الحيوية والصناعية</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium max-w-xl leading-relaxed">
              استكشف المسارات المرشحة والمحتملة لتوظيف نوى التمر بناءً على الفحص البصري، تمهيداً للاختبارات المخبرية.
            </p>
          </div>
        </div>

        <Link
          href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
          className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-[0_8px_16px_-6px_rgba(6,78,59,0.3)] shrink-0 relative z-10"
        >
          <TestTube2 className="w-5 h-5 text-emerald-300" />
          <span>توثيق تجربة جديدة</span>
        </Link>
      </motion.div>

      {/* CENTRAL PATHWAY EXPLORER INTERACTIVE FLOW */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-8 relative">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#94A3B8]">شبكة المسارات المحتملة</span>
          <h3 className="text-xl font-black text-slate-900">اختر المسار التحويلي لاستكشاف متطلباته</h3>
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
                className={`p-5 rounded-[1.5rem] border-2 text-right transition-all flex flex-col justify-between space-y-4 min-h-[140px] ${
                  isSelected
                    ? "bg-[#F0FDF4] border-[#86EFAC] shadow-sm"
                    : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="space-y-3">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold inline-block ${
                    isSelected ? "bg-[#059669] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    استخدام محتمل
                  </span>
                  <h4 className={`text-sm font-black leading-snug ${isSelected ? "text-[#064E3B]" : "text-slate-700"}`}>
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ type: "spring", damping: 30 }}
          className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-6 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[11px] font-bold px-4 py-1.5 rounded-full">
                  المسار المحدد
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full">الموثوقية: {selectedPathway.evidence_level}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{selectedPathway.name}</h3>
            </div>

            <Link
              href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : `/pit-management/experiments/new`}
              className="inline-flex items-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 border border-slate-200 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <TestTube2 className="w-4 h-4 text-emerald-600" />
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
