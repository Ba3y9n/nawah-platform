"use client";

import Link from "next/link";
import { 
  Package, TestTube2, Building2, TrendingUp, 
  PlusCircle, ChevronLeft, Leaf, MapPin, Scan, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardClientView({ 
  userName, 
  totalBatches, 
  totalExperiments, 
  totalQuantityTon, 
  totalQuantityKg, 
  analyzedCount, 
  latestBatch, 
  batches 
}: any) {
  
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
      className="space-y-8" 
      dir="rtl"
    >
      
      {/* EDITORIAL COMMAND CENTER HEADER */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-950 to-emerald-900 p-8 rounded-3xl shadow-lg border border-emerald-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">مركز القيادة والتتبع</span>
          <h1 className="text-2xl md:text-4xl font-black">
            أهلاً بك، {userName}
          </h1>
          <p className="text-sm text-emerald-100/80 mt-2 max-w-xl font-medium leading-relaxed">
            تابع رحلة نوى التمر بأسلوب تفاعلي، من لحظة الاستلام المباشر وحتى التحليل البصري بالذكاء الاصطناعي وقياس الأثر البيئي.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
          <Link
            href="/pit-management/batches/new"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>تسجيل مسار جديد</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* COMPACT DATA METRICS BAR (Floating Effect) */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
          
          <div className="pt-2 md:pt-0 group">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-emerald-600 transition-colors">إجمالي الكمية</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1 block dir-ltr text-right">{totalQuantityTon} <span className="text-sm font-bold text-slate-500">طن</span></span>
            <span className="text-[10px] text-slate-500 mt-1 block">{totalQuantityKg.toLocaleString()} كجم مسجلة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-emerald-600 transition-colors">دفعات النوى</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1 block">{totalBatches}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">سجلات مصادر موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-amber-500 transition-colors">تم تحليلها بصرياً</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1 block">{analyzedCount}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">فحص الذكاء الاصطناعي</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-blue-500 transition-colors">التجارب الجارية</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1 block">{totalExperiments}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">اختبارات معملية موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-emerald-600 transition-colors">الأثر المحسوب</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1 block dir-ltr text-right">{(Number(totalQuantityTon) * 0.65).toFixed(1)} <span className="text-sm font-bold text-emerald-600">طن CO2e</span></span>
            <span className="text-[10px] text-slate-500 mt-1 block">تقدير انبعاثات متجنبة</span>
          </div>

        </div>
      </motion.div>

      {/* ACTIVE JOURNEY HERO visual LINE */}
      <motion.div variants={itemVariants} className="bg-emerald-50 text-emerald-950 rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-200/60 pb-6 gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 block mb-1">الرحلة النشطة الحالية</span>
            <h2 className="text-2xl font-black mt-0.5 dir-ltr text-right text-emerald-950">
              {latestBatch ? latestBatch.batch_number : 'NW-2026-0001'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              {latestBatch ? `${latestBatch.source_name} — ${latestBatch.quantity} كجم (${latestBatch.date_type})` : 'بانتظار تسجيل أول دفعة لبدء الرحلة'}
            </p>
          </div>

          {latestBatch && (
            <Link
              href={`/pit-management/batches/${latestBatch.id}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-emerald-100 text-emerald-900 font-bold px-6 py-3 rounded-2xl text-xs transition-colors border border-emerald-200 shrink-0 shadow-sm"
            >
              <span>فتح مسار الرحلة بالكامل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* CONNECTED PROCESS LINE (Animated) */}
        <div className="space-y-4 relative z-10">
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">مراحل التدفق الرقمي للدفعة:</span>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            
            {/* Animated Horizontal Line */}
            <div className="hidden md:block absolute top-1/2 right-6 left-6 h-1 bg-emerald-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-emerald-500"
              />
            </div>

            {[
              { name: "تسجيل", isDone: true, icon: Package },
              { name: "تحليل بصري", isDone: !!latestBatch?.image_analysis?.length, icon: Scan },
              { name: "توظيف", isDone: true, icon: Leaf },
              { name: "تجارب معملية", isDone: totalExperiments > 0, icon: TestTube2 },
              { name: "أثر بيئي", isDone: totalQuantityKg > 0, icon: TrendingUp }
            ].map((st, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                  st.isDone 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-110" 
                    : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  <st.icon className="w-5 h-5" />
                </div>
                <div className="text-right md:text-center">
                  <span className={`text-sm font-bold block transition-colors ${st.isDone ? "text-emerald-950" : "text-slate-500"}`}>{st.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{st.isDone ? "مكتمل" : "في الانتظار"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RECENT BATCHES INTERACTIVE LIST */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-emerald-950">أحدث سجلات الرحلات</h2>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors">
              عرض كل الرحلات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 font-medium">لا توجد دفعات مسجلة حالياً بحسابك.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {batches.slice(0, 5).map((b: any, index: number) => (
              <motion.div 
                key={b.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Package className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-black text-emerald-950 dir-ltr text-right text-base">{b.batch_number}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{b.source_name} • {b.date_type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-left dir-ltr">
                    <span className="block font-black text-emerald-700">{Number(b.quantity).toLocaleString()} KG</span>
                    <span className="block text-[10px] text-slate-400">{new Date(b.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <Link 
                    href={`/pit-management/batches/${b.id}`}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
