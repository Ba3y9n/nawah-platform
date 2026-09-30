"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, 
  Database, 
  BrainCircuit, 
  Search, 
  TestTube, 
  BookOpen, 
  Globe 
} from "lucide-react";

const JOURNEY_STEPS = [
  { 
    id: 'source', 
    title: 'المصدر', 
    icon: Map, 
    angle: 0,
    desc: 'توثيق مصدر النوى من المزارع أو المصانع أو مراكز التجميع لضمان الموثوقية العالية.' 
  },
  { 
    id: 'batch', 
    title: 'الدفعة', 
    icon: Database, 
    angle: 51.4,
    desc: 'تسجيل كمية محددة من النوى وإنشاء سجل رقمي ومعرف تتبع خاص بها.' 
  },
  { 
    id: 'analysis', 
    title: 'التحليل', 
    icon: BrainCircuit, 
    angle: 102.8,
    desc: 'تحليل بصري تقديري لصور النوى باستخدام الذكاء الاصطناعي، دون اعتباره بديلاً عن الفحوصات المخبرية.' 
  },
  { 
    id: 'uses', 
    title: 'الاستخدامات', 
    icon: Search, 
    angle: 154.2,
    desc: 'استكشاف مسارات الاستفادة المحتملة استنادًا إلى البيانات والأدلة المتاحة.' 
  },
  { 
    id: 'experiment', 
    title: 'التجربة', 
    icon: TestTube, 
    angle: 205.7,
    desc: 'ربط الدفعة بالتجارب والفحوصات التي تنفذها الجهات المختصة وتوثيق نتائجها عند توفرها.' 
  },
  { 
    id: 'results', 
    title: 'النتائج', 
    icon: BookOpen, 
    angle: 257.1,
    desc: 'استعراض مخرجات التجارب المخبرية والتطبيقية ومقارنة خصائص النوى.' 
  },
  { 
    id: 'impact', 
    title: 'الأثر', 
    icon: Globe, 
    angle: 308.5,
    desc: 'تقييم الأثر البيئي والاقتصادي لدعم تطبيقات الاقتصاد الدائري والاستدامة.' 
  }
];

export default function JourneyDiagram() {
  const [activeId, setActiveId] = useState('batch');

  const activeStep = JOURNEY_STEPS.find(s => s.id === activeId) || JOURNEY_STEPS[1];
  const radius = 160; // Distance from center

  return (
    <div 
      className="relative w-full min-h-[700px] flex flex-col items-center justify-center p-6 overflow-hidden bg-white rounded-3xl"
      dir="rtl"
    >
      {/* 1. BACKGROUND EFFECTS (Grid & Glow) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50/40 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* 2. CIRCULAR DIAGRAM */}
      <div className="relative w-[400px] h-[400px] flex items-center justify-center mb-16 mt-8 z-10">
        
        {/* Faint Connecting Ring */}
        <div className="absolute w-[320px] h-[320px] rounded-full border-[1.5px] border-slate-100/80" />

        {/* Center Node (NAWAH) */}
        <div className="relative z-20 flex flex-col items-center justify-center w-36 h-36 bg-white rounded-full shadow-[0_0_40px_rgba(0,0,0,0.04)] border-4 border-white">
          <div className="absolute w-44 h-44 rounded-full border border-emerald-50 opacity-50 pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full border border-emerald-50/30 opacity-50 pointer-events-none" />
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
            نواة
          </h2>
          <span className="text-[11px] font-bold text-emerald-500 tracking-widest uppercase">
            NAWAH
          </span>
        </div>

        {/* Outer Nodes */}
        {JOURNEY_STEPS.map((step) => {
          const isActive = step.id === activeId;
          const radian = (step.angle * Math.PI) / 180;
          const x = Math.sin(radian) * radius;
          const y = -Math.cos(radian) * radius;

          return (
            <div 
              key={step.id}
              className="absolute flex flex-col items-center justify-center transition-all duration-500 ease-out z-30"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              {/* Node Circle */}
              <button
                onClick={() => setActiveId(step.id)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                  isActive 
                    ? 'w-24 h-24 bg-[#047857] shadow-[0_0_40px_rgba(4,120,87,0.3)] scale-100' 
                    : 'w-[72px] h-[72px] bg-white border-[1.5px] border-slate-100 shadow-sm hover:scale-105 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-full bg-[#047857] opacity-20 blur-xl scale-150 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <step.icon 
                  size={isActive ? 32 : 28} 
                  strokeWidth={isActive ? 1.5 : 1.5}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`} 
                />
              </button>

              {/* Node Title */}
              <span 
                className={`absolute top-full mt-3 text-sm transition-all duration-300 ${
                  isActive 
                    ? 'font-black text-slate-900 scale-110' 
                    : 'font-bold text-slate-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. INFORMATION CARD (Bottom) */}
      <div className="relative z-20 w-full max-w-2xl px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center gap-5"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-slate-900">
                {activeStep.title}
              </h3>
              <div className="w-12 h-12 rounded-2xl bg-[#047857] flex items-center justify-center shrink-0">
                <activeStep.icon size={24} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            
            <p className="text-slate-500 font-medium leading-relaxed text-sm max-w-lg">
              {activeStep.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
