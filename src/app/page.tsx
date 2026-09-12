"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ArrowLeft, Leaf, Recycle, Database, 
  BrainCircuit, Factory, Globe, ShieldCheck, 
  Map, LayoutDashboard, QrCode, TestTube2, 
  LineChart, AlertTriangle, CheckCircle2,
  ChevronLeft, TreePine, TrendingUp,
  Search, BookOpen, Microscope, BarChart3,
  Network
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
    <div className="min-h-screen bg-white text-emerald-950 font-sans selection:bg-amber-200 selection:text-emerald-900 overflow-hidden" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 bg-emerald-950 overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/hero-bg.png" 
            alt="Date Pits Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-emerald-900/40" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-5xl">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="space-y-10 flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 mb-4 inline-block">
              <Image 
                src="/nawah-logo.png" 
                alt="نواة | NAWAH" 
                width={300} 
                height={150} 
                className="w-auto h-24 md:h-32 object-contain filter drop-shadow-lg"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400 tracking-tight">
                من نواة التمر… نصنع قيمة
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-emerald-50 max-w-4xl mx-auto leading-relaxed">
                منصة رقمية ذكية لإدارة نوى التمر واستكشاف فرص الاستفادة منها، تربط البيانات والذكاء الاصطناعي والأدلة العلمية والتجارب وقياس الأثر في منظومة واحدة، لدعم الانتقال من التعامل مع النوى كمخلف إلى التعامل معه كمورد قابل للتتبع والدراسة والتثمين.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/pit-management/dashboard"
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-10 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-amber-400/20 hover:-translate-y-0.5"
              >
                <span>الدخول للمنصة</span>
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">المشكلة</h2>
            <p className="text-emerald-700 text-lg font-bold">قطاع ضخم… ومورد ثانوي يحتاج إلى منظومة استثمار</p>
          </div>

          <div className="prose prose-lg prose-emerald mx-auto text-slate-700 text-justify leading-loose max-w-4xl space-y-6">
            <p>
              تُعد المملكة العربية السعودية من أبرز الدول في إنتاج وتصدير التمور. وفي عام 2024 بلغ إنتاج المملكة نحو 1.92 مليون طن من التمور، مع أكثر من 37.6 مليون نخلة.
            </p>
            <p>
              وتتصدر منطقة القصيم مناطق المملكة في إنتاج التمور، بإنتاج بلغ نحو 584,127.8 طنًا خلال عام 2024.
            </p>
            <p>
              ولا تقتصر أهمية قطاع التمور على حجم الإنتاج؛ فقد بلغت قيمة صادرات التمور السعودية نحو 1.695 مليار ريال في عام 2024، ووصلت التمور السعودية إلى 133 دولة حول العالم، مع نمو قيمة الصادرات منذ عام 2016 بنسبة 192.5%.
            </p>
            <p>
              ومع هذا الحجم من الإنتاج والتجهيز والتصنيع، تظهر منتجات ثانوية من بينها نوى التمر.
            </p>
            <p>
              وتشير دراسات علمية إلى أن نوى التمر يمثل في المتوسط نحو 10% من وزن ثمرة التمر، مع اختلاف النسبة بحسب الصنف والظروف.
            </p>
            <p>
              وبناءً على هذه النسبة، يمكن تقدير حجم نظري يقارب 192 ألف طن من النوى عند تطبيق نسبة 10% على إنتاج المملكة من التمور في عام 2024.
            </p>
            
            <div className="flex items-start gap-3 bg-slate-100 border border-slate-200 rounded-xl p-5 text-right mt-8">
              <AlertTriangle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed m-0 font-medium">
                ملاحظة: هذا الرقم تقدير حسابي مبني على نسبة منشورة في الدراسات، وليس إحصائية رسمية لكمية نوى التمر المتخلفة فعليًا في المملكة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Real Challenge */}
      <section className="py-20 bg-emerald-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <h2 className="text-3xl font-black text-amber-400">التحدي الحقيقي</h2>
          <p className="text-xl leading-relaxed">
            المشكلة لا تتمثل في وجود نوى التمر فقط، بل في الحاجة إلى منظومة تساعد على:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-bold text-emerald-100 py-6 bg-emerald-950/50 rounded-3xl p-6 border border-emerald-800">
            <span>تسجيل مصدر النوى</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>تتبع الدفعات</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>تحليلها</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>استكشاف فرص الاستفادة</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>توثيق التجارب</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>ربطها بالأدلة</span>
            <ChevronLeft className="w-4 h-4 text-emerald-600" />
            <span>وقياس الأثر.</span>
          </div>
          <p className="text-2xl font-black text-white">وهنا تأتي نواة | NAWAH.</p>
        </div>
      </section>

      {/* 4. Stats Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">حجم قطاع التمور في المملكة</h2>
            <p className="text-emerald-700 text-lg font-bold">أرقام تعكس حجم الفرصة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">1.92 مليون طن</div>
              <div className="text-base font-bold text-slate-600">إنتاج المملكة من التمور في 2024</div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">37.6+ مليون نخلة</div>
              <div className="text-base font-bold text-slate-600">عدد أشجار النخيل في المملكة</div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">584 ألف طن</div>
              <div className="text-base font-bold text-slate-600">إنتاج منطقة القصيم من التمور في 2024</div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">1.695 مليار ريال</div>
              <div className="text-base font-bold text-slate-600">قيمة صادرات التمور السعودية في 2024</div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">133 دولة</div>
              <div className="text-base font-bold text-slate-600">وصلت إليها صادرات التمور السعودية</div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="text-4xl font-black text-emerald-950 mb-3 dir-ltr">192.5%</div>
              <div className="text-base font-bold text-slate-600">نمو قيمة صادرات التمور منذ 2016</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Potential Resource */}
      <section className="py-24 bg-emerald-50 border-y border-emerald-100">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">حجم المورد المحتمل</h2>
          <p className="text-emerald-700 text-lg font-bold">من كل ثمرة… مورد يستحق الدراسة</p>
          
          <div className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto space-y-4">
            <p>تشير الدراسات العلمية إلى أن نوى التمر قد يمثل نحو 10% من وزن الثمرة في المتوسط، مع اختلاف النسبة بين الأصناف.</p>
            <p>وبتطبيق هذه النسبة بشكل حسابي على إنتاج المملكة من التمور في 2024:</p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-3xl p-10 max-w-2xl mx-auto shadow-sm my-8">
            <div className="text-5xl md:text-6xl font-black text-emerald-600 mb-4 dir-ltr">≈ 192 ألف طن</div>
            <div className="text-lg font-bold text-slate-500">تقدير نظري لكمية النوى</div>
          </div>

          <p className="text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
            هذا التقدير يوضح حجم الفرصة المحتملة لدراسة وتثمين نوى التمر، ولا يمثل كمية رسمية للنوى المتخلفة أو المهدر منها.
          </p>
        </div>
      </section>

      {/* 6. The Solution & Nawah Cycle */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">الحل</h2>
            <p className="text-amber-500 text-2xl font-bold">نواة | NAWAH</p>
          </div>

          <div className="text-lg text-slate-700 leading-relaxed max-w-4xl mx-auto space-y-6">
            <p>نواة هي منظومة رقمية تهدف إلى تنظيم دورة حياة نوى التمر، بدءًا من مصدره وحتى استكشاف فرص الاستفادة منه وقياس الأثر الناتج.</p>
            <p>بدل أن تكون بيانات النوى موزعة بين مصادر وملفات وتجارب منفصلة، تجمع نواة المعلومات في مسار رقمي واحد قابل للتتبع.</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 mt-12">
            <h3 className="text-2xl font-black text-emerald-950 mb-8">دورة نواة</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-bold text-emerald-800 mb-8">
              <span>المصدر</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>الدفعة</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>التحليل</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>الاستخدامات المحتملة</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>التجربة</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>النتائج</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>الأثر</span>
            </div>
            <p className="text-slate-600 text-base leading-relaxed max-w-3xl mx-auto">
              ولا تفترض نواة استخدامًا نهائيًا واحدًا للنوى، بل تساعد على استكشاف المسارات المحتملة وفق البيانات والأدلة والتجارب.
            </p>
          </div>
        </div>
      </section>

      {/* 7. How it Works */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">كيف تعمل نواة؟</h2>
          </div>

          <div className="space-y-12">
            {/* 01 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                01
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <Database className="w-6 h-6 text-emerald-600" />
                  تسجيل الدفعات
                </h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  سجّل دفعات نوى التمر مع بيانات المصدر والكمية والتاريخ والحالة وطرق التخزين والمعالجة.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  كل دفعة تحصل على معرف رقمي خاص يساعد على تتبعها داخل المنصة.
                </p>
              </div>
            </div>

            {/* 02 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                02
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-6 h-6 text-emerald-600" />
                  التحليل بالذكاء الاصطناعي
                </h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  ارفع صورة لنوى التمر للحصول على تحليل بصري مبدئي مدعوم بالذكاء الاصطناعي.
                </p>
                <p className="text-slate-700 leading-relaxed mb-3">
                  يمكن للتحليل المساعدة في التعرف على الخصائص البصرية الظاهرة، مثل الشكل واللون والتجانس ووجود بعض العلامات المرئية.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  ولا يحل التحليل البصري محل الاختبارات المخبرية، ولا يمكن للصورة وحدها تحديد التركيب الكيميائي أو الرطوبة الفعلية أو السلامة أو الصلاحية الصناعية أو الغذائية.
                </p>
              </div>
            </div>

            {/* 03 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                03
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <Search className="w-6 h-6 text-emerald-600" />
                  اكتشاف الاستخدامات المحتملة
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  استكشف مسارات الاستفادة المحتملة من نوى التمر بناءً على البيانات المتاحة ومستوى الأدلة العلمية.
                </p>
                <p className="text-slate-700 font-bold mb-3">تساعد المنصة على التمييز بين:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 mr-2">
                  <li>استخدامات مدعومة بالدراسات.</li>
                  <li>استخدامات قيد التحقق.</li>
                  <li>استخدامات تجريبية.</li>
                  <li>حالات لا تتوفر عنها بيانات كافية.</li>
                </ul>
              </div>
            </div>

            {/* 04 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                04
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <TestTube2 className="w-6 h-6 text-emerald-600" />
                  التجارب
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  أنشئ تجربة مرتبطة بالدفعة التي تعمل عليها.
                </p>
                <p className="text-slate-700 font-bold mb-3">وثّق:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4 mr-2">
                  <li>هدف التجربة.</li>
                  <li>الكمية المستخدمة.</li>
                  <li>طريقة المعالجة.</li>
                  <li>مدة التجربة.</li>
                  <li>الملاحظات.</li>
                  <li>النتائج.</li>
                  <li>حالة التجربة.</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  وبذلك لا تكون التجربة منفصلة عن مصدر النوى، بل جزءًا من سجل قابل للتتبع.
                </p>
              </div>
            </div>

            {/* 05 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                05
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  الأدلة والمصادر
                </h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  تربط نواة مسارات الاستخدام بالمصادر والدراسات المتاحة، مع توضيح مستوى الأدلة.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  ولا تعتمد المنصة على إنشاء معلومات علمية من تلقاء نفسها، بل تهدف إلى تنظيم المعلومات الموثوقة وتمييز ما هو مثبت عما لا يزال بحاجة إلى تحقق.
                </p>
              </div>
            </div>

            {/* 06 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                06
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <Map className="w-6 h-6 text-emerald-600" />
                  الخريطة الذكية
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  تعرض الخريطة المصادر والدفعات المرتبطة بها جغرافيًا، مع تنظيم البيانات حسب:
                </p>
                <div className="flex flex-wrap items-center gap-3 text-emerald-800 font-bold mb-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <span>المنطقة</span>
                  <ChevronLeft className="w-4 h-4" />
                  <span>المدينة</span>
                  <ChevronLeft className="w-4 h-4" />
                  <span>المصدر</span>
                  <ChevronLeft className="w-4 h-4" />
                  <span>الدفعات</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  مما يساعد على تكوين صورة أوضح عن توزيع مصادر نوى التمر والبيانات المرتبطة بها.
                </p>
              </div>
            </div>

            {/* 07 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
                07
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex-1">
                <h3 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-emerald-600" />
                  قياس الأثر
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  تحول البيانات المسجلة في المنصة إلى مؤشرات قابلة للمتابعة، مثل:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4 mr-2">
                  <li>كمية النوى المسجلة.</li>
                  <li>عدد الدفعات.</li>
                  <li>عدد التجارب.</li>
                  <li>عدد المصادر.</li>
                  <li>الكمية التي تم توثيق إعادة استخدامها.</li>
                  <li>التوزيع الجغرافي.</li>
                  <li>تطور النشاط عبر الزمن.</li>
                </ul>
                <p className="text-slate-700 leading-relaxed font-medium">
                  وتُحتسب مؤشرات المنصة من البيانات الفعلية المسجلة في النظام وليست أرقامًا ثابتة أو تجريبية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-emerald-700 text-lg font-bold">منظومة واحدة بدل بيانات متفرقة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "إدارة الدفعات", desc: "تسجيل وتتبع نوى التمر من المصدر وحتى مراحل الاستخدام والتجربة.", icon: Database },
              { title: "الذكاء الاصطناعي", desc: "تحليل بصري مبدئي للصور ومساعدة المستخدم في فهم البيانات واستكشاف الخيارات المحتملة.", icon: BrainCircuit },
              { title: "قاعدة الأدلة", desc: "تنظيم الدراسات والمصادر وربطها بمسارات الاستخدام ومستوى التحقق.", icon: BookOpen },
              { title: "إدارة التجارب", desc: "توثيق التجارب وربط كل تجربة بالدفعة الخاصة بها.", icon: TestTube2 },
              { title: "الخريطة الذكية", desc: "ربط المصادر والدفعات بالمناطق والمدن والمواقع الفعلية.", icon: Map },
              { title: "لوحة البيانات", desc: "عرض المؤشرات والإحصائيات الناتجة عن البيانات الحقيقية في المنصة.", icon: LayoutDashboard },
              { title: "قياس الأثر", desc: "متابعة الكميات التي تم تسجيلها وتجربتها وإعادة استخدامها وفق البيانات الموثقة.", icon: LineChart },
              { title: "التتبع", desc: "منح كل دفعة سجلًا رقميًا يساعد على تتبع مصدرها وبياناتها وتحليلاتها وتجاربها.", icon: QrCode },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <feature.icon className="w-8 h-8 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-emerald-950 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Impact */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">الأثر</h2>
            <p className="text-emerald-400 text-lg font-bold">من مخلف إلى مورد قابل للتتبع</p>
          </div>

          <p className="text-lg text-slate-300 text-center max-w-4xl mx-auto leading-relaxed mb-12">
            تهدف نواة إلى دعم بناء دورة حياة أكثر تنظيمًا لنوى التمر من خلال تحويل البيانات المتفرقة إلى معلومات قابلة للتحليل والتتبع. وتسعى المنصة إلى المساهمة في:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-xl font-bold text-amber-400 mb-3">تقليل الهدر</h3>
              <p className="text-slate-300 leading-relaxed">
                دعم استكشاف فرص الاستفادة من نوى التمر بدل التعامل معه كمخلف فقط.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-xl font-bold text-amber-400 mb-3">دعم الاقتصاد الدائري</h3>
              <p className="text-slate-300 leading-relaxed">
                إبقاء الموارد في دورة استخدام أطول من خلال دراسة فرص إعادة استخدامها وتثمينها.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-xl font-bold text-amber-400 mb-3">دعم البحث والابتكار</h3>
              <p className="text-slate-300 leading-relaxed">
                توفير بيئة تساعد على توثيق التجارب وربط النتائج بمصادرها ودفعاتها.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 lg:col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-amber-400 mb-3">تحويل البيانات إلى قرارات</h3>
              <p className="text-slate-300 leading-relaxed">
                جمع بيانات المصادر والدفعات والتجارب في منظومة واحدة تساعد على فهم الأنماط والفرص.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 lg:col-span-2 md:col-span-2">
              <h3 className="text-xl font-bold text-amber-400 mb-3">بناء أثر قابل للقياس</h3>
              <p className="text-slate-300 leading-relaxed">
                تحويل النشاط داخل المنصة إلى مؤشرات يمكن متابعتها بمرور الوقت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. National Context */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-emerald-950">السياق الوطني</h2>
              <p className="text-emerald-700 text-lg font-bold">الفقد والهدر الغذائي… تحدٍ يتجاوز منتجًا واحدًا</p>
            </div>

            <div className="text-lg text-slate-700 leading-relaxed text-justify space-y-6">
              <p>
                نشرت وزارة البيئة والمياه والزراعة تقديرات تشير إلى أن حجم الهدر الغذائي في المملكة بلغ نحو 4.066 مليون طن سنويًا، بقيمة تقديرية تقارب 40.48 مليار ريال.
              </p>
              <p>
                وهذه الأرقام تخص الهدر الغذائي عمومًا وليست نوى التمر تحديدًا، لكنها توضح أهمية تطوير حلول تدعم تقليل الفقد والهدر وتعظيم الاستفادة من الموارد ضمن سلسلة الغذاء.
              </p>
              <p className="font-bold text-emerald-900 text-center text-xl mt-8">
                وفي هذا السياق، تأتي نواة لتتخصص في أحد الموارد الثانوية المرتبطة بسلسلة إنتاج وتجهيز التمور: نوى التمر.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Why Nawah? */}
      <section className="py-24 bg-emerald-50 border-t border-emerald-100 text-center">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">لماذا نواة؟</h2>
            <p className="text-emerald-700 text-lg font-bold">لأن المشكلة ليست في النواة وحدها… بل في غياب الحلقة التي تربط بياناتها</p>
          </div>

          <div className="text-2xl font-black text-emerald-950 space-y-4">
            <p>هناك إنتاج.</p>
            <p>وهناك مصادر.</p>
            <p>وهناك نوى.</p>
            <p>وهناك دراسات.</p>
            <p>وهناك تجارب.</p>
          </div>

          <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
            لكن القيمة الأكبر تظهر عندما تصبح هذه العناصر مرتبطة ببعضها رقميًا.
          </p>
          
          <div className="bg-white p-8 rounded-3xl border border-emerald-200 mt-8">
            <p className="text-2xl font-bold text-emerald-800 mb-8">وهذا هو دور نواة:</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xl font-black text-emerald-950">
              <span>تسجيل</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>تحليل</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>دليل</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>تجربة</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>تتبع</span>
              <ChevronLeft className="w-5 h-5 text-amber-500" />
              <span>أثر</span>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Vision & Footer CTA */}
      <section className="py-32 bg-emerald-950 text-center px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
           <Image src="/hero-bg.png" alt="Background" fill className="object-cover" />
        </div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-amber-400">رؤيتنا</h2>
            <p className="text-2xl font-bold text-white">نحو دورة حياة جديدة لنوى التمر</p>
          </div>
          
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            أن تصبح نواة طبقة رقمية تربط البيانات بالمصادر والأبحاث والتجارب، وتساعد على اكتشاف القيمة الكامنة في نوى التمر بطريقة أكثر تنظيمًا وقابلية للقياس.
          </p>

          <div className="w-24 h-[1px] bg-emerald-800 mx-auto my-12" />

          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white">نواة | NAWAH</h3>
            <p className="text-xl text-amber-400">من نواة التمر… نصنع قيمة.</p>
          </div>

          <div className="pt-8">
            <Link
              href="/pit-management/dashboard"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-12 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-amber-400/10 hover:-translate-y-1"
            >
              <span>دخول للمنصة</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
