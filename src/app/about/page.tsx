"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Database, BrainCircuit, Globe, BookOpen, 
  Sparkles, ChevronLeft, ArrowUpRight, ShieldCheck, 
  Leaf, Search, LineChart
} from "lucide-react";

// Helper components for animation
const PathLine = ({ delay = 0, duration = 1.5, vertical = false, dashed = false, className = "" }: { delay?: number, duration?: number, vertical?: boolean, dashed?: boolean, className?: string }) => (
  <motion.div
    initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1, opacity: 0 }}
    whileInView={{ scaleX: 1, scaleY: 1, opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeInOut" }}
    className={`absolute bg-emerald-200/50 ${className} ${
      vertical ? "w-0.5 h-full origin-top" : "h-0.5 w-full origin-left"
    } ${dashed ? "bg-[repeating-linear-gradient(to_right,transparent,transparent_4px,#a7f3d0_4px,#a7f3d0_8px)]" : ""}`}
    style={{ 
      ...(dashed && vertical ? { background: "repeating-linear-gradient(to bottom, transparent, transparent 4px, #a7f3d0 4px, #a7f3d0 8px)" } : {})
    }}
  />
);

const Node = ({ icon: Icon, title, delay = 0, color = "emerald" }: { icon: any, title: string, delay?: number, color?: string }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.5, delay, type: "spring" }}
    className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group"
  >
    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-2 border-${color}-100 shadow-xl shadow-${color}-900/5 flex items-center justify-center text-${color}-600 transition-colors group-hover:border-${color}-300 group-hover:bg-${color}-50`}>
      <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
    </div>
    <span className="text-sm sm:text-base font-black text-slate-700 group-hover:text-emerald-900 transition-colors">
      {title}
    </span>
  </motion.div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-emerald-950 font-sans overflow-x-hidden selection:bg-amber-200 selection:text-emerald-900" dir="rtl">
      
      {/* 1. HERO SECTION (INTERACTIVE) */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20 bg-emerald-950 overflow-hidden border-b-[8px] border-amber-400">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Floating Data Lines (Abstract) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] rounded-full border border-emerald-800/30 border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px] rounded-full border border-amber-500/20 border-dashed"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[40px] rotate-45 flex items-center justify-center shadow-2xl border border-emerald-700 relative group cursor-crosshair"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -45 }}
              transition={{ duration: 0.3 }}
              className="absolute -rotate-45 text-amber-400"
            >
              <Leaf className="w-16 h-16" strokeWidth={1.5} />
            </motion.div>
            
            {/* Glowing nodes emerging from the pit */}
            <motion.div animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-4 -right-4 w-3 h-3 bg-amber-400 rounded-full blur-[2px]" />
            <motion.div animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-4 -left-4 w-3 h-3 bg-emerald-400 rounded-full blur-[2px]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6"
          >
            منصة <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-amber-300">نواة | NAWAH</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-2xl text-emerald-100/80 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            تحويل نوى التمر من مخلف زراعي إلى مورد خاضع للبيانات، التتبع، والتحليل الذكي.
          </motion.p>
        </div>
      </section>

      {/* 2. WHAT IS NAWAH (Interactive Path) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 mb-4">ما هي نواة؟</h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg">
              نواة هي منظومة رقمية متكاملة لرقمنة وتتبع بيانات نوى التمر، تبدأ من جمع الدفعات وصولاً إلى استكشاف فرص التثمين المستندة إلى الأدلة العلمية.
            </p>
          </div>

          <div className="relative py-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
            {/* Horizontal Line Desktop / Vertical Line Mobile */}
            <div className="absolute left-1/2 md:left-0 md:top-1/2 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-0.5 h-full md:w-full md:h-0.5 bg-slate-100 z-0">
               <PathLine duration={2} vertical={false} className="hidden md:block" />
            </div>

            <Node icon={Database} title="بيانات الدفعات" delay={0.2} color="emerald" />
            <Node icon={BrainCircuit} title="التحليل البصري" delay={0.4} color="amber" />
            <Node icon={BookOpen} title="الأدلة والتجارب" delay={0.6} color="emerald" />
            <Node icon={Search} title="فرص التثمين" delay={0.8} color="amber" />
          </div>

        </div>
      </section>

      {/* 3. WHY NAWAH (Central Node with connecting lines) */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/80 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 mb-4 flex items-center justify-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              لماذا أُنشئت نواة؟ (الفجوة)
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-32 w-full mb-8">
              <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-10"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 mb-4 font-bold text-xl">1</div>
                <h3 className="font-black text-emerald-900 mb-2">إنتاج ضخم</h3>
                <p className="text-sm font-medium text-slate-600">المملكة تنتج أكثر من 1.92 مليون طن من التمور سنوياً، تشكل النوى 10% من وزنها.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-10"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 mb-4 font-bold text-xl">2</div>
                <h3 className="font-black text-emerald-900 mb-2">غياب التتبع</h3>
                <p className="text-sm font-medium text-slate-600">تُهدر النوى أو تُباع كعلف بأقل قيمة دون تتبع جودتها أو مصدرها الجغرافي.</p>
              </motion.div>
            </div>

            {/* Central Connector Node */}
            <motion.div 
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 bg-amber-400 rounded-full border-8 border-slate-50 flex items-center justify-center text-emerald-950 z-20 shadow-xl shadow-amber-400/20 my-[-20px] md:my-[-40px]"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-emerald-900 text-white p-8 rounded-3xl mt-8 md:mt-12 text-center relative z-10 w-full max-w-2xl shadow-xl"
            >
              <h3 className="text-xl font-black text-amber-300 mb-3">الحل: الرقمنة والربط</h3>
              <p className="text-sm sm:text-base font-medium text-emerald-50/90 leading-relaxed">
                جاءت منصة نواة لربط هذا المورد الثانوي بسلسلة القيمة الرقمية. نحن نوفر بيئة موثوقة لتوثيق كميات ومواقع النوى، وربطها بالأبحاث العلمية، والتجارب التطبيقية، ومسارات التثمين الفعالة.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION (Connected Timeline) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="relative border-r-4 border-emerald-100 pr-8 sm:pr-12 space-y-20">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -right-[43px] sm:-right-[59px] top-0 w-10 h-10 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-black text-emerald-950 mb-4">رؤيتنا</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                أن تصبح نواة منصة رقمية موثوقة تساعد على تحويل المخلفات الزراعية إلى موارد قابلة للبحث والتتبع والتثمين، بدءًا من نوى التمر في المملكة.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -right-[43px] sm:-right-[59px] top-0 w-10 h-10 bg-white border-4 border-amber-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-black text-emerald-950 mb-4">رسالتنا</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                تمكين إدارة نوى التمر رقميًا من خلال ربط بيانات الدفعات بالذكاء الاصطناعي والأدلة العلمية والتجارب، بما يدعم اتخاذ قرارات أكثر وعيًا حول فرص الاستفادة.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. NAWAH 3 PRINCIPLES (Interactive Connected Nodes) */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#065f46_0%,transparent_50%)] opacity-40"></div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">مبادئ نواة</h2>
            <p className="text-emerald-200 text-lg font-medium">الركائز الثلاث التي تقوم عليها جميع بيانات ونصوص المنصة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-emerald-800/50 -translate-y-1/2 z-0" />

            {[
              { id: "01", title: "المصداقية العلمية", desc: "نميز بدقة بين ما هو محتمل وما تدعمه الأدلة وما تم التحقق منه بالتجربة، دون ادعاءات غير موثقة." },
              { id: "02", title: "التتبع والشفافية", desc: "نربط كل سجل بالمعرف الموحد للدفعة لمتابعة المصدر، التحليل، والأدلة في مسار رقمي شفاف." },
              { id: "03", title: "الاستدامة القابلة للقياس", desc: "ندعم تحويل مفهوم الاستدامة من شعار عام إلى مؤشرات أداء ومعدلات تحويل قابلة للمتابعة." }
            ].map((principle, index) => (
              <motion.div 
                key={principle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-emerald-900/50 backdrop-blur-md border border-emerald-700/50 p-8 rounded-3xl relative z-10 group cursor-default"
              >
                <div className="w-12 h-12 bg-amber-400 text-emerald-950 font-black text-xl flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-amber-400/20 group-hover:scale-110 transition-transform">
                  {principle.id}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{principle.title}</h3>
                <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
                  {principle.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VISION 2030 (National Context with MEWA Logo) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="flex-1 space-y-8 relative z-10 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-full text-sm">
                <Globe className="w-4 h-4" />
                <span>السياق الوطني</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 leading-tight">
                نواة في سياق <br/><span className="text-emerald-600">رؤية السعودية 2030</span>
              </h2>
              
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                تتقاطع نواة مع توجهات الرؤية في مجالات الاستدامة البيئية، والتحول الرقمي، واستثمار البيانات الوطنية، ودعم ممارسات الاقتصاد الدائري وتعظيم الاستفادة من الموارد المحلية، متماشية مع استراتيجيات وزارة البيئة والمياه والزراعة.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative w-full max-w-sm lg:w-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-amber-50 rounded-3xl transform rotate-3 scale-105 z-0" />
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-xl relative z-10 flex flex-col items-center justify-center gap-8">
                <Image 
                  src="/mewa-logo.png" 
                  alt="وزارة البيئة والمياه والزراعة" 
                  width={200} 
                  height={200}
                  className="w-48 h-auto object-contain"
                />
                <div className="h-px w-full bg-slate-100" />
                <Image 
                  src="/nawah-logo.png" 
                  alt="نواة" 
                  width={150} 
                  height={60}
                  className="w-32 h-auto object-contain opacity-80"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. CIRCULAR ECONOMY (Circular Flow Diagram) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-bold px-4 py-2 rounded-full text-sm mb-6">
              <Leaf className="w-4 h-4" />
              <span>نموذج العمل</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 mb-4">الاقتصاد الدائري لنوى التمر</h2>
            <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
              تنتقل نواة بالموارد من خط النهاية إلى بداية دورة جديدة من القيمة والابتكار.
            </p>
          </div>

          {/* Interactive Circular Flow - CSS/Framer trick */}
          <div className="relative max-w-3xl mx-auto aspect-square sm:aspect-video flex items-center justify-center py-20">
            
            {/* The Circle Line */}
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-dashed border-emerald-200"
            />

            {/* Center */}
            <div className="absolute z-20 w-24 h-24 bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white font-black text-lg">
              نواة
            </div>

            {/* Nodes around the circle - positioned absolutely */}
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="absolute -top-4 sm:-top-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10 flex items-center gap-3 w-48 justify-center">
              <Database className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-800 text-sm">1. بيانات وإنتاج</span>
            </motion.div>
            
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute -left-12 sm:-left-24 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10 flex items-center gap-3 w-48 justify-center">
              <BrainCircuit className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-slate-800 text-sm">2. تحليل واختبار</span>
            </motion.div>

            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="absolute -bottom-4 sm:-bottom-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10 flex items-center gap-3 w-48 justify-center">
              <LineChart className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-800 text-sm">3. التثمين</span>
            </motion.div>

            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }} className="absolute -right-12 sm:-right-24 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10 flex items-center gap-3 w-48 justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-800 text-sm">4. الأثر والتتبع</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE CTA */}
      <section className="py-24 bg-emerald-950 relative overflow-hidden border-t-8 border-amber-400">
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -50, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute bg-emerald-400 rounded-full blur-[1px]"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight"
          >
            جاهز لاستكشاف <span className="text-amber-400">المنظومة الرقمية؟</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-emerald-100/90 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10"
          >
            تصفح الخريطة الذكية، قاعدة الأدلة العلمية، أو ابدأ بتسجيل وتتبع الدفعات والتجارب الآن.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-amber-400/10 group"
            >
              <span>الخريطة الذكية</span>
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pit-management/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all border border-emerald-700/50 shadow-xl group"
            >
              <span>إدارة النوى والتتبع</span>
              <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
