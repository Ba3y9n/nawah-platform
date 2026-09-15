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
  const [radius, setRadius] = useState(85);
  
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
    const updateRadius = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1536) setRadius(280); // 2XL
        else if (window.innerWidth >= 1280) setRadius(250); // XL
        else if (window.innerWidth >= 1024) setRadius(200); // LG
        else if (window.innerWidth >= 768) setRadius(180); // MD
        else if (window.innerWidth >= 640) setRadius(140); // SM
        else setRadius(85); // Mobile
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => {
      window.removeEventListener("resize", updateRadius);
      clearInterval(interval);
    };
  }, [stages.length]);

  return (
    <div className="relative w-full max-w-[260px] sm:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto aspect-square flex items-center justify-center mt-8 lg:mt-0 transition-all duration-500">
      {/* Central Node */}
      <div className="relative z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 xl:w-56 xl:h-56 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-1 sm:gap-2 ring-4 sm:ring-8 ring-emerald-50/50 xl:ring-[12px]">
        <span className="font-black text-emerald-950 text-sm sm:text-lg lg:text-3xl xl:text-4xl tracking-tighter">نواة</span>
        <span className="text-emerald-600/60 font-bold text-[7px] sm:text-[9px] lg:text-xs xl:text-sm tracking-widest uppercase">NAWAH</span>
      </div>

      {/* Rings & Connecting Lines */}
      <div className="absolute inset-0 rounded-full border-2 border-slate-100 border-dashed animate-[spin_120s_linear_infinite] opacity-30" />
      <div className="absolute inset-8 sm:inset-12 lg:inset-16 xl:inset-20 rounded-full border-2 border-emerald-50/50" />
      <div className="absolute inset-16 sm:inset-24 lg:inset-32 xl:inset-40 rounded-full border border-slate-50" />
      
      {/* Active Stage Data Display */}
      <div className="absolute top-[105%] sm:top-full mt-6 sm:mt-12 lg:mt-20 xl:mt-24 text-center w-full max-w-xs sm:max-w-md lg:max-w-xl px-2 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-10 shadow-2xl shadow-emerald-950/10 border border-white"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 sm:p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                {(() => {
                  const Icon = stages[activeIndex].icon;
                  return <Icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9" />;
                })()}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950">{stages[activeIndex].title}</h3>
            </div>
            <p className="text-sm lg:text-xl text-slate-600 leading-relaxed font-medium">{stages[activeIndex].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nodes */}
      {stages.map((stage, index) => {
        const angle = (index / stages.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = activeIndex === index;

        return (
          <motion.button
            key={stage.id}
            className="absolute z-30"
            style={{ x, y }}
            onClick={() => setActiveIndex(index)}
            animate={{ 
              scale: isActive ? 1.25 : 1,
              z: isActive ? 50 : 0
            }}
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className={`relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full transition-all duration-500 ${
              isActive 
                ? "bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40 ring-4 sm:ring-8 ring-emerald-100" 
                : "bg-white text-slate-400 hover:text-emerald-500 border border-slate-100 shadow-xl hover:shadow-2xl"
            }`}>
              <stage.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
              
              {isActive && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute -inset-4 rounded-full bg-emerald-400 opacity-20 blur-2xl"
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
            {/* Stage Title Label */}
            <div className={`absolute top-full mt-2 sm:mt-4 left-1/2 -translate-x-1/2 text-center w-[80px] sm:w-[120px] lg:w-[180px] transition-all duration-300 ${
              isActive 
                ? 'text-emerald-950 opacity-100 font-black scale-110' 
                : 'text-slate-500 opacity-60 lg:opacity-100 font-bold'
            }`}>
              <span className="text-[8px] sm:text-xs lg:text-base xl:text-lg leading-tight block drop-shadow-sm">
                {stage.title}
              </span>
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
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
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
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">
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
        <div className="w-full max-w-[220px] sm:max-w-[256px] grid grid-cols-2 gap-3 sm:gap-4">
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
        <div className="w-full max-w-[220px] sm:max-w-[256px] h-40 sm:h-48 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] p-4 sm:p-6 shadow-md flex flex-col justify-end relative">
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
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] flex items-center justify-center shadow-lg">
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
    <div className="w-full flex flex-col gap-6 sm:gap-10 py-4 sm:py-6">
      
      {/* Active Feature Large Panel */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-14 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
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
             <div className="w-full lg:w-1/2 flex justify-center items-center h-48 sm:h-64 lg:h-80 relative bg-slate-50 rounded-xl sm:rounded-[2rem] border border-slate-100">
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
                    <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-emerald-950">{features[active].title}</h3>
                  </div>
               </div>
               
               <p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-medium pb-4">
                 {features[active].desc}
               </p>
               
               <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between sm:justify-start gap-3 sm:gap-6">
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

      {/* 4x2 Grid Features Selection */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
         {features.map((feature, idx) => (
           <button
             key={idx}
             onClick={() => setActive(idx)}
             className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border-2 text-right ${
               active === idx 
                 ? "bg-emerald-950 border-emerald-950 text-white shadow-xl scale-105 z-10 relative" 
                 : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md"
             }`}
           >
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
               active === idx ? "bg-white/10 text-amber-400" : "bg-slate-50 text-slate-400"
             }`}>
               <feature.icon className="w-5 h-5" />
             </div>
             <div>
               <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${active === idx ? "text-emerald-400/80" : "text-slate-400"}`}>
                 {feature.num}
               </div>
               <div className={`text-sm font-bold leading-tight ${active === idx ? "text-white" : "text-slate-700"}`}>
                 {feature.title}
               </div>
             </div>
           </button>
         ))}
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
    <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-32 w-full py-10 lg:py-20 overflow-visible">
      {/* 1. Circular Data Flow System */}
      <div className="xl:w-1/2 flex justify-center items-center w-full relative h-[360px] sm:h-[520px] lg:h-[650px] xl:h-[750px] overflow-visible">
         {/* The dashed circular tracks */}
         <div className="absolute w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px] xl:w-[620px] xl:h-[620px] rounded-full border-2 border-emerald-100 border-dashed" />
         <div className="absolute w-[160px] h-[160px] sm:w-[300px] sm:h-[300px] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] rounded-full border border-emerald-50/50" />
         
         {/* Animated flowing data */}
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px] xl:w-[620px] xl:h-[620px] rounded-full pointer-events-none"
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 bg-emerald-400 rounded-full shadow-[0_0_25px_#34d399]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 lg:w-5 lg:h-5 bg-amber-400 rounded-full shadow-[0_0_20px_#fbbf24]" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
         </motion.div>

         {/* Center NAWAH Circle */}
         <div className="absolute z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-emerald-900 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(2,44,34,0.4)] border-4 lg:border-8 border-white group">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <span className="text-white font-black text-xl sm:text-2xl lg:text-4xl xl:text-5xl tracking-tighter">نواة</span>
              <span className="text-emerald-400/80 font-bold text-[10px] sm:text-xs lg:text-base xl:text-lg tracking-widest mt-1 lg:mt-2">NAWAH</span>
            </motion.div>
         </div>

         {/* 7 Nodes */}
         {steps.map((step, idx) => {
            const angle = (idx * (360 / 7)) - 90;
            const rad = angle * (Math.PI / 180);
            const radiusPercent = 42; // Keep nodes + labels inside container

            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`absolute z-30 flex flex-col items-center justify-center transition-all duration-700 group ${
                  activeStep === idx ? 'scale-110 z-40' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ 
                  left: `${50 + Math.cos(rad) * radiusPercent}%`, 
                  top: `${50 + Math.sin(rad) * radiusPercent}%`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className={`w-8 h-8 sm:w-14 sm:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                  activeStep === idx 
                    ? 'bg-emerald-600 text-white shadow-[0_0_35px_rgba(5,150,105,0.6)] ring-4 lg:ring-8 ring-emerald-100' 
                    : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                }`}>
                  <step.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-9 lg:h-9 xl:w-10 xl:h-10" />
                </div>
                {/* Node Label - Enhanced for desktop */}
                <div className={`absolute top-full mt-1 sm:mt-2 lg:mt-4 w-[70px] sm:w-28 lg:w-40 text-center pointer-events-none transition-all duration-500 ${activeStep === idx ? 'scale-105' : ''}`}>
                   <div className={`inline-block text-[8px] sm:text-[10px] lg:text-xs font-black px-1.5 sm:px-2 lg:px-3 py-0.5 lg:py-1 rounded-full mb-0.5 sm:mb-1 lg:mb-2 shadow-sm ${
                     activeStep === idx ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-800/50 text-emerald-300'
                   }`}>{step.num}</div>
                   <div className={`text-[7px] sm:text-[11px] lg:text-sm xl:text-base font-bold sm:font-black leading-tight lg:leading-snug drop-shadow-sm ${activeStep === idx ? 'text-white' : 'text-emerald-300/70'
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
            className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
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
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 lg:py-0 bg-slate-50 overflow-hidden">
        
        {/* --- Premium Tech Background --- */}
        {/* 1. Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* 2. Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-7xl relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 w-full">
            
            <div className="lg:w-1/2 space-y-8 text-center lg:text-right">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 mb-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                منصة رقمية ذكية
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2]"
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
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  href="/pit-management/dashboard"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <span>ابدأ مع نواة</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-4 rounded-2xl text-sm transition-all border border-slate-200 hover:-translate-y-0.5"
                >
                  <span>استكشف كيف تعمل نواة</span>
                  <ArrowDown className="w-4 h-4 text-slate-500" />
                </Link>
              </motion.div>
            </div>

            <div className="lg:w-1/2 w-full h-[380px] sm:h-[480px] lg:h-[700px] xl:h-[800px] relative flex items-center justify-center">
              <CircularSystem />
            </div>

          </div>


          </div>
      </section>

      {/* 2. THE PROBLEM (Visual Storytelling) */}
      <section className="py-12 sm:py-16 bg-emerald-950 border-t border-emerald-900/50 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="text-center space-y-4 mb-16 relative z-10">
            <h2 className="text-3xl font-black text-white">المشكلة</h2>
            <p className="text-emerald-100 text-lg">قطاع ضخم… ومورد ثانوي يحتاج إلى منظومة استثمار</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.92M</div>
              <div className="text-sm font-bold text-slate-500">طن إنتاج التمور<br/>في المملكة (2024)</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">37.6M+</div>
              <div className="text-sm font-bold text-slate-500">نخلة في<br/>المملكة</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">584K</div>
              <div className="text-sm font-bold text-slate-500">طن إنتاج منطقة<br/>القصيم (2024)</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.695B</div>
              <div className="text-sm font-bold text-slate-500">ريال قيمة<br/>صادرات التمور</div>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-6">
             <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-emerald-950 bg-amber-400 px-5 sm:px-8 py-3.5 rounded-full border border-amber-300 shadow-lg shadow-amber-400/20 relative z-10">
               <span>133 دولة حول العالم</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-950/40" />
               <span>192.5% نمو الصادرات منذ 2016</span>
             </div>
             <p className="text-lg text-emerald-50/90 leading-relaxed font-medium relative z-10">
               ومع هذا الحجم من الإنتاج والتجهيز والتصنيع، تظهر منتجات ثانوية من بينها نوى التمر.
             </p>
          </div>
        </div>
      </section>

      {/* 3. POTENTIAL RESOURCE (Visual Flow) */}
      <section className="py-14 sm:py-24 bg-emerald-50/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-10 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">حجم المورد المحتمل</h2>
            <p className="text-emerald-600/80 text-lg font-bold">من كل ثمرة... مورد يستحق الدراسة</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto relative">
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                
                <div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center gap-4 bg-white relative group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <span className="font-black text-2xl">1</span>
                   </div>
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">إنتاج التمور بالمملكة</span>
                   <span className="text-2xl sm:text-3xl font-black text-emerald-950 dir-ltr">1.92M</span>
                   
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center md:hidden z-20">
                     <ArrowDown className="w-4 h-4 text-emerald-400" />
                   </div>
                   <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full hidden md:flex items-center justify-center z-20">
                     <ChevronLeft className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
                
                <div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center gap-4 bg-slate-50/50 relative group">
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
                
                <div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center bg-emerald-900 text-white shadow-inner relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-400/20 transition-colors duration-700" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                   
                   <span className="text-emerald-100/80 text-sm font-bold mb-6 relative z-10 uppercase tracking-widest">حجم النوى المحتمل</span>
                   <span className="text-4xl sm:text-6xl font-black text-amber-400 dir-ltr relative z-10 drop-shadow-md tracking-tighter">192K</span>
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
      <section id="how-it-works" className="py-14 sm:py-24 lg:py-32 bg-emerald-950 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Dotted Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-[0.05] pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-white">كيف تعمل نواة؟</h2>
            <p className="text-emerald-100 text-lg">مسار رقمي واحد قابل للتتبع</p>
          </div>
          
          <InteractiveTimeline />
        </div>
      </section>

      {/* 5. FEATURES SHOWCASE */}
      <section id="features" className="py-14 sm:py-24 bg-emerald-50/50 border-t border-emerald-100/50 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-emerald-600/70 text-lg font-bold">منظومة واحدة بدل بيانات متفرقة</p>
          </div>

          <InteractiveFeatures />
        </div>
      </section>

      {/* 6. IMPACT VISUALIZATION */}
      <section className="py-16 sm:py-32 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-10 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400">الأثر</h2>
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
             <div className="text-3xl sm:text-5xl md:text-6xl font-black text-rose-500 dir-ltr">4.066M</div>
             <div className="text-lg font-bold text-slate-700">طن / الهدر الغذائي السنوي العام</div>
             <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl">
               هذه الأرقام تخص الهدر الغذائي عمومًا في المملكة وفق تقديرات رسمية، وليست نوى التمر تحديدًا. لكنها توضح أهمية تطوير حلول رقمية تدعم تعظيم الاستفادة من الموارد الثانوية كالنوى ضمن منظومة الاقتصاد الدائري.
             </p>
           </div>
        </div>
      </section>

      {/* 8. WHY NAWAH (Interactive Visual Flow) */}
      <section id="why-nawah" className="py-24 sm:py-32 bg-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-5xl space-y-20 relative z-10">
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl font-black text-emerald-950"
            >
              عن نواة | لماذا نواة؟
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              تسعى نواة إلى دعم تحويل نوى التمر من مورد ثانوي غير مستثمر بالكامل إلى مورد قابل للتتبع والدراسة والتثمين، من خلال ربط البيانات والذكاء الاصطناعي والأدلة والتجارب وقياس الأثر في منظومة رقمية واحدة.
            </motion.p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 text-lg sm:text-2xl font-black text-slate-300"
          >
            {["هناك إنتاج.", "وهناك مصادر.", "وهناك نوى.", "وهناك دراسات.", "وهناك تجارب."].map((text, i) => (
              <motion.span 
                key={i}
                variants={{
                  visible: { opacity: 1, y: 0, color: "#94a3b8" },
                  hidden: { opacity: 0, y: 10 }
                }}
                className="hover:text-emerald-500 transition-colors cursor-default"
              >
                {text}
              </motion.span>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="bg-emerald-950 rounded-[2.5rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.1)_0%,transparent_100%)] opacity-50" />
            
            <p className="text-2xl sm:text-3xl font-black text-white mb-16 relative z-10">
              لكن القيمة الأكبر تظهر عندما تصبح هذه العناصر <span className="text-amber-400">مرتبطة ببعضها رقميًا</span>.
            </p>
            
            <div className="relative flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base font-bold text-emerald-950 z-10 mb-12">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-emerald-800/50 -translate-y-1/2 z-0 rounded-full" />
              
              {[
                { id: "تسجيل", color: "bg-emerald-100" },
                { id: "تحليل", color: "bg-emerald-200" },
                { id: "دليل", color: "bg-emerald-300" },
                { id: "تجربة", color: "bg-emerald-400" },
                { id: "تتبع", color: "bg-emerald-500" },
                { id: "أثر", color: "bg-amber-400 text-emerald-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]" }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`relative z-10 px-6 py-3 rounded-2xl cursor-default transition-transform ${step.color} ${!step.color.includes('text-') ? 'text-emerald-950 shadow-lg' : ''}`}
                >
                  {step.id}
                </motion.div>
              ))}
            </div>
            
            <p className="text-sm text-emerald-100/60 font-medium max-w-xl mx-auto mb-10 relative z-10">
              تعتمد نواة على سجلات رقمية مترابطة لتتبع الدفعات وربطها بالتحليل والتجارب والأدلة وقياس الأثر لضمان الشفافية والموثوقية.
            </p>

            <div className="relative z-10 flex justify-center">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-emerald-600/30 group/btn"
              >
                <span>تعرّف بالتفصيل على رؤية ورسالة ومبادئ نواة</span>
                <ChevronLeft className="w-4 h-4 text-emerald-200 group-hover/btn:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

          </div>
  );
}
