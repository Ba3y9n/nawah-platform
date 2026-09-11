"use client";

import Link from "next/link";
import { Leaf, ShieldCheck, Database, Award, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-200/80 p-8 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto font-black shadow-lg shadow-amber-400/20">
          <Leaf className="w-9 h-9" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-emerald-950">عن منصة نواة | NAWAH Platform</h1>
        <p className="text-xs md:text-sm text-emerald-800/80 max-w-2xl mx-auto leading-relaxed">
          المنصة الوطنية المتكاملة لإدارة، تحليل، وتتبع نوى التمر وتطبيقات الاقتصاد الدائري في المملكة العربية السعودية
        </p>
      </div>

      {/* MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>رسالتنا الوطنية</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            تحويل أكثر من 100,000 طن سنوياً من نوى التمر الناتج عن مصانع ومزارع المملكة من مخلفات عضوية مهدرة إلى موارد حيوية وصناعية ذات قيمة مضافة عالية، تسهم في تحقيق أهداف رؤية المملكة 2030 في الاستدامة البيئية والأمن الغذائي والصناعي.
          </p>
        </div>

        <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>الموثوقية وقواعد البيانات الحقيقية</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            تعتمد منصة نواة على قاعدة بيانات Supabase PostgreSQL حقيقية مع حماية البيانات بـ Row Level Security (RLS) ومطابقة الدفعات بالأرقام التلقائية الفريدة (NW-2026-xxxx) للتأكد من شفافية واستدامة سلاسل الإمداد.
          </p>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE STEPS */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          رحلة وتدفق البيانات في منصة نواة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-amber-300 flex items-center justify-center font-bold mx-auto">1</span>
            <span className="font-bold text-emerald-950 block mt-1">تسجيل الدفعة</span>
            <span className="text-[10px] text-emerald-600/80">حفظ المصدر والكمية والموقع بـ DB</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-amber-300 flex items-center justify-center font-bold mx-auto">2</span>
            <span className="font-bold text-emerald-950 block mt-1">التحليل البصري</span>
            <span className="text-[10px] text-emerald-600/80">فحص الخصائص بالـ AI Storage</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-amber-300 flex items-center justify-center font-bold mx-auto">3</span>
            <span className="font-bold text-emerald-950 block mt-1">ربط التجارب</span>
            <span className="text-[10px] text-emerald-600/80">إجراء التجارب والتطبيقات الحيوية</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-amber-300 flex items-center justify-center font-bold mx-auto">4</span>
            <span className="font-bold text-emerald-950 block mt-1">حساب الأثر</span>
            <span className="text-[10px] text-emerald-600/80">تحديث المؤشرات وبصمة الكربون</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/pit-management/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-black px-8 py-3.5 rounded-2xl text-xs shadow-xl shadow-amber-400/20 hover:brightness-110 transition-all"
        >
          <span>الانتقال لقسم إدارة النوى</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
