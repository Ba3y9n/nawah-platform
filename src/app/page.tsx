"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, BrainCircuit, Globe, 
  Map, LayoutDashboard, QrCode, TestTube2, 
  LineChart, AlertTriangle, ChevronLeft, Search, BookOpen,
  ArrowDown, Recycle
, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

// --- Interactive Circular System Component ---
function CircularSystem() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const stages = [
    { id: 0, title: "المصدر", desc: "توثيق مصانع التمور ومراكز التجميع.", icon: Map },
    { id: 1, title: "الدفعة", desc: "تسجيل الكميات وإصدار معرف تتبع.", icon: Database },
    { id: 2, title: "التحليل", desc: "فحص جودة النوى بالذكاء الاصطناعي.", icon: BrainCircuit },
    { id: 3, title: "الاستخدامات", desc: "تحديد المسارات الصناعية المحتملة.", icon: Search },
    { id: 4, title: "التجربة", desc: "توثيق عمليات المعالجة والمخرجات.", icon: TestTube2 },
    { id: 5, title: "النتائج", desc: "ربط المخرجات بالدليل العلمي.", icon: BookOpen },
    { id: 6, title: "الأثر", desc: "حساب العوائد البيئية والاقتصادية.", icon: Globe },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center mt-12 lg:mt-0">
      {/* Central Node */}
      <div className="relative z-20 w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-2">
        <span className="font-black text-emerald-950 text-xl">نواة</span>
      </div>

      {/* Rings & Connecting Lines */}
      <div className="absolute inset-0 rounded-full border border-slate-100 border-dashed animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border border-emerald-50" />
      
      {/* Active Stage Data Display (Mobile Fallback / Center Display) */}
      <div className="absolute top-full mt-8 lg:mt-12 text-center w-full max-w-sm px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                {(() => {
                  const Icon = stages[activeIndex].icon;
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
              <h3 className="text-lg font-bold text-emerald-950">{stages[activeIndex].title}</h3>
            </div>
            <p className="text-sm text-slate-500">{stages[activeIndex].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nodes */}
      {stages.map((stage, index) => {
        const angle = (index / stages.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 160; // Distance from center
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = activeIndex === index;

        return (
          <motion.button
            key={stage.id}
            className="absolute z-30"
            style={{ x, y }}
            onClick={() => setActiveIndex(index)}
            animate={{ scale: isActive ? 1.1 : 1 }}
          >
            <div className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 ${
              isActive 
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 ring-4 ring-emerald-100" 
                : "bg-white text-slate-400 hover:text-emerald-500 border border-slate-100 shadow-sm hover:shadow-md"
            }`}>
              <stage.icon className="w-6 h-6" />
              
              {isActive && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 blur-md"
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// --- Interactive Timeline Component ---
function InteractiveTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { num: "01", title: "تسجيل الدفعات", desc: "تسجيل وتتبع دفعات نوى التمر وربطها بالمصدر والكمية والحالة وطرق التخزين والمعالجة لتكوين سجل رقمي قابل للتتبع داخل المنصة.", icon: Database },
    { num: "02", title: "التحليل بالذكاء الاصطناعي", desc: "ارفع صورة لنوى التمر للحصول على تحليل بصري مبدئي. يساعد في التعرف على الخصائص البصرية الظاهرة كالشكل واللون والتجانس.", icon: BrainCircuit },
    { num: "03", title: "اكتشاف الاستخدامات المحتملة", desc: "استكشف مسارات الاستفادة المحتملة من نوى التمر بناءً على البيانات المتاحة ومستوى الأدلة العلمية (استخدامات مدعومة بالدراسات، قيد التحقق، وتجريبية).", icon: Search },
    { num: "04", title: "التجارب", desc: "أنشئ تجربة مرتبطة بالدفعة التي تعمل عليها. وثّق هدف التجربة، الكمية المستخدمة، طريقة المعالجة، والنتائج، لتكوين سجل قابل للتتبع.", icon: TestTube2 },
    { num: "05", title: "الأدلة والمصادر", desc: "تربط نواة مسارات الاستخدام بالمصادر والدراسات المتاحة، مع توضيح مستوى الأدلة وتمييز ما هو مثبت عما يحتاج للتحقق.", icon: BookOpen },
    { num: "06", title: "الخريطة الذكية", desc: "تعرض الخريطة المصادر والدفعات المرتبطة بها جغرافيًا، مع تنظيم البيانات (المنطقة ← المدينة ← المصدر ← الدفعات).", icon: Map },
    { num: "07", title: "قياس الأثر", desc: "تحول البيانات المسجلة في المنصة إلى مؤشرات أداء ككمية النوى المسجلة وعدد الدفعات والمصادر والتجارب لدعم اتخاذ القرار.", icon: LineChart },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24 w-full py-10 overflow-visible">
      {/* 1. Circular Data Flow System */}
      <div className="xl:w-1/2 flex justify-center items-center w-full relative h-[400px] sm:h-[500px]">
         {/* The dashed circular track */}
         <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border-2 border-emerald-100 border-dashed" />
         
         {/* Animated flowing data */}
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none"
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24]" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
         </motion.div>

         {/* Center NAWAH Circle */}
         <div className="absolute z-20 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-950 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(2,44,34,0.3)] border-4 border-white">
            <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">نواة</span>
            <span className="text-emerald-400/80 font-bold text-[10px] sm:text-xs tracking-widest mt-1">NAWAH</span>
         </div>

         {/* 7 Nodes */}
         {steps.map((step, idx) => {
            const angle = (idx * (360 / 7)) - 90;
            const rad = angle * (Math.PI / 180);
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`absolute z-30 flex flex-col items-center justify-center transition-all duration-500 group ${
                  activeStep === idx ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ 
                  left: `${50 + Math.cos(rad)*50}%`, 
                  top: `${50 + Math.sin(rad)*50}%`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  activeStep === idx 
                    ? 'bg-emerald-600 text-white shadow-[0_0_25px_rgba(5,150,105,0.5)] ring-4 ring-emerald-100' 
                    : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                }`}>
                  <step.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                {/* Node Label */}
                <div className="absolute top-full mt-2 sm:mt-3 w-28 text-center pointer-events-none">
                   <div className={`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                     activeStep === idx ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                   }`}>{step.num}</div>
                   <div className={`text-[10px] sm:text-xs font-bold leading-tight ${
                     activeStep === idx ? 'text-emerald-950' : 'text-slate-500'
                   }`}>{step.title}</div>
                </div>
              </button>
            )
         })}
      </div>

      {/* 2. Details Panel */}
      <div className="xl:w-1/3 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Subtle top border glow for active step */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className="w-7 h-7" />;
                  })()}
               </div>
               <div>
                 <div className="text-emerald-500 font-bold text-xs mb-1 uppercase tracking-widest">{steps[activeStep].num}</div>
                 <h3 className="text-lg sm:text-xl font-black text-emerald-950">{steps[activeStep].title}</h3>
               </div>
            </div>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-8 relative z-10">
              {steps[activeStep].desc}
            </p>
            
            {/* Prev / Next Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
               <button 
                 onClick={() => setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1)}
                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                 aria-label="السابق"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
               
               <div className="text-sm font-bold text-slate-400 font-mono tracking-widest bg-slate-50 px-4 py-1.5 rounded-full">
                 {steps[activeStep].num} <span className="text-slate-300 mx-1">/</span> 07
               </div>

               <button 
                 onClick={() => setActiveStep(prev => prev === steps.length - 1 ? 0 : prev + 1)}
                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                 aria-label="التالي"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
// --- Main Page ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-emerald-950 font-sans selection:bg-amber-200 selection:text-emerald-900 overflow-hidden" dir="rtl">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-50 overflow-hidden">
        
        {/* --- Premium Tech Background --- */}
        {/* 1. Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* 2. Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
            
            <div className="lg:w-1/2 space-y-8 text-center lg:text-right pt-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 mb-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                منصة رقمية ذكية
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2]"
              >
                من نواة التمر... <br />
                <span className="text-emerald-600">نصنع قيمة</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                منصة رقمية ذكية لإدارة نوى التمر واستكشاف فرص الاستفادة منها، تربط البيانات والذكاء الاصطناعي والأدلة العلمية والتجارب وقياس الأثر في منظومة واحدة، لدعم الانتقال من التعامل مع النوى كمخلف إلى التعامل معه كمورد قابل للتتبع والدراسة والتثمين.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  href="/pit-management/dashboard"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <span>استكشف المنصة</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative">
              <CircularSystem />
            </div>

          </div>

          </div>
      </section>

      {/* 2. THE PROBLEM (Visual Storytelling) */}
      <section className="py-8 bg-emerald-900 border-t border-emerald-950 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-white">المشكلة</h2>
            <p className="text-emerald-100 text-lg">قطاع ضخم… ومورد ثانوي يحتاج إلى منظومة استثمار</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-emerald-200 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.92M</div>
              <div className="text-sm font-bold text-slate-500">طن إنتاج التمور<br/>في المملكة (2024)</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-emerald-200 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">37.6M+</div>
              <div className="text-sm font-bold text-slate-500">نخلة في<br/>المملكة</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-emerald-200 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">584K</div>
              <div className="text-sm font-bold text-slate-500">طن إنتاج منطقة<br/>القصيم (2024)</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-emerald-200 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.695B</div>
              <div className="text-sm font-bold text-slate-500">ريال قيمة<br/>صادرات التمور</div>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-6">
             <div className="inline-flex items-center justify-center gap-4 text-sm font-bold text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
               <span>133 دولة حول العالم</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
               <span>192.5% نمو الصادرات منذ 2016</span>
             </div>
             <p className="text-lg text-slate-600 leading-relaxed">
               ومع هذا الحجم من الإنتاج والتجهيز والتصنيع، تظهر منتجات ثانوية من بينها نوى التمر.
             </p>
          </div>
        </div>
      </section>

      {/* 3. POTENTIAL RESOURCE (Visual Flow) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">حجم المورد المحتمل</h2>
            <p className="text-emerald-600/80 text-lg font-bold">من كل ثمرة... مورد يستحق الدراسة</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto relative">
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                
                <div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-white relative group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <span className="font-black text-2xl">1</span>
                   </div>
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">إنتاج التمور بالمملكة</span>
                   <span className="text-3xl font-black text-emerald-950 dir-ltr">1.92M</span>
                   
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center md:hidden z-20">
                     <ArrowDown className="w-4 h-4 text-emerald-400" />
                   </div>
                   <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full hidden md:flex items-center justify-center z-20">
                     <ChevronLeft className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
                
                <div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-slate-50/50 relative group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <span className="font-black text-2xl">2</span>
                   </div>
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">نسبة النوى من الثمرة</span>
                   <span className="text-3xl font-black text-emerald-950 dir-ltr">≈ 10%</span>
                   
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center md:hidden z-20">
                     <ArrowDown className="w-4 h-4 text-emerald-400" />
                   </div>
                   <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full hidden md:flex items-center justify-center z-20">
                     <ChevronLeft className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
                
                <div className="p-10 text-center flex flex-col justify-center items-center bg-emerald-900 text-white shadow-inner relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-400/20 transition-colors duration-700" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                   
                   <span className="text-emerald-100/80 text-sm font-bold mb-6 relative z-10 uppercase tracking-widest">حجم النوى المحتمل</span>
                   <span className="text-6xl font-black text-amber-400 dir-ltr relative z-10 drop-shadow-md tracking-tighter">192K</span>
                   <span className="text-emerald-50 font-bold mt-4 text-xs relative z-10 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">طن (تقدير نظري)</span>
                </div>

             </div>
             
             <div className="p-5 bg-slate-50 text-center border-t border-slate-100">
                 <span className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto block">ملاحظة: هذا تقدير حسابي مبني على نسبة منشورة في الدراسات، وليس إحصائية رسمية لكمية نوى التمر المتخلفة فعليًا في المملكة. وهو يوضح حجم الفرصة المحتملة لدراسة وتثمين نوى التمر.</span>
             </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Interactive Timeline) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">كيف تعمل نواة؟</h2>
            <p className="text-emerald-100 text-lg">مسار رقمي واحد قابل للتتبع</p>
          </div>
          
          <InteractiveTimeline />
        </div>
      </section>

      {/* 5. FEATURES SHOWCASE */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-emerald-100 text-lg">منظومة واحدة بدل بيانات متفرقة</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "إدارة الدفعات", icon: Database },
              { title: "الذكاء الاصطناعي", icon: BrainCircuit },
              { title: "قاعدة الأدلة", icon: BookOpen },
              { title: "إدارة التجارب", icon: TestTube2 },
              { title: "الخريطة الذكية", icon: Map },
              { title: "لوحة البيانات", icon: LayoutDashboard },
              { title: "قياس الأثر", icon: LineChart },
              { title: "التتبع", icon: QrCode },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="group relative bg-white border border-slate-100 p-8 rounded-3xl text-center hover:shadow-xl hover:shadow-emerald-900/5 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-colors">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-700 group-hover:text-emerald-950 transition-colors">
                    {feature.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IMPACT VISUALIZATION */}
      <section className="py-32 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl font-black text-amber-400">الأثر</h2>
            <p className="text-emerald-100 text-lg">من مخلف إلى مورد قابل للتتبع</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { label: "البيانات", icon: Database },
              { label: "المعرفة", icon: BrainCircuit },
              { label: "التجربة", icon: TestTube2 },
              { label: "إعادة الاستخدام", icon: Recycle },
              { label: "الأثر", icon: Globe },
            ].map((node, idx, arr) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-4 w-full relative">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}
                  className="flex flex-col items-center gap-3 relative z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-900 border-2 border-emerald-700 flex items-center justify-center shadow-lg">
                    <node.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-100">{node.label}</span>
                </motion.div>
                
                {idx !== arr.length - 1 && (
                  <div className="flex-1 w-full flex justify-center md:block">
                    <div className="h-10 w-px md:h-px md:w-full bg-emerald-800 relative overflow-hidden flex items-center justify-center">
                       {/* Animated Arrow Desktop (Right to Left) */}
                       <motion.div
                         initial={{ right: "-20%" }}
                         animate={{ right: "120%" }}
                         transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2, ease: "linear" }}
                         className="absolute hidden md:block"
                       >
                         <ChevronLeft className="w-5 h-5 text-amber-400" />
                       </motion.div>

                       {/* Animated Arrow Mobile (Top to Bottom) */}
                       <motion.div
                         initial={{ top: "-20%" }}
                         animate={{ top: "120%" }}
                         transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2, ease: "linear" }}
                         className="absolute md:hidden"
                       >
                         <ArrowDown className="w-5 h-5 text-amber-400" />
                       </motion.div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NATIONAL CONTEXT */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
           <h2 className="text-2xl font-black text-emerald-950">السياق الوطني الموازي</h2>
           <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6">
             <div className="text-5xl md:text-6xl font-black text-rose-500 dir-ltr">4.066M</div>
             <div className="text-lg font-bold text-slate-700">طن / الهدر الغذائي السنوي العام</div>
             <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl">
               هذه الأرقام تخص الهدر الغذائي عمومًا في المملكة وفق تقديرات رسمية، وليست نوى التمر تحديدًا. لكنها توضح أهمية تطوير حلول رقمية تدعم تعظيم الاستفادة من الموارد الثانوية كالنوى ضمن منظومة الاقتصاد الدائري.
             </p>
           </div>
        </div>
      </section>

      {/* 8. WHY NAWAH (Brief Visual Flow) */}
      <section className="py-32 bg-white text-center">
        <div className="container mx-auto px-4 max-w-4xl space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-emerald-950">لماذا نواة؟</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xl font-bold text-slate-400">
            <span>هناك إنتاج.</span>
            <span>وهناك مصادر.</span>
            <span>وهناك نوى.</span>
            <span>وهناك دراسات.</span>
            <span>وهناك تجارب.</span>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-10 border border-emerald-100 space-y-8">
            <p className="text-xl font-black text-emerald-900">
              لكن القيمة الأكبر تظهر عندما تصبح هذه العناصر مرتبطة ببعضها رقميًا.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-emerald-700">
              <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">تسجيل</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
              <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">تحليل</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
              <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">دليل</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
              <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">تجربة</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
              <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">تتبع</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
              <span className="bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md">أثر</span>
            </div>
          </div>
        </div>
      </section>

          </div>
  );
}
