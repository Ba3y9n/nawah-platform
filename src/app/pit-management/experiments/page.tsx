"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TestTube2, PlusCircle, Loader2, Package, ChevronLeft, Activity, ArrowRight, ShieldCheck, Play
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperimentsListPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExperiments = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('experiments')
        .select('*, batches(batch_number, source_name, date_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setExperiments(data || []);
    } else {
      setExperiments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExperiments();
  }, []);

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
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-950 to-emerald-900 p-8 rounded-3xl shadow-lg border border-emerald-800 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-700 mb-4 backdrop-blur-sm">
            <TestTube2 className="w-4 h-4" />
            <span>سجل المختبر الرقمي</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">تجارب تحويل وتدوير النوى الموثقة</h2>
          <p className="text-sm text-emerald-100/80 mt-2 font-medium max-w-xl leading-relaxed">
            سجل التجارب المعملية والميدانية المربوطة بدفعات النوى لتوثيق نتائج الاختبارات ومستويات الجودة. تمتلك <strong className="text-white">{experiments.length}</strong> تجربة.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
          <Link
            href="/pit-management/experiments/new"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>تسجيل تجربة جديدة</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* EXPERIMENTS LIST */}
      {loading ? (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">جاري استحضار سجلات المختبر...</p>
        </div>
      ) : experiments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-6 shadow-sm"
        >
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <TestTube2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-emerald-950">لم يتم تسجيل أي تجارب بعد</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">
              وثّق أول اختبار معملي أو عملية تحويل لدفعة نوى لتسجيل مخرجات الجودة والنتائج.
            </p>
          </div>
          <Link
            href="/pit-management/experiments/new"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-800 transition-all shadow-md"
          >
            <PlusCircle className="w-5 h-5 text-emerald-300" />
            توثيق أول تجربة
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {experiments.map((exp) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                layout
                className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all group"
              >
                {/* EXPERIMENT HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">رقم التجربة</span>
                    <span className="text-lg font-black text-emerald-950 dir-ltr text-right block">{exp.experiment_number}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-center">
                      {exp.status || "قيد التقييم"}
                    </span>
                    {exp.batches && (
                      <Link
                        href={`/pit-management/batches/${exp.batch_id}`}
                        className="text-xs flex items-center justify-center gap-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold dir-ltr transition-colors"
                        title="عرض الدفعة المرتبطة"
                      >
                        <Package className="w-3.5 h-3.5" />
                        {exp.batches.batch_number}
                      </Link>
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-base leading-snug">{exp.objective}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-slate-700">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">الكمية المستهلكة</span>
                      <span className="font-black text-emerald-700 text-sm flex items-center gap-1">
                        <Activity className="w-4 h-4" /> {exp.quantity_used} كجم
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">طريقة المعالجة</span>
                      <span className="font-bold text-slate-800 text-xs leading-snug block line-clamp-2">
                        {exp.processing_method}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-400"></div>
                    <span className="text-[10px] font-bold text-emerald-800 block uppercase">النتيجة المسجلة (Validated Result)</span>
                    <p className="text-emerald-950 text-sm leading-relaxed font-bold">
                      {exp.result || "لم يتم تسجيل النتائج بعد."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-xs text-slate-400 font-medium flex justify-between items-center border-t border-slate-100">
                  <span>تاريخ: {new Date(exp.created_at).toLocaleDateString('ar-SA')}</span>
                  <span>المدة: {exp.duration || "غير محددة"}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* NEXT STEP TO IMPACT */}
      <motion.div variants={itemVariants} className="bg-emerald-950 text-white p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">المرحلة الأخيرة في الرحلة</span>
          <h4 className="text-lg font-black text-white">قياس الأثر البيئي والعائد التراكمي</h4>
        </div>

        <Link
          href="/pit-management/impact"
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md shrink-0"
        >
          <span>عرض شاشة قياس الأثر الرقمي</span>
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </motion.div>

    </motion.div>
  );
}
