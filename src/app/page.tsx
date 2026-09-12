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


function InteractiveFeatures() {
  const [active, setActive] = useState(0);
  
  const features = [
    { 
      num: "01", title: "إدارة الدفعات", icon: Database,
      desc: "تسجيل وتتبع دفعات نوى التمر وربطها ببيانات المصدر والكمية والحالة وطرق التخزين والمعالجة لتكوين سجل رقمي موثوق وقابل للتتبع.", 
      visual: (
        <div className="flex flex-col gap-3 w-full max-w-[220px]">
          {[1,2,3].map(i => (
             <div key={i} className={`h-14 rounded-xl border flex items-center px-4 gap-4 transition-all duration-500 ${i===1 ? 'bg-emerald-500 border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)] scale-110' : 'bg-white border-slate-100 opacity-60'}`}>
               <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i===1 ? 'bg-amber-300' : 'bg-slate-200'}`} />
               <div className="flex-1 space-y-2">
                 <div className={`h-1.5 rounded-full w-full ${i===1 ? 'bg-white/40' : 'bg-slate-100'}`} />
                 <div className={`h-1.5 rounded-full w-2/3 ${i===1 ? 'bg-white/20' : 'bg-slate-50'}`} />
               </div>
             </div>
          ))}
        </div>
      )
    },
    { 
      num: "02", title: "الذكاء الاصطناعي", icon: BrainCircuit,
      desc: "تحليل وتوقع الفرص والمسارات باستخدام نماذج الذكاء الاصطناعي لاكتشاف أفضل الاستخدامات.", 
      visual: (
        <div className="relative w-48 h-48 flex items-center justify-center">
           <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
           <div className="absolute inset-6 border border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dotted" />
           <div className="w-20 h-20 bg-emerald-500 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center relative z-10 border-4 border-white">
              <BrainCircuit className="w-8 h-8 text-white" />
           </div>
           {/* Pulsing nodes */}
           <div className="absolute top-2 right-1/4 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse" />
           <div className="absolute bottom-6 left-6 w-4 h-4 bg-emerald-300 rounded-full shadow-[0_0_15px_rgba(110,231,183,0.8)] animate-pulse" />
        </div>
      )
    },
    { 
      num: "03", title: "قاعدة الأدلة", icon: BookOpen,
      desc: "مكتبة الأبحاث العلمية الموثقة التي تدعم مسارات الاستخدام المحتملة وتميز بين ما هو مثبت وما يحتاج للتحقق.", 
      visual: (
        <div className="flex gap-4 w-full max-w-[280px]">
           <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="h-2 bg-slate-100 rounded-full w-full" />
              <div className="h-2 bg-slate-100 rounded-full w-5/6" />
              <div className="h-2 bg-slate-50 rounded-full w-4/6" />
           </div>
           <div className="flex-1 bg-emerald-500 rounded-2xl p-5 shadow-xl scale-110 origin-left space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="h-2 bg-white/40 rounded-full w-full" />
              <div className="h-2 bg-white/30 rounded-full w-5/6" />
              <div className="h-2 bg-white/20 rounded-full w-4/6" />
           </div>
        </div>
      )
    },
    { 
      num: "04", title: "إدارة التجارب", icon: TestTube2,
      desc: "توثيق نتائج المعالجة المخبرية وربطها بالدفعات لضمان تتبع جودة التجارب وسهولة العودة لها.", 
      visual: (
        <div className="flex items-end justify-center gap-4 h-40">
           <div className="w-12 h-full bg-white border border-slate-100 rounded-full p-2 flex flex-col justify-end relative overflow-hidden shadow-sm">
             <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ duration: 4, repeat: Infinity }} className="w-full bg-slate-100 rounded-full" />
           </div>
           <div className="w-14 h-full bg-emerald-500 rounded-full p-2 flex flex-col justify-end shadow-[0_0_30px_rgba(16,185,129,0.3)] relative overflow-hidden">
             <motion.div animate={{ height: ["20%", "90%", "20%"] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="w-full bg-white/95 rounded-full shadow-inner relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-100 rounded-full blur-[1px]" />
             </motion.div>
           </div>
           <div className="w-12 h-full bg-white border border-slate-100 rounded-full p-2 flex flex-col justify-end relative overflow-hidden shadow-sm">
             <motion.div animate={{ height: ["60%", "30%", "60%"] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="w-full bg-amber-400 rounded-full" />
           </div>
        </div>
      )
    },
    { 
      num: "05", title: "الخريطة الذكية", icon: Map,
      desc: "توزيع المصادر والمصانع جغرافياً لتسهيل فهم وتتبع مسارات الإمداد وتوضيح العلاقة بين المنتج والمصدر.", 
      visual: (
        <div className="relative w-56 h-56 bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">
           <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
           
           <div className="relative z-10">
             <div className="w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] relative z-20 border-2 border-white" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-emerald-500/50 rounded-full animate-ping" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-500/20 rounded-full animate-[ping_2s_infinite_0.5s]" />
           </div>
           
           <div className="absolute top-10 right-12 w-4 h-4 bg-amber-400 rounded-full shadow-md border-2 border-white" />
           <div className="absolute bottom-12 left-12 w-5 h-5 bg-emerald-600 rounded-full shadow-md border-2 border-white" />
        </div>
      )
    },
    { 
      num: "06", title: "لوحة البيانات", icon: LayoutDashboard,
      desc: "مؤشرات أداء وتحليلات فورية توفر رؤية شاملة للمنظومة وتدعم اتخاذ قرارات مبنية على بيانات دقيقة.", 
      visual: (
        <div className="w-64 grid grid-cols-2 gap-4">
           <div className="col-span-2 bg-emerald-500 rounded-3xl h-28 p-5 relative overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
              <div className="w-10 h-10 rounded-full bg-white/20 mb-4" />
              <div className="h-2 w-1/2 bg-white/50 rounded-full mb-2" />
              <div className="h-2 w-1/3 bg-white/30 rounded-full" />
           </div>
           <div className="bg-white border border-slate-100 rounded-2xl h-24 p-4 flex flex-col justify-end gap-2 shadow-sm">
              <div className="h-10 bg-emerald-50 rounded-lg w-full" />
              <div className="h-2 bg-slate-100 rounded-full w-2/3" />
           </div>
           <div className="bg-white border border-slate-100 rounded-2xl h-24 p-4 flex flex-col items-center justify-center shadow-sm">
              <div className="w-12 h-12 border-[5px] border-emerald-500 border-r-amber-400 rounded-full" />
           </div>
        </div>
      )
    },
    { 
      num: "07", title: "قياس الأثر", icon: LineChart,
      desc: "تتبع العوائد البيئية والاقتصادية لمسارات معالجة وإعادة استخدام نوى التمر وتحويلها من مخلف إلى مورد.", 
      visual: (
        <div className="w-64 h-48 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md flex flex-col justify-end relative">
           <div className="absolute top-6 right-6 h-2 w-16 bg-slate-100 rounded-full" />
           <div className="flex items-end justify-between h-24 w-full gap-2">
             <div className="w-full bg-emerald-50 rounded-t-lg h-[20%] transition-all duration-1000 hover:h-[30%]" />
             <div className="w-full bg-emerald-100 rounded-t-lg h-[40%] transition-all duration-1000 hover:h-[50%]" />
             <div className="w-full bg-emerald-200 rounded-t-lg h-[60%] transition-all duration-1000 hover:h-[70%]" />
             <div className="w-full bg-emerald-400 rounded-t-lg h-[80%] transition-all duration-1000 relative hover:h-[90%] group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24]" />
             </div>
             <div className="w-full bg-emerald-600 rounded-t-lg h-[100%] shadow-[0_0_20px_rgba(5,150,105,0.3)]" />
           </div>
        </div>
      )
    },
    { 
      num: "08", title: "التتبع", icon: QrCode,
      desc: "مسح سريع لمعلومات الشحنات والدفعات لضمان موثوقية وسرعة تدفق البيانات في أي مرحلة من السلسلة.", 
      visual: (
        <div className="relative w-48 h-48 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-lg">
           <div className="absolute inset-5 border-2 border-emerald-500/20 rounded-2xl" />
           {/* Scanning line */}
           <motion.div animate={{ top: ["15%", "85%", "15%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-4 right-4 h-1 bg-emerald-500 shadow-[0_0_20px_#10b981] z-20 rounded-full" />
           
           <div className="grid grid-cols-2 gap-3 opacity-20">
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-emerald-600 rounded-lg" />
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full flex flex-col gap-10 py-6 overflow-hidden">
      
      {/* Active Feature Large Panel */}
      <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-14 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24"
          >
             {/* Visual Side */}
             <div className="w-full lg:w-1/2 flex justify-center items-center h-64 lg:h-80 relative bg-slate-50 rounded-[2rem] border border-slate-100">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem]" />
               {features[active].visual}
             </div>

             {/* Content Side */}
             <div className="w-full lg:w-1/2 space-y-6">
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-emerald-50 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-emerald-600">
                    {(() => {
                      const Icon = features[active].icon;
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-emerald-500 font-bold text-sm tracking-widest mb-1">{features[active].num}</div>
                    <h3 className="text-3xl lg:text-4xl font-black text-emerald-950">{features[active].title}</h3>
                  </div>
               </div>
               
               <p className="text-slate-600 text-lg leading-relaxed font-medium pb-4">
                 {features[active].desc}
               </p>
               
               <div className="pt-6 border-t border-slate-100 flex items-center gap-6">
                 <div className="flex gap-3">
                   <button 
                     onClick={() => setActive(prev => prev === 0 ? features.length - 1 : prev - 1)}
                     className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-slate-50"
                     aria-label="السابق"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setActive(prev => prev === features.length - 1 ? 0 : prev + 1)}
                     className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-slate-50"
                     aria-label="التالي"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                 </div>
                 <div className="text-slate-400 font-bold tracking-widest text-sm bg-slate-50 px-5 py-2.5 rounded-full">
                   <span className="text-emerald-950 text-lg">{features[active].num}</span> / 08
                 </div>
               </div>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal Scrollable Track */}
      <div className="w-full relative py-4">
         {/* Fade Edges for scroll indication */}
         <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />
         <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
         
         <div className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 pb-4">
           {features.map((feature, idx) => (
             <button
               key={idx}
               onClick={() => setActive(idx)}
               className={`shrink-0 snap-center flex items-center gap-4 p-3 pl-6 rounded-2xl transition-all duration-300 border-2 ${
                 active === idx 
                   ? 'bg-emerald-950 border-emerald-950 text-white shadow-xl scale-105' 
                   : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-slate-50'
               }`}
             >
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                 active === idx ? 'bg-white/10 text-amber-400' : 'bg-slate-50 text-slate-400'
               }`}>
                 <feature.icon className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${active === idx ? 'text-emerald-400/80' : 'text-slate-400'}`}>
                   {feature.num}
                 </div>
                 <div className={`text-sm md:text-base font-bold whitespace-nowrap ${active === idx ? 'text-white' : 'text-slate-700'}`}>
                   {feature.title}
                 </div>
               </div>
             </button>
           ))}
         </div>
      </div>
    </div>
  );
}


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
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Dotted Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-[0.05] pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">كيف تعمل نواة؟</h2>
            <p className="text-emerald-100 text-lg">مسار رقمي واحد قابل للتتبع</p>
          </div>
          
          <InteractiveTimeline />
        </div>
      </section>

      {/* 5. FEATURES SHOWCASE */}
      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-emerald-600/70 text-lg font-bold">منظومة واحدة بدل بيانات متفرقة</p>
          </div>

          <InteractiveFeatures />
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
