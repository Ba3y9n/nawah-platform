"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, BrainCircuit, Globe, 
  Map, LayoutDashboard, QrCode, TestTube2, 
  LineChart, AlertTriangle, ChevronLeft, Search, BookOpen,
  ArrowDown, Recycle
} from "lucide-react";
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
    { num: "01", title: "تسجيل الدفعات", desc: "سجّل دفعات نوى التمر مع بيانات المصدر والكمية والتاريخ والحالة وطرق التخزين والمعالجة. كل دفعة تحصل على معرف رقمي خاص يساعد على تتبعها داخل المنصة.", icon: Database },
    { num: "02", title: "التحليل بالذكاء الاصطناعي", desc: "ارفع صورة لنوى التمر للحصول على تحليل بصري مبدئي. يساعد في التعرف على الخصائص البصرية الظاهرة كالشكل واللون والتجانس. لا يحل التحليل البصري محل الاختبارات المخبرية، ولا يحدد التركيب الكيميائي أو الرطوبة الفعلية.", icon: BrainCircuit },
    { num: "03", title: "اكتشاف الاستخدامات المحتملة", desc: "استكشف مسارات الاستفادة المحتملة من نوى التمر بناءً على البيانات المتاحة ومستوى الأدلة العلمية. تساعد المنصة على التمييز بين: استخدامات مدعومة بالدراسات، قيد التحقق، تجريبية، وحالات لا تتوفر عنها بيانات كافية.", icon: Search },
    { num: "04", title: "التجارب", desc: "أنشئ تجربة مرتبطة بالدفعة التي تعمل عليها. وثّق: هدف التجربة، الكمية المستخدمة، طريقة المعالجة، مدة التجربة، الملاحظات، النتائج، وحالة التجربة. وبذلك تكون التجربة جزءًا من سجل قابل للتتبع.", icon: TestTube2 },
    { num: "05", title: "الأدلة والمصادر", desc: "تربط نواة مسارات الاستخدام بالمصادر والدراسات المتاحة، مع توضيح مستوى الأدلة. لا تعتمد المنصة على إنشاء معلومات علمية من تلقاء نفسها، بل تنظم المعلومات الموثوقة وتميز ما هو مثبت عما يحتاج للتحقق.", icon: BookOpen },
    { num: "06", title: "الخريطة الذكية", desc: "تعرض الخريطة المصادر والدفعات المرتبطة بها جغرافيًا، مع تنظيم البيانات حسب: المنطقة ← المدينة ← المصدر ← الدفعات. مما يساعد على تكوين صورة أوضح عن التوزيع.", icon: Map },
    { num: "07", title: "قياس الأثر", desc: "تحول البيانات المسجلة في المنصة إلى مؤشرات قابلة للمتابعة، مثل: كمية النوى المسجلة، عدد الدفعات، عدد التجارب، عدد المصادر، والكمية التي تم توثيق إعادة استخدامها. وتُحتسب مؤشرات المنصة من البيانات الفعلية المسجلة.", icon: LineChart },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-1/3 space-y-4">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right ${
              activeStep === idx 
                ? "bg-white border-2 border-emerald-500 shadow-lg text-emerald-950" 
                : "bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-white hover:shadow-md"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
              activeStep === idx ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
            }`}>
              {step.num}
            </div>
            <span className="font-bold">{step.title}</span>
          </button>
        ))}
      </div>
      <div className="lg:w-2/3 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-emerald-950 text-white p-10 md:p-16 rounded-3xl w-full h-full min-h-[400px] flex flex-col justify-center relative overflow-hidden shadow-2xl"
          >
            {/* Abstract Background Element */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon className="w-8 h-8 text-amber-400" />;
                })()}
              </div>
              <h3 className="text-3xl font-black mb-6">{steps[activeStep].title}</h3>
              <p className="text-emerald-100 text-lg leading-relaxed text-justify">
                {steps[activeStep].desc}
              </p>
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
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-white overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
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

          {/* Hero Visual Image Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 lg:mt-24 w-full h-[300px] md:h-[450px] lg:h-[550px] relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white"
          >
            <Image 
              src="/hero-visual.png" 
              alt="العرض البصري لمنصة نواة" 
              fill 
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM (Visual Storytelling) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">المشكلة</h2>
            <p className="text-slate-500 text-lg">قطاع ضخم… ومورد ثانوي يحتاج إلى منظومة استثمار</p>
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-emerald-950">حجم المورد المحتمل</h2>
            <p className="text-slate-500 text-lg">من كل ثمرة… مورد يستحق الدراسة</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl">
              <p className="font-bold text-slate-700">إنتاج التمور</p>
            </div>
            
            <ArrowDown className="w-6 h-6 text-slate-300" />
            
            <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl max-w-sm">
              <p className="font-bold text-slate-700">نسبة النوى (≈ 10%)</p>
              <p className="text-xs text-slate-500 mt-1">متوسط مبني على الدراسات العلمية لوزن النواة من الثمرة.</p>
            </div>

            <ArrowDown className="w-6 h-6 text-slate-300" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              className="relative bg-emerald-950 text-white rounded-3xl p-10 md:p-16 shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/hero-bg.png')] opacity-10 mix-blend-overlay bg-cover bg-center" />
              <div className="relative z-10 space-y-4">
                <div className="text-5xl md:text-7xl font-black text-amber-400 dir-ltr">≈ 192K</div>
                <div className="text-xl font-bold">طن من النوى (تقدير نظري)</div>
                <p className="text-sm text-emerald-100/70 pt-6 border-t border-white/10 mt-6">
                  ملاحظة: هذا تقدير حسابي مبني على نسبة منشورة في الدراسات، وليس إحصائية رسمية لكمية نوى التمر المتخلفة فعليًا في المملكة. وهو يوضح حجم الفرصة المحتملة لدراسة وتثمين نوى التمر.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Interactive Timeline) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">كيف تعمل نواة؟</h2>
            <p className="text-slate-500 text-lg">مسار رقمي واحد قابل للتتبع</p>
          </div>
          
          <InteractiveTimeline />
        </div>
      </section>

      {/* 5. FEATURES SHOWCASE */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-slate-500 text-lg">منظومة واحدة بدل بيانات متفرقة</p>
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
                    <div className="h-10 w-px md:h-px md:w-full bg-emerald-800 relative">
                       <motion.div 
                         initial={{ width: 0, height: 0 }} 
                         whileInView={{ width: "100%", height: "100%" }} 
                         transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                         className="absolute top-0 left-0 bg-amber-400 hidden md:block w-full h-px"
                       />
                       <motion.div 
                         initial={{ height: 0 }} 
                         whileInView={{ height: "100%" }} 
                         transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                         className="absolute top-0 left-0 bg-amber-400 md:hidden w-px h-full"
                       />
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

      {/* 9. DEVELOPMENT TEAM */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-12">
          <h2 className="text-2xl font-black text-emerald-950">فريق التطوير</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "بيان المطيري", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "آية السعدني", link: "https://www.linkedin.com/in/ayah-alsadany" },
              { name: "هبه عبداللطيف", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "حنين القصير", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
              { name: "وفاء المصري", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "د. نجوى الخطيب", link: null }
            ].map((m, i) => (
              m.link ? (
                <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-slate-50 border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors group shadow-sm hover:shadow-md">
                  <span className="font-bold text-sm text-slate-700 group-hover:text-emerald-700 transition-colors">{m.name}</span>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">LinkedIn</span>
                </a>
              ) : (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm cursor-default">
                  <span className="font-bold text-sm text-slate-700">{m.name}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
