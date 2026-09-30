"use client";

import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Layers, 
  Microscope, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Globe, 
  Printer, 
  ArrowLeft,
  Truck,
  FileCheck,
  FlaskConical,
  GraduationCap,
  Settings,
  ShieldCheck
} from "lucide-react";

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-[#041E16] text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center justify-center selection:bg-emerald-500 selection:text-slate-950" dir="rtl">
      
      {/* TOOLBAR FOR PRINT / EXPORT */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row justify-between items-center bg-emerald-950/90 p-4 rounded-2xl border border-emerald-700/50 backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <span className="text-sm font-black text-emerald-200 block">مخطط رحلة نواة (التصميم الرسمي)</span>
            <span className="text-xs text-slate-400">من الهدر إلى مورد قابل للتتبع - جاهز للعرض والتسجيل</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => window.print()} 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            طباعة / حفظ كـ PDF
          </button>

          <Link 
            href="/pit-management/dashboard" 
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للمنصة
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl bg-gradient-to-br from-emerald-950/80 via-slate-950 to-emerald-950/90 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden border border-emerald-500/30 backdrop-blur-xl">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-emerald-500/20">
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>الجمع والتتبع الرقمي لنوى التمر في المملكة العربية السعودية</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              مخطط رحلة <span className="text-emerald-400">نواة</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-bold text-emerald-200">
              من الهدر إلى مورد قابل للتتبع
            </h2>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
              نواة منصة وطنية لتوثيق نوى التمر وتتبعها، وتمكين الاستفادة منها عبر تحليل بياناتها وربطها بالأدلة والتجارب والجهات المؤهلة، ضمن مسار يدعم الحد من الفقد والهدر الغذائي.
            </p>
          </div>

          {/* BRAND BADGE */}
          <div className="flex items-center gap-4 bg-emerald-900/40 p-5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl">
              🌴
            </div>
            <div>
              <div className="text-2xl font-black tracking-wider text-white">نواة</div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">NAWAH PLATFORM</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">منصة الربط والتتبع الوطني</div>
            </div>
          </div>

        </div>

        {/* CIRCULAR WORKFLOW DIAGRAM */}
        <div className="py-12 flex flex-col lg:flex-row items-center justify-center gap-12">
          
          {/* ORBIT SYSTEM */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Orbit rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_80s_linear_infinite]"></div>
            <div className="absolute inset-6 rounded-full border border-emerald-500/20"></div>

            {/* Central Core */}
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950 border-4 border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] z-10 text-center p-2">
              <span className="text-3xl mb-1">🌴</span>
              <span className="text-2xl font-black text-white">نواة</span>
              <span className="text-[10px] font-bold text-emerald-300 tracking-widest uppercase">NAWAH</span>
            </div>

            {/* Orbit Nodes (7 Nodes) */}
            {/* 1. المصدر */}
            <div className="absolute -top-3 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">المصدر</span>
            </div>

            {/* 2. الدفعة */}
            <div className="absolute top-12 -left-4 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <Layers className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">الدفعة</span>
            </div>

            {/* 3. التحليل */}
            <div className="absolute bottom-16 -left-6 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <Microscope className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">التحليل</span>
            </div>

            {/* 4. الاستخدامات */}
            <div className="absolute -bottom-3 left-12 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <Settings className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">الاستخدامات</span>
            </div>

            {/* 5. التجربة */}
            <div className="absolute -bottom-3 right-12 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <FlaskConical className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">التجربة</span>
            </div>

            {/* 6. النتائج */}
            <div className="absolute bottom-16 -right-6 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">النتائج</span>
            </div>

            {/* 7. الأثر */}
            <div className="absolute top-12 -right-4 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-emerald-300 font-bold">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-200 mt-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">الأثر</span>
            </div>

          </div>

          {/* HIGHLIGHT CARDS */}
          <div className="flex-1 space-y-4 max-w-md">
            <div className="bg-emerald-900/30 p-5 rounded-2xl border border-emerald-500/30 border-r-4 border-r-emerald-400 backdrop-blur-md">
              <div className="font-black text-emerald-300 text-base mb-1 flex items-center gap-2">
                <span>🌱 الاستدامة والحد من الهدر</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تحويل نوى التمر من مخلفات مهدرة إلى مواد خام عالية القيمة في الصناعات التجميلية، الغذائية، والزراعية.
              </p>
            </div>

            <div className="bg-teal-900/30 p-5 rounded-2xl border border-teal-500/30 border-r-4 border-r-teal-400 backdrop-blur-md">
              <div className="font-black text-teal-300 text-base mb-1 flex items-center gap-2">
                <span>🔗 التتبع والتوثيق الرقمي الكامل</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                سجل إلكتروني معتمد يوثق مصدر كل دفعة، التحاليل المخبرية، وشهادات الأثر البيئي.
              </p>
            </div>

            <div className="bg-amber-900/30 p-5 rounded-2xl border border-amber-500/30 border-r-4 border-r-amber-400 backdrop-blur-md">
              <div className="font-black text-amber-300 text-base mb-1 flex items-center gap-2">
                <span>🏛️ ربط المنظومة الوطنية</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                حلقة وصل رقمية تجمع المصانع والمزارع مع مراكز الأبحاث والمشترين الصناعيين.
              </p>
            </div>
          </div>

        </div>

        {/* TIMELINE STEPS 01 TO 06 */}
        <div className="pt-8 border-t border-emerald-500/20">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-4 py-1.5 rounded-full border border-emerald-700/50">
              تسلسل مراحل رحلة المورد
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* STEP 01 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">01</span>
                <Truck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">جمع المورد</h3>
              <p className="text-[11px] text-slate-300 leading-normal">جمع نوى التمر من المصانع والمصادر المعتمدة.</p>
            </div>

            {/* STEP 02 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">02</span>
                <FileCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">التسجيل الرقمي</h3>
              <p className="text-[11px] text-slate-300 leading-normal">إنشاء هوية رقمية وتوثيق بيانات كل دفعة.</p>
            </div>

            {/* STEP 03 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">03</span>
                <FlaskConical className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">التحليل والتوثيق</h3>
              <p className="text-[11px] text-slate-300 leading-normal">ربط العينات بالنتائج المخبرية والمعرفة العلمية.</p>
            </div>

            {/* STEP 04 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">04</span>
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">الأبحاث والتجارب</h3>
              <p className="text-[11px] text-slate-300 leading-normal">ربط الدراسات والتطبيقات العلمية ذات الصلة.</p>
            </div>

            {/* STEP 05 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">05</span>
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">فرص الاستخدام</h3>
              <p className="text-[11px] text-slate-300 leading-normal">توجيه المورد لمسارات صناعية وزراعية محتملة.</p>
            </div>

            {/* STEP 06 */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs">06</span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-white text-xs mb-1">القيمة المستدامة</h3>
              <p className="text-[11px] text-slate-300 leading-normal">تحويل المورد لفرص اقتصادية وبيئية مستدامة.</p>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <div>منصة نواة الوطنية © 2026 - جميع الحقوق محفوظة</div>
          <div className="font-medium text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>منصة رقمية للتوثيق والربط - لا نقوم بالتخزين أو الاستلام الفعلي</span>
          </div>
        </div>

      </div>
    </div>
  );
}
