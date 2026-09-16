"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Leaf, Package, TestTube2, 
  AlertCircle, PlusCircle, Database, Loader2, Info, ShieldAlert, ChevronLeft, Activity, Globe
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getImpactSummary } from "@/lib/store";
import { motion } from "framer-motion";

export default function ImpactPage() {
  const [summary, setSummary] = useState({
    total_registered_kg: 0,
    total_batches_count: 0,
    total_experiments_count: 0,
    total_reused_kg: 0,
    landfill_diverted_ton: 0,
    estimated_co2_reduction_ton: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      let realSummary = null;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: batches } = await supabase
            .from('batches')
            .select('quantity')
            .eq('user_id', user.id);

          const { data: experiments } = await supabase
            .from('experiments')
            .select('quantity_used')
            .eq('user_id', user.id);

          const total_registered_kg = batches?.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0) || 0;
          const total_batches_count = batches?.length || 0;
          const total_experiments_count = experiments?.length || 0;
          const total_reused_kg = experiments?.reduce((sum, e) => sum + (Number(e.quantity_used) || 0), 0) || 0;

          const landfill_diverted_ton = Number((total_registered_kg / 1000).toFixed(3));
          const estimated_co2_reduction_ton = Number((landfill_diverted_ton * 0.65).toFixed(3));

          realSummary = {
            total_registered_kg,
            total_batches_count,
            total_experiments_count,
            total_reused_kg,
            landfill_diverted_ton,
            estimated_co2_reduction_ton
          };
        }
      } catch (e) {
        console.warn("Supabase fetch notice:", e);
      }

      if (!realSummary || realSummary.total_registered_kg === 0) {
        realSummary = await getImpactSummary();
      }

      setSummary(realSummary);
      setLoading(false);
    }

    loadData();
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
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-700 mb-4 backdrop-blur-sm">
            <Globe className="w-4 h-4" />
            <span>لوحة المؤشرات البيئية</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">شاشة قياس الأثر البيئي والاقتصادي التراكمي</h2>
          <p className="text-sm text-emerald-100/80 mt-2 font-medium max-w-xl leading-relaxed">
            مؤشرات رقمية محتسبة بناءً على تسلسل رحلة الدفعات، والكميات المسجلة، والتجارب الموثقة في المنظومة.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>تسجيل دفعة لزيادة الأثر</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ACTUAL DATA METRICS CARDS */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3 text-sm font-black text-emerald-950">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          <span>بيانات المنظومة الفعلية الموثقة (Actual Data):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "الكمية الكلية المسجلة", val: `${summary.total_registered_kg.toLocaleString()} كجم`, sub: "دفعات موثقة برمز NW", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "الدفعات المسجلة", val: summary.total_batches_count, sub: "سجلات مصادر موثقة", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "التجارب الموثقة", val: summary.total_experiments_count, sub: "اختبارات معملية وتطبيقية", icon: TestTube2, color: "text-amber-600", bg: "bg-amber-50" },
            { title: "الكمية الموظفة", val: `${summary.total_reused_kg.toLocaleString()} كجم`, sub: "مستخدمة في التجارب", icon: Activity, color: "text-rose-600", bg: "bg-rose-50" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3 group"
            >
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span className="group-hover:text-slate-800 transition-colors">{stat.title}</span>
                <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dir-ltr text-right">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-300" /> : stat.val}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ESTIMATED MODEL CALCULATIONS */}
      <motion.div variants={itemVariants} className="space-y-4 pt-4">
        <div className="flex items-center gap-3 text-sm font-black text-amber-900">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></span>
          <span>التقديرات الحسابية لتأثير المنظومة البيئي (Model Calculations):</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-br from-white to-amber-50/50 border border-amber-200 p-8 rounded-3xl shadow-sm space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full border border-amber-300 text-xs font-bold shadow-sm">التحويل النظري للمدافن</span>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-4xl font-black text-emerald-950 dir-ltr text-right pt-2">
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : `${summary.landfill_diverted_ton} طن`}
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              تحويل مباشر: <strong className="text-slate-900">{summary.total_registered_kg.toLocaleString()} كجم</strong> = <strong className="text-slate-900">{summary.landfill_diverted_ton} طن متري</strong> من النفايات العضوية المحولة عن المدافن البلديّة.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 p-8 rounded-3xl shadow-sm space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full border border-emerald-300 text-xs font-bold shadow-sm">التقدير الحسابي للانبعاثات المتجنبة</span>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-4xl font-black text-emerald-950 dir-ltr text-right pt-2">
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : `${summary.estimated_co2_reduction_ton} CO2e`}
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              تقدير حسابي محتمل للانبعاثات المتجنبة عند تفادي التحلل اللاهوائي (المعامل التقديري: <strong className="text-slate-900">0.65 طن CO2e / طن</strong> مخلفات عضوية).
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* METHODOLOGY NOTICE */}
      <motion.div variants={itemVariants} className="bg-amber-50/80 border border-amber-200 p-6 rounded-3xl text-sm text-amber-950 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 font-black text-amber-900">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <span>إيضاح المنهجية وحدود النموذج:</span>
        </div>
        <div className="space-y-2 leading-relaxed font-medium text-amber-900/90 pr-8">
          <p><span className="w-1.5 h-1.5 inline-block bg-amber-500 rounded-full ml-2"></span><strong className="text-amber-950">المعامل المستعمل (0.65 طن CO2e / طن):</strong> هو معامل تقديري مستخدم في هذا النموذج لتوضيح العائد البيئي التخميني فقط.</p>
          <p><span className="w-1.5 h-1.5 inline-block bg-amber-500 rounded-full ml-2"></span><strong className="text-amber-950">دراسات تقييم دورة الحياة (LCA):</strong> الحسابات النهائية الصارمة تتطلب إجراء التقييم المعملي المخصص لكل مسار تحويلي (كالتفحيم الحراري أو الاستخلاص).</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center pt-8">
         <Link href="/pit-management/dashboard" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3 rounded-2xl text-sm transition-colors shadow-sm">
            العودة إلى لوحة القيادة المركزية
         </Link>
      </motion.div>

    </motion.div>
  );
}
