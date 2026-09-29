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

        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-5">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#059669] block mb-3 bg-[#F0FDF4] w-fit px-3 py-1 rounded-full border border-[#86EFAC]/50">إدارة رقمية للدفعات</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                أهلاً بك، {userName}
              </h1>
              <p className="text-sm text-slate-600 mt-2 font-medium max-w-lg leading-relaxed">
                وثّق دفعات نوى التمر رقميًا، وتابع بياناتها ومسارات الاستفادة منها من المصدر إلى النتائج.
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">التسجيل يتم رقميًا داخل نواة، ولا يعني إرسال النوى أو تسليمها للمنصة.</span>
                <span className="text-slate-500 block text-[11px]">نواة لا تستلم النوى فعليًا؛ بل تنشئ لكل دفعة سجلًا رقميًا يربط بيانات المصدر بالتحليل والاستخدامات المحتملة والأدلة والتجارب والنتائج.</span>
              </div>
            </div>

            <Link
              href="/pit-management/batches/new"
              className="inline-flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-[0_8px_16px_-6px_rgba(6,78,59,0.3)]"
            >
              <PlusCircle className="w-5 h-5 text-emerald-300" />
              <span>تسجيل دفعة جديدة</span>
            </Link>
          </div>

          {/* INTERACTIVE CIRCLE LOOP */}
          <div className="flex-1 w-full relative h-[180px] flex items-center justify-center">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-emerald-100 -translate-y-1/2 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-full h-full bg-emerald-400"
              />
            </div>

            <div className="relative z-10 w-full flex items-center justify-between">
              
              <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex flex-col items-center gap-2 group cursor-pointer bg-white">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm group-hover:shadow-md transition-all">
                  <Leaf className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-black text-slate-800">المصدر</span>
                  <span className="block text-[9px] text-slate-500">يسجل بيانات الدفعة</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex flex-col items-center gap-2 group cursor-pointer bg-white">
                <div className="w-16 h-16 rounded-full bg-emerald-600 border-4 border-emerald-100 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-black text-emerald-700">نواة</span>
                  <span className="block text-[9px] text-slate-500">حلقة وصل وتوثيق رقمي</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex flex-col items-center gap-2 group cursor-pointer bg-white">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all">
                  <TestTube2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-black text-slate-800">المختبرات والجهات</span>
                  <span className="block text-[9px] text-slate-500">توثق التجارب والنتائج</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex flex-col items-center gap-2 group cursor-pointer bg-white">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-purple-600 shadow-sm group-hover:shadow-md transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-black text-slate-800">الاستفادة والأثر</span>
                  <span className="block text-[9px] text-slate-500">دراسة المسارات والنتائج</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </motion.div>

      {/* CORE CLARITY CARDS (Definition, Purpose, Experiments) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>ما المقصود بالدفعة؟</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            الدفعة هي كمية محددة من نوى التمر جُمعت من مصدر معين أو خلال فترة محددة، ويمكن توثيق معلوماتها ومتابعة مراحلها رقميًا داخل نواة.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-medium space-y-0.5 border border-slate-100">
            <span className="font-bold text-slate-700 block">مثال:</span>
            <span>10 كجم من نوى تمر سكري • المصدر: مزرعة • الموقع: بريدة • الحالة: مجففة</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>لماذا أسجل الدفعة؟</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            لأن تسجيل الدفعة يحول كمية النوى من مورد غير موثق إلى سجل رقمي يمكن الرجوع إليه وربط بياناته بالتحليل والأدلة والتجارب والنتائج.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-medium border border-slate-100">
            <span>توثيق المصدر والكمية والموقع • ربط التحليل البصري والأدلة • متابعة مسار الدفعة داخل المنصة.</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <TestTube2 className="w-4 h-4 text-emerald-600" />
            <span>من يجري التجارب؟</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            نواة ليست مختبرًا ولا تدعي إجراء التجارب العلمية بنفسها. يمكن للباحثين والجامعات والمختبرات والجهات المختصة إجراء التجارب، بينما توفر نواة طبقة رقمية لتوثيق التجربة وربط نتائجها بالدفعة.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 font-medium border border-slate-100">
            <span className="font-bold text-slate-700">تنبيه:</span> الاستخدام المحتمل يختلف عن النتيجة التي تم التحقق منها تجريبيًا.
          </div>
        </div>
      </motion.div>

      {/* COMPACT DATA METRICS BAR (Floating Effect) */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
          
          <div className="pt-2 md:pt-0 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">إجمالي الكمية المسجلة</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block dir-ltr text-right">{totalQuantityTon} <span className="text-sm font-bold text-slate-400">طن</span></span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">{totalQuantityKg.toLocaleString()} كجم مسجلة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">دفعات النوى</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{totalBatches}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">سجلات رقمية منشأة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-amber-500 transition-colors">تم تحليلها بصرياً</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{analyzedCount}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">تحليل بصري أولي للصورة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-blue-500 transition-colors">التجارب الموثقة</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 block">{totalExperiments}</span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">سجلات تجارب من جهات مختصة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-8 group cursor-default">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider group-hover:text-[#059669] transition-colors">الأثر التقديري</span>
            <span className="text-3xl sm:text-4xl font-black text-[#059669] mt-2 block dir-ltr text-right">{(Number(totalQuantityTon) * 0.65).toFixed(1)} <span className="text-sm font-bold text-[#34D399]">طن</span></span>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium">تقدير حسابي نظري للانبعاثات</span>
          </div>

        </div>
      </motion.div>

      {/* ACTIVE JOURNEY HERO visual LINE */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#059669] block mb-2">الدفعة النشطة الحالية</span>
            <h2 className="text-2xl font-black mt-0.5 dir-ltr text-right text-slate-900">
              {latestBatch ? latestBatch.batch_number : 'NW-2026-0001'}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {latestBatch ? `${latestBatch.source_name} — ${latestBatch.quantity} كجم (${latestBatch.date_type})` : 'بانتظار تسجيل أول دفعة لإنشاء السجل الرقمي'}
            </p>
          </div>

          {latestBatch && (
            <Link
              href={`/pit-management/batches/${latestBatch.id}`}
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-xs transition-colors border border-slate-200 shrink-0 shadow-sm"
            >
              <span>فتح سجل الدفعة بالكامل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* CONNECTED PROCESS LINE (Animated) */}
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">ماذا يحدث بعد التسجيل؟ (مراحل الرحلة الرقمية):</span>
            <span className="text-[10px] text-slate-400 font-medium">التحليل البصري لا يُعد بديلاً عن التحليل المخبري.</span>
          </div>
          
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
              { name: "01 تسجيل الدفعة", desc: "إدخال بيانات المصدر والكمية", isDone: true, icon: Package },
              { name: "02 التحليل البصري", desc: "تحليل بصري أولي للصورة", isDone: !!latestBatch?.image_analysis?.length, icon: Scan },
              { name: "03 الاستخدامات والأدلة", desc: "استكشاف المسارات المدعومة", isDone: true, icon: Leaf },
              { name: "04 التجارب والنتائج", desc: "توثيق تجارب الجهات المختصة", isDone: totalExperiments > 0, icon: TestTube2 },
              { name: "05 الأثر", desc: "مؤشرات وتقديرات حسابية", isDone: totalQuantityKg > 0, icon: TrendingUp }
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
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{st.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RECENT BATCHES INTERACTIVE LIST */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">أحدث السجلات الرقمية للدفعات</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">عرض الدفعات المسجلة وحالتها الحالية في المنظومة.</p>
          </div>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-sm font-bold text-[#059669] hover:text-[#064E3B] flex items-center gap-1 transition-colors">
              عرض كل الدفعات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">لا توجد دفعات مسجلة بعد</h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                ابدأ بتسجيل أول دفعة من نوى التمر لإنشاء سجل رقمي لها ومتابعة بياناتها داخل نواة.
              </p>
            </div>
            <Link
              href="/pit-management/batches/new"
              className="inline-flex items-center gap-2 bg-[#064E3B] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#064E3B]/90 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>تسجيل أول دفعة</span>
            </Link>
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
                    <div className="text-xs text-slate-500 font-medium mt-1">المصدر: {b.source_name} • الصنف: {b.date_type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-left dir-ltr">
                    <span className="block font-black text-[#059669] text-base">{Number(b.quantity).toLocaleString()} كجم</span>
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
