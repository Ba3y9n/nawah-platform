"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Leaf, Layers, Package, Scan, Sparkles, TestTube2, 
  TrendingUp, PlusCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [summary, setSummary] = useState({
    total_registered_kg: 0,
    total_batches_count: 0,
    total_experiments_count: 0,
    total_sources_count: 0,
  });

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: batches } = await supabase
          .from('batches')
          .select('quantity, source_name')
          .eq('user_id', user.id);

        const { data: experiments } = await supabase
          .from('experiments')
          .select('id')
          .eq('user_id', user.id);

        const total_registered_kg = batches?.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0) || 0;
        const total_batches_count = batches?.length || 0;
        const total_experiments_count = experiments?.length || 0;
        const uniqueSources = new Set(batches?.map(b => b.source_name).filter(Boolean));

        setSummary({
          total_registered_kg,
          total_batches_count,
          total_experiments_count,
          total_sources_count: uniqueSources.size
        });
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16 bg-white text-emerald-950">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-900/40 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 max-w-4xl">
          
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-lg">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>المنصة الوطنية للتدوير الحيوي واستغلال نوى التمر</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            نحول نوى التمر من <span className="text-amber-400 underline decoration-emerald-500 underline-offset-8">مخلفات هدر</span> إلى منتجات صناعية عالية القيمة
          </h1>

          <p className="text-sm sm:text-base text-emerald-200 max-w-2xl mx-auto leading-relaxed">
            منظومة رقمية تعتمد على قاعدة بيانات فعلية لتسجيل، فحص، وتتبع دفعات نوى التمر في المملكة العربية السعودية، وربطها بمسارات التدوير والتجارب والأثر البيئي.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/pit-management/dashboard"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black px-7 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-xl shadow-amber-400/20 hover:scale-105"
            >
              <Layers className="w-5 h-5" />
              <span>الدخول لقسم إدارة النوى</span>
            </Link>

            <Link
              href="/pit-management/batches/new"
              className="flex items-center gap-2 bg-emerald-900/80 border border-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm hover:bg-emerald-800 transition-all shadow-lg"
            >
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>تسجيل دفعة جديدة</span>
            </Link>
          </div>

        </div>
      </section>

      {/* LIVE PLATFORM METRICS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-emerald-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              مؤشرات حسابك الشخصي في المنصة
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950">إحصائيات المنصة الحية</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 text-center shadow-sm">
              <span className="text-xs font-bold text-emerald-700 block">إجمالي الكميات المسجلة</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 dir-ltr block">
                {summary.total_registered_kg.toLocaleString()} كجم
              </span>
              <span className="text-[10px] text-emerald-600 block">مجموع الدفعات المسجلة</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 text-center shadow-sm">
              <span className="text-xs font-bold text-amber-600 block">دفعات النوى المسجلة</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-500 block">
                {summary.total_batches_count}
              </span>
              <span className="text-[10px] text-emerald-600 block">دفعة ذات كود فريد</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 text-center shadow-sm">
              <span className="text-xs font-bold text-emerald-700 block">التجارب المحولة</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">
                {summary.total_experiments_count}
              </span>
              <span className="text-[10px] text-emerald-600 block">تجربة مرتبطة بالدفعات</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 text-center shadow-sm">
              <span className="text-xs font-bold text-emerald-700 block">المصادر الموثقة المسجلة</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 block">
                {summary.total_sources_count}
              </span>
              <span className="text-[10px] text-emerald-600 block">مصانع ومراكز تجميع</span>
            </div>

          </div>
        </div>
      </section>

      {/* CORE 6 PIT MANAGEMENT SUB-SECTIONS CARDS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
            منظومة إدارة النوى
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            6 أقسام مترابطة لإدارة وتتبع النوى
          </h2>
          <p className="text-xs text-emerald-700">
            تنتقل البيانات بسلاسة من تسجيل الدفعة إلى التحليل البصري ومسارات الاستخدام والتجارب حتى قياس الأثر
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link
            href="/pit-management/dashboard"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              1. نظرة عامة (لوحة التحكم)
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              عرض إجمالي الكميات، عدد الدفعات، التجارب، والكميات المعاد استخدامها محسبة مباشرة من DB.
            </p>
          </Link>

          <Link
            href="/pit-management/batches"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              2. دفعات النوى
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              تسجيل واستعراض الشحنات بأرقام فريدة تلقائية (NW-2026-xxxx) وبطاقات تتبع بالـ QR Code.
            </p>
          </Link>

          <Link
            href="/pit-management/scanner"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              3. تحليل النواة بالـ AI
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              فتح الكاميرا أو رفع صورة لتحليل التجانس والخصائص السطحية ومؤشر الرطوبة البصري.
            </p>
          </Link>

          <Link
            href="/pit-management/pathways"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              4. مسارات الاستخدامات
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              الفحم المنشط، زيت النواة، بديل القهوة، الأعلاف، والبوليمرات الحيوية مع الفحص المباشر للملاءمة.
            </p>
          </Link>

          <Link
            href="/pit-management/experiments"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold">
              <TestTube2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              5. التجارب المختبرية
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              تسجيل نتائج التجارب وربطها بالدفعة وتحديث الكميات المستهلكة فورياً بـ DB.
            </p>
          </Link>

          <Link
            href="/pit-management/impact"
            className="bg-slate-50 border border-emerald-200 hover:border-amber-400 p-6 rounded-3xl shadow-lg space-y-3 transition-all group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 group-hover:text-amber-600 transition-colors">
              6. قياس الأثر الحي
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              حساب النفايات المحولة عن المدافن وخفض انبعاثات الميثان والـ CO2 المكافئ بأسلوب علمي دقيق.
            </p>
          </Link>

        </div>
      </section>

    </div>
  );
}
