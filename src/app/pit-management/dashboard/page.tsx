import Link from "next/link";
import { Package, TestTube2, Building2, TrendingUp, PlusCircle, ChevronLeft, Leaf, MapPin, Scan, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function PitDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let batches: any[] = [];
  let experiments: any[] = [];

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = p;

    const { data: b } = await supabase
      .from('batches')
      .select('*, image_analysis(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    batches = b || [];

    const { data: e } = await supabase
      .from('experiments')
      .select('*')
      .eq('user_id', user.id);
    experiments = e || [];
  }

  const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';
  const totalBatches = batches?.length || 0;
  const totalExperiments = experiments?.length || 0;
  const totalQuantityKg = batches?.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0) || 0;
  const totalQuantityTon = (totalQuantityKg / 1000).toFixed(1);
  const analyzedCount = batches?.filter(b => b.image_analysis && b.image_analysis.length > 0).length || 0;

  const latestBatch = batches?.[0] || null;

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* EDITORIAL COMMAND CENTER HEADER */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">مركز القيادة والتتبع</span>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950">
            أهلاً بك، {userName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium leading-relaxed">
            تابع رحلة نوى التمر من التسجيل المباشر حتى التحليل البصري وتجارب التثمين وقياس الأثر البيئي.
          </p>
        </div>

        {user && (
          <Link
            href="/pit-management/batches/new"
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>تسجيل دفعة جديدة</span>
          </Link>
        )}
      </div>

      {/* COMPACT DATA METRICS BAR (Typography Hierarchy - No Heavy Cards) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
          
          <div className="pt-2 md:pt-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">إجمالي الكمية</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block dir-ltr text-right">{totalQuantityTon} <span className="text-xs font-bold text-slate-500">طن</span></span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{totalQuantityKg.toLocaleString()} كجم مسجلة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-6">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">دفعات النوى</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block">{totalBatches}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">سجلات مصادر موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-6">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">تم تحليلها بصرياً</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block">{analyzedCount}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">فحص الذكاء الاصطناعي</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-6">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">التجارب الجارية</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block">{totalExperiments}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">اختبارات معملية موثقة</span>
          </div>

          <div className="pt-2 md:pt-0 md:pr-6">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">الأثر المحسوب</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block dir-ltr text-right">{(Number(totalQuantityTon) * 0.65).toFixed(1)} <span className="text-xs font-bold text-emerald-600">طن CO2e</span></span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">تقدير انبعاثات متجنبة</span>
          </div>

        </div>
      </div>

      {/* ACTIVE JOURNEY HERO visual LINE (الرحلة النشطة الرئيسية) */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-900 pb-4 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">الرحلة النشطة الحالية</span>
            <h2 className="text-xl font-black text-white mt-0.5 dir-ltr text-right">
              {latestBatch ? latestBatch.batch_number : 'NW-2026-0001'}
            </h2>
            <p className="text-xs text-emerald-200/70 mt-1 font-medium">
              {latestBatch ? `${latestBatch.source_name} — ${latestBatch.quantity} كجم (${latestBatch.date_type})` : 'مثال لتتبع الرحلة الرقمية'}
            </p>
          </div>

          {latestBatch && (
            <Link
              href={`/pit-management/batches/${latestBatch.id}`}
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-colors border border-emerald-700 shrink-0"
            >
              <span>فتح ملف الرحلة بالكامل</span>
              <ChevronLeft className="w-4 h-4 text-emerald-300" />
            </Link>
          )}
        </div>

        {/* CONNECTED PROCESS LINE (Desktop Horizontal / Mobile Vertical) */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-emerald-300 block uppercase tracking-wider">مراحل التدفق الرقمي:</span>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
            
            {/* Horizontal Line connecting stages on desktop */}
            <div className="hidden md:block absolute top-1/2 right-4 left-4 h-0.5 bg-emerald-900 -translate-y-1/2 z-0" />

            {[
              { name: "تسجيل", isDone: true },
              { name: "تحليل", isDone: !!latestBatch?.image_analysis?.length },
              { name: "استخدام", isDone: true },
              { name: "تجربة", isDone: totalExperiments > 0 },
              { name: "أثر", isDone: totalQuantityKg > 0 }
            ].map((st, idx) => (
              <div key={idx} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border-2 ${
                  st.isDone 
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30" 
                    : "bg-emerald-950 text-emerald-600 border-emerald-900"
                }`}>
                  {idx + 1}
                </div>
                <div className="text-right md:text-center">
                  <span className={`text-xs font-bold block ${st.isDone ? "text-white" : "text-emerald-500/60"}`}>{st.name}</span>
                  <span className="text-[10px] text-emerald-300/60 block">{st.isDone ? "مكتمل" : "في الانتظار"}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* RECENT BATCHES DATA TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-black text-emerald-950">أحدث سجلات الدفعات</h2>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
              عرض جدول الدفعات بالكامل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {batches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500 font-medium">لا توجد دفعات مسجلة حالياً بحسابك.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">رقم الدفعة</th>
                  <th className="pb-3">المصدر</th>
                  <th className="pb-3">الكمية</th>
                  <th className="pb-3">الصنف</th>
                  <th className="pb-3">تاريخ التسجيل</th>
                  <th className="pb-3 text-left">الرحلة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-black text-emerald-950 dir-ltr text-right">{b.batch_number}</td>
                    <td className="py-3 font-bold text-slate-800">{b.source_name}</td>
                    <td className="py-3 font-bold text-emerald-700">{Number(b.quantity).toLocaleString()} كجم</td>
                    <td className="py-3 text-slate-600">{b.date_type}</td>
                    <td className="py-3 text-slate-400">{new Date(b.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 text-left">
                      <Link 
                        href={`/pit-management/batches/${b.id}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        <span>فتح</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
