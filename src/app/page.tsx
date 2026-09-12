"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ArrowLeft, Leaf, Recycle, Database, 
  BrainCircuit, Factory, Globe, ShieldCheck, 
  Map, LayoutDashboard, QrCode, TestTube2, 
  LineChart, AlertTriangle, CheckCircle2,
  ChevronLeft, TreePine, TrendingUp
} from "lucide-react";

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-emerald-950 font-sans selection:bg-amber-200 selection:text-emerald-900 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 bg-gradient-to-b from-slate-50 to-white overflow-hidden border-b border-emerald-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-5xl">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>المنصة الوطنية للتدوير الحيوي لاستغلال نوى التمر</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-7xl font-black text-emerald-950 tracking-tight leading-tight">
              نحو دورة حياة <span className="text-emerald-600">جديدة</span> <br className="hidden sm:block" /> لنوى التمر في المملكة
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              منصة رقمية متكاملة لتحويل نوى التمر من مخلفات زراعية إلى موارد صناعية حيوية، عبر التتبع الموثوق، التحليل الذكي، وربط أطراف سلسلة القيمة.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/pit-management/dashboard"
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-900/10 hover:-translate-y-0.5"
              >
                <span>ابدأ الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Flow Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Leaf, label: "نوى التمر" },
              { icon: Database, label: "بيانات موثقة" },
              { icon: BrainCircuit, label: "تحليل ذكي" },
              { icon: Factory, label: "تدوير حيوي" },
              { icon: Globe, label: "أثر مستدام" },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-700 relative z-10">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{step.label}</span>
                </div>
                {idx !== arr.length - 1 && (
                  <div className="hidden md:block w-8 h-[2px] bg-emerald-200" />
                )}
                {idx !== arr.length - 1 && (
                  <div className="md:hidden h-8 w-[2px] bg-emerald-200" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. The Problem (National Statistics) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">قطاع التمور في المملكة</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">إحصائيات وطنية رسمية تعكس حجم الإنتاج والقوة الاقتصادية للقطاع</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <TreePine className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">37.6 مليون</div>
                <div className="text-sm font-bold text-slate-500">نخلة في المملكة</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <Database className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">1.92 مليون</div>
                <div className="text-sm font-bold text-slate-500">طن إنتاج سنوي من التمور</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <LineChart className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">584 ألف</div>
                <div className="text-sm font-bold text-slate-500">طن إنتاج منطقة القصيم (الأعلى)</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <Globe className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">133 دولة</div>
                <div className="text-sm font-bold text-slate-500">تصل إليها صادرات التمور السعودية</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <ArrowLeft className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">1.695 مليار</div>
                <div className="text-sm font-bold text-slate-500">ريال قيمة الصادرات</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center gap-4 hover:border-emerald-200 transition-colors">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
              <div>
                <div className="text-4xl font-black text-emerald-950 mb-1">192.5%</div>
                <div className="text-sm font-bold text-slate-500">نسبة النمو في الصادرات</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Potential Resource */}
      <section className="py-20 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/grid.svg')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900 border border-emerald-700 mb-8">
            <Recycle className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">المورد غير المستغل</h2>
          <p className="text-xl text-emerald-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            من إجمالي الإنتاج الضخم، تُشكل النوى موردًا حيويًا غير مستغل بالكامل.
          </p>
          <div className="bg-emerald-900/50 border border-emerald-800 rounded-3xl p-10 mb-8 backdrop-blur-sm">
            <div className="text-5xl md:text-7xl font-black text-amber-400 mb-4 dir-ltr">192,000</div>
            <div className="text-lg md:text-xl font-bold text-white mb-2">طن من نوى التمر سنويًا (مُقدّر)</div>
          </div>
          
          <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-right">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white">تنويه هام:</span> هذا التقدير (192 ألف طن) هو حساب تقريبي مبني على افتراض أن النواة تمثل حوالي 10% من وزن التمرة بناءً على بعض الدراسات العلمية، مضروباً في إجمالي الإنتاج السنوي (1.92 مليون طن). هذا الرقم للاستئناس وليس إحصائية رسمية صادرة عن جهة حكومية.
            </p>
          </div>
        </div>
      </section>

      {/* 4 & 5. The Solution & How it Works (Timeline) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">كيف تعمل منصة نواة؟</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">رحلة النواة من المصدر إلى المنتج النهائي عبر منظومة رقمية متكاملة</p>
          </div>

          <div className="space-y-12">
            {[
              { num: "01", title: "تسجيل المصدر", desc: "توثيق مصانع التمور ومراكز التجميع كمنتجين موثوقين للنوى.", icon: Map },
              { num: "02", title: "إنشاء الدفعة (Batch)", desc: "تسجيل الكميات وإصدار معرف فريد (ID) لكل دفعة لضمان التتبع.", icon: Database },
              { num: "03", title: "توليد رمز الاستجابة (QR)", desc: "طباعة ملصقات QR لكل شحنة لتسهيل التتبع اللوجستي.", icon: QrCode },
              { num: "04", title: "التحليل البصري (AI)", desc: "فحص جودة وتجانس النوى باستخدام نماذج الرؤية الحاسوبية.", icon: BrainCircuit },
              { num: "05", title: "تحديد المسار", desc: "توجيه الدفعات للمسار الأنسب (فحم منشط، أعلاف، زيت، بديل قهوة).", icon: LayoutDashboard },
              { num: "06", title: "التجارب المختبرية", desc: "تسجيل نتائج معالجة النوى والمخرجات الفعلية وربطها بالدفعة.", icon: TestTube2 },
              { num: "07", title: "قياس الأثر", desc: "حساب العوائد البيئية والاقتصادية للمواد المحوّلة.", icon: LineChart },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start relative">
                {idx !== 6 && (
                  <div className="absolute top-14 bottom-[-3rem] right-7 w-[2px] bg-emerald-100 z-0" />
                )}
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 relative z-10 border-4 border-slate-50 shadow-sm">
                  {step.num}
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-xl font-bold text-emerald-950">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">خصائص المنصة الأساسية</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">أدوات متطورة لضمان الموثوقية والكفاءة في إدارة الموارد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "تتبع متكامل", desc: "من المصدر حتى الاستخدام النهائي بنظام الباتشات." },
              { title: "قاعدة بيانات سحابية", desc: "بنية تحتية قوية وموثوقة لحفظ البيانات." },
              { title: "رؤية حاسوبية", desc: "تقييم جودة النوى آلياً باستخدام الذكاء الاصطناعي." },
              { title: "إدارة التجارب", desc: "توثيق علمي لعمليات التحويل والمخرجات." },
              { title: "ملصقات ذكية", desc: "توليد تلقائي للـ QR Codes لتسهيل العمليات اللوجستية." },
              { title: "مؤشرات حية", desc: "لوحات تحكم تفاعلية لمتابعة الأداء الفعلي." },
              { title: "حساب الأثر", desc: "أدوات مدمجة لتقدير خفض الانبعاثات الكربونية." },
              { title: "أمان وموثوقية", desc: "صلاحيات دقيقة وفصل محكم للبيانات." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-emerald-950 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Impact */}
      <section className="py-24 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black">أثر بيئي واقتصادي مستدام</h2>
            <p className="text-emerald-200 max-w-2xl mx-auto text-sm">تساهم المنصة في تحقيق مستهدفات الاستدامة عبر تحويل النفايات إلى موارد</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-emerald-800/50 border border-emerald-700 p-8 rounded-full w-64 h-64 flex flex-col items-center justify-center text-center gap-3">
              <Recycle className="w-8 h-8 text-amber-400" />
              <h3 className="font-bold text-lg">تقليل النفايات</h3>
              <p className="text-xs text-emerald-200">تحويل النوى عن المدافن</p>
            </div>
            
            <div className="hidden md:block w-16 h-[2px] bg-emerald-700" />
            
            <div className="bg-emerald-800/50 border border-emerald-700 p-8 rounded-full w-64 h-64 flex flex-col items-center justify-center text-center gap-3">
              <Globe className="w-8 h-8 text-amber-400" />
              <h3 className="font-bold text-lg">خفض الانبعاثات</h3>
              <p className="text-xs text-emerald-200">تقليل غاز الميثان</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] bg-emerald-700" />
            
            <div className="bg-emerald-800/50 border border-emerald-700 p-8 rounded-full w-64 h-64 flex flex-col items-center justify-center text-center gap-3">
              <Factory className="w-8 h-8 text-amber-400" />
              <h3 className="font-bold text-lg">قيمة اقتصادية</h3>
              <p className="text-xs text-emerald-200">مواد خام صناعية جديدة</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. National Context (Food Waste) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center space-y-8">
            <div className="space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-black text-emerald-950">السياق الوطني الأوسع</h2>
              <p className="text-sm text-slate-600">منظور الهدر الغذائي العام في المملكة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-black text-red-600 mb-1 dir-ltr">4,066,000</div>
                <div className="text-xs font-bold text-slate-500">طن من الهدر والفقد الغذائي سنويًا</div>
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-black text-red-600 mb-1 dir-ltr">40.48 مليار</div>
                <div className="text-xs font-bold text-slate-500">ريال قيمة الهدر الغذائي سنويًا</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed bg-slate-100 p-4 rounded-xl">
              هذه الإحصائيات تمثل <span className="font-bold text-slate-700">إجمالي الهدر الغذائي</span> في المملكة العربية السعودية بمختلف أنواعه، وليس خاصًا بقطاع التمور. منصة نواة تساهم في معالجة جزء من هذا التحدي عبر التركيز الاستراتيجي على مخلفات التمور.
            </div>
          </div>
        </div>
      </section>

      {/* 9. Vision & CTA */}
      <section className="py-32 bg-emerald-950 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white">نحو دورة حياة جديدة لنوى التمر</h2>
          <p className="text-emerald-200 text-lg">انضم إلى المنظومة وساهم في بناء اقتصاد دائري مستدام.</p>
          <div className="pt-8">
            <Link
              href="/pit-management/dashboard"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-10 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-amber-400/10 hover:-translate-y-1"
            >
              <span>تسجيل الدخول للمنصة</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Data Sources Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-xs border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <p className="font-bold text-slate-300">مصادر البيانات والإحصائيات الواردة في هذه الصفحة:</p>
          <ul className="space-y-2 inline-block text-right list-disc list-inside">
            <li>إحصائيات النخيل وإنتاج التمور وصادراتها: وزارة البيئة والمياه والزراعة، والمركز الوطني للنخيل والتمور.</li>
            <li>إحصائيات الهدر والفقد الغذائي: المؤسسة العامة للحبوب (سابقاً) / الهيئة العامة للأمن الغذائي.</li>
            <li>تقدير كمية النوى (192 ألف طن): عملية حسابية مبنية على تقدير نسبة النواة (حوالي 10%) من إجمالي الإنتاج.</li>
          </ul>
          <div className="pt-8 text-slate-600">
            &copy; {new Date().getFullYear()} منصة نواة NAWAH. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

    </div>
  );
}
