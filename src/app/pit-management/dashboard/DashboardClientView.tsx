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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8" 
      dir="rtl"
    >
      
      {/* SOFT LUXURIOUS HEADER */}
      <motion.div variants={itemVariants} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#F0FDF4] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#F0F9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#059669] block mb-3 bg-[#F0FDF4] w-fit px-3 py-1 rounded-full border border-[#86EFAC]/50">لوحة التحكم التفاعلية</span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            أهلاً بك، {userName}
          </h1>
          <p className="text-sm text-slate-500 mt-3 max-w-xl font-medium leading-relaxed">
            تابع رحلة نوى التمر بأسلوب تفاعلي، من لحظة الاستلام المباشر وحتى التحليل البصري بالذكاء الاصطناعي وقياس الأثر البيئي.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative z-10">
          <Link
            href="/pit-management/batches/new"
            className="flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-[0_8px_16px_-6px_rgba(6,78,59,0.3)] shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-emerald-300" />
            <span>تسجيل مسار جديد</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* COMPACT DATA METRICS BAR (Floating Effect) */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
          
          <div className="pt-2 md:pt-0 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">إجمالي الكمية</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block dir-ltr text-right">{totalQuantityTon} <span className="text-sm font-bold text-slate-400">طن</span></span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">{totalQuantityKg.toLocaleString()} كجم مسجلة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">دفعات النوى</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{totalBatches}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">سجلات مصادر موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-amber-500 transition-colors">تم تحليلها بصرياً</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{analyzedCount}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">فحص الذكاء الاصطناعي</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-blue-500 transition-colors">التجارب الجارية</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{totalExperiments}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">اختبارات معملية موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">الأثر المحسوب</span>
            <span className="text-3xl sm:text-4xl font-black text-[#059669] mt-2 block dir-ltr text-right">{(Number(totalQuantityTon) * 0.65).toFixed(1)} <span className="text-sm font-bold text-[#34D399]">طن</span></span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">تقدير انبعاثات متجنبة</span>
          </div>

        </div>
      </motion.div>

      {/* ACTIVE JOURNEY HERO visual LINE */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#059669] block mb-2">الرحلة النشطة الحالية</span>
            <h2 className="text-2xl font-black mt-0.5 dir-ltr text-right text-slate-900">
              {latestBatch ? latestBatch.batch_number : 'NW-2026-0001'}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {latestBatch ? `${latestBatch.source_name} — ${latestBatch.quantity} كجم (${latestBatch.date_type})` : 'بانتظار تسجيل أول دفعة لبدء الرحلة'}
            </p>
          </div>

          {latestBatch && (
            <Link
              href={`/pit-management/batches/${latestBatch.id}`}
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-xs transition-colors border border-slate-200 shrink-0 shadow-sm"
            >
              <span>فتح مسار الرحلة بالكامل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* CONNECTED PROCESS LINE (Animated) */}
        <div className="space-y-6 relative z-10">
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">مراحل التدفق الرقمي للدفعة:</span>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            
            {/* Animated Horizontal Line */}
            <div className="hidden md:block absolute top-1/2 right-6 left-6 h-0.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-200"
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
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-500 ${
                  st.isDone 
                    ? "bg-white text-[#059669] shadow-[0_4px_20px_rgba(16,185,129,0.15)] border border-emerald-100 scale-105" 
                    : "bg-slate-50 text-slate-300 border-2 border-slate-100/50"
                }`}>
                  <st.icon className="w-6 h-6" />
                </div>
                <div className="text-right md:text-center">
                  <span className={`text-sm font-bold block transition-colors ${st.isDone ? "text-slate-800" : "text-slate-400"}`}>{st.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-medium">{st.isDone ? "مكتمل" : "في الانتظار"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RECENT BATCHES INTERACTIVE LIST */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <h2 className="text-xl font-black text-slate-900">أحدث سجلات الرحلات</h2>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-sm font-bold text-[#059669] hover:text-[#064E3B] flex items-center gap-1 transition-colors">
              عرض كل الرحلات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-slate-500 font-medium">لا توجد دفعات مسجلة حالياً بحسابك.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {batches.slice(0, 5).map((b: any, index: number) => (
              <motion.div 
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-slate-100 transition-all gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#F0FDF4] group-hover:text-[#059669] transition-colors border border-slate-100">
                    <Package className="w-5 h-5 text-slate-400 group-hover:text-[#059669] transition-colors" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 dir-ltr text-right text-base group-hover:text-[#064E3B] transition-colors">{b.batch_number}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{b.source_name} • {b.date_type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-left dir-ltr">
                    <span className="block font-black text-[#059669] text-base">{Number(b.quantity).toLocaleString()} KG</span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{new Date(b.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <Link 
                    href={`/pit-management/batches/${b.id}`}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-[#064E3B] group-hover:text-white group-hover:border-[#064E3B] transition-all shadow-sm"
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
