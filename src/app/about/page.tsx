"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Database, BrainCircuit, Globe, BookOpen, TestTube2, 
  Sparkles, ArrowRight, ShieldCheck, Compass, Scale, 
  Recycle, ChevronLeft, ArrowUpRight, CheckCircle2, Info
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-emerald-950 font-sans selection:bg-amber-200 selection:text-emerald-900" dir="rtl">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 bg-white border-b border-slate-200/80 overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>منظومة التتبع والاستفادة الرقمية</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-tight mb-6"
          >
            عن منصة <span className="text-emerald-700">نواة | NAWAH</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            منصة رقمية لإدارة وتتبع نوى التمر وربط بياناتها بالأدلة العلمية والتجارب وفرص التثمين في منظومة رقمية واحدة.
          </motion.p>
        </div>
      </section>

      {/* 2. WHAT IS NAWAH & WHY NAWAH */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          {/* WHAT IS NAWAH CARD */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950">ما هي نواة؟</h2>
            </div>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
              <strong className="text-emerald-950 font-black">نواة | NAWAH</strong> هي منصة رقمية لإدارة وتتبع نوى التمر، تربط بيانات الدفعات بالذكاء الاصطناعي والأدلة العلمية والتجارب والخريطة وقياس الأثر، بهدف دعم الانتقال من التعامل مع النوى كمخلف إلى التعامل معه كمورد قابل للتتبع والدراسة واستكشاف فرص التثمين.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 mb-1">بيانات الدفعات</span>
                <span className="text-sm font-black text-emerald-900">Data</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 mb-1">التحليل البصري</span>
                <span className="text-sm font-black text-emerald-900">AI Analysis</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 mb-1">الأدلة والتجارب</span>
                <span className="text-sm font-black text-emerald-900">Evidence</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-500 mb-1">التتبع والأثر</span>
                <span className="text-sm font-black text-emerald-900">Impact</span>
              </div>
            </div>
          </div>

          {/* WHY NAWAH / THE GAP */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              لماذا أُنشئت نواة؟ (الفجوة والمشكلة)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              تمتلك المملكة العربية السعودية قطاعاً ضخماً للتمور بإنتاج يتجاوز <strong className="text-emerald-950 font-bold dir-ltr">1.92 مليون طن</strong> سنوياً وأكثر من <strong className="text-emerald-950 font-bold dir-ltr">37.6 مليون نخلة</strong>. ومع حركة التجهيز والتصنيع، تتولد كميات كبيرة من نوى التمر (تشكل حوالي 10% من وزن الثمرة).
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              تتمثل الفجوة الحقيقية في غياب التتبع الرقمي الموحد وربط بيانات كميات ومواقع النوى بالأبحاث العلمية والتجارب التطبيقية ومسارات التثمين. جاءت منصة <strong className="text-emerald-950 font-bold">نواة</strong> لربط هذا المورد الثانوي بسلسلة القيمة الرقمية وضمان الموثوقية والشفافية.
            </p>
          </div>

        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="py-16 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 grid md:grid-cols-2 gap-8">
          
          {/* VISION */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-amber-300">رؤيتنا</h3>
            <p className="text-emerald-50 text-base sm:text-lg leading-relaxed font-medium">
              "أن تصبح نواة منصة رقمية موثوقة تساعد على تحويل المخلفات الزراعية إلى موارد قابلة للبحث والتتبع والتثمين، بدءًا من نوى التمر في المملكة."
            </p>
          </div>

          {/* MISSION */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-emerald-300">رسالتنا</h3>
            <p className="text-emerald-50 text-base sm:text-lg leading-relaxed font-medium">
              "تمكين إدارة نوى التمر رقميًا من خلال ربط بيانات الدفعات بالذكاء الاصطناعي والأدلة العلمية والتجارب والتتبع وقياس الأثر، بما يدعم اتخاذ قرارات أكثر وعيًا حول فرص الاستفادة من هذا المورد."
            </p>
          </div>

        </div>
      </section>

      {/* 4. NAWAH 3 PRINCIPLES */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-emerald-950">مبادئ نواة</h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">الركائز الثلاث التي تقوم عليها جميع بيانات ونصوص المنصة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* PRINCIPLE 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="text-emerald-700 font-black text-xs tracking-widest uppercase">01</div>
              <h3 className="text-xl font-black text-emerald-950">المصداقية العلمية</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                نميز بدقة بين ما هو محتمل وما تدعمه الأدلة وما تم التحقق منه بالتجربة، دون إطلاق ادعاءات غير موثقة.
              </p>
            </div>

            {/* PRINCIPLE 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="text-emerald-700 font-black text-xs tracking-widest uppercase">02</div>
              <h3 className="text-xl font-black text-emerald-950">التتبع والشفافية</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                نربط كل سجل بالمعرف الموحد للدفعة `NW-2026-XXXX` لمتابعة المصدر، التحليل، والأدلة في مسار رقمي شفاف.
              </p>
            </div>

            {/* PRINCIPLE 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="text-emerald-700 font-black text-xs tracking-widest uppercase">03</div>
              <h3 className="text-xl font-black text-emerald-950">الاستدامة القابلة للقياس</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                ندعم تحويل مفهوم الاستدامة من شعار عام إلى مؤشرات أداء ومعدلات تحويل قابلة للمتابعة عند توفر البيانات.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SAUDI VISION 2030 & CIRCULAR ECONOMY */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950">نواة في سياق رؤية السعودية 2030</h2>
            </div>
            
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              تتقاطع نواة مع توجهات رؤية السعودية 2030 في مجالات الاستدامة البيئية، والتحول الرقمي، واستثمار البيانات الوطنية، ودعم ممارسات الاقتصاد الدائري وتعظيم الاستفادة من الموارد المحلية.
            </p>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-emerald-900 font-medium">
              تركز منصة نواة حالياً على نوى التمر كنموذج تطبيقي أول، مع إمكانية توسيع المنهجية مستقبلاً ليشمل موارد ومخلفات زراعية أخرى داخل المملكة.
            </div>
          </div>

          {/* CIRCULAR ECONOMY */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950">نواة والاقتصاد الدائري</h2>
            </div>
            
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              تدعم نواة مفهوم الاقتصاد الدائري من خلال تنظيم بيانات نوى التمر وربطها بمسارات الاستفادة المحتملة والأدلة والتجارب وقياس الأثر، بما يساعد على استكشاف فرص إبقاء الموارد داخل دورة القيمة بدلاً من التخلص منها كمخلفات زراعية.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CTA / EXPLORE JOURNEY */}
      <section className="py-16 bg-emerald-950 text-white border-t border-emerald-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">جاهز لاستكشاف المنظومة الرقمية؟</h2>
          <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-xl mx-auto">
            تصفح الخريطة الذكية، قاعدة الأدلة العلمية، أو ابدأ بتسجيل وتتبع الدفعات والتجارب الآن.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-amber-400/10"
            >
              <span>استكشف كيف تعمل نواة</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/pit-management/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-850 text-emerald-100 font-bold px-8 py-4 rounded-2xl text-sm transition-all border border-emerald-700"
            >
              <span>إدارة النوى والتتبع</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
