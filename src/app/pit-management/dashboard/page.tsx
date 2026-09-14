import Link from "next/link";
import { 
  Package, TestTube2, Building2, TrendingUp, PlusCircle, 
  ArrowLeft, Leaf, MapPin, Search, Scan, Sparkles, CheckCircle2, ChevronLeft
} from "lucide-react";
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
  const totalQuantity = batches?.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0) || 0;
  const latestBatch = batches?.[0] || null;

  return (
    <div className="space-y-8" dir="rtl">
      
      {!user && (
        <div className="bg-emerald-950 border border-emerald-900 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 border border-white/10">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base">تتصفح المنصة كزائر</h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                استكشف مسار الرحلة بحرية. لحفظ أعمالك وتدفقات بياناتك، نرجو تسجيل الدخول.
              </p>
            </div>
          </div>
          <Link href="/login" className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-3 rounded-2xl text-xs transition-colors text-center shrink-0 shadow-sm whitespace-nowrap">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}

      {/* WELCOME BANNER */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>لوحة تتبع الرحلة الرقمية</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950">
            أهلاً بك، {userName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            شاشة متابعة مركزية توضح أين وصلت نوى التمر في رحلتها الرقمية المترابطة من التسجيل والتحليل حتى التجارب وقياس الأثر.
          </p>
        </div>
        {user && (
          <Link
            href="/pit-management/batches/new"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>تسجيل دفعة جديدة</span>
          </Link>
        )}
      </div>

      {/* RECENT BATCH JOURNEY HIGHLIGHT (آخر رحلة) */}
      <div className="bg-emerald-950 text-white border border-emerald-900 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-900/80 pb-4 gap-4">
          <div>
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">آخر رحلة نشطة</span>
            <h2 className="text-xl font-black text-white dir-ltr text-right">
              {latestBatch ? latestBatch.batch_number : 'NW-2026-0001'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {latestBatch ? `${latestBatch.source_name} — ${latestBatch.quantity} كجم (${latestBatch.date_type})` : 'مثال توضيحي لتتبع الرحلة'}
            </p>
          </div>

          {latestBatch && (
            <Link
              href={`/pit-management/batches/${latestBatch.id}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-colors border border-white/10 shrink-0"
            >
              <span>فتح ملف الرحلة بالكامل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* 6 STAGES STEP TRACKER */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-2">
          {[
            { num: "01", label: "تسجيل الدفعة", status: latestBatch ? "مكتمل" : "مثال", isDone: true, icon: Package },
            { num: "02", label: "التحليل البصري", status: latestBatch?.image_analysis?.length > 0 ? "مكتمل" : "متاح للتنفيذ", isDone: !!latestBatch?.image_analysis?.length, icon: Scan },
            { num: "03", label: "الاستخدام المحتمل", status: "مكتشف", isDone: true, icon: Sparkles },
            { num: "04", label: "التجربة المعملية", status: totalExperiments > 0 ? "قيد التنفيذ" : "لم تبدأ", isDone: totalExperiments > 0, icon: TestTube2 },
            { num: "05", label: "الأدلة العلمية", status: "مرتبطة", isDone: true, icon: Building2 },
            { num: "06", label: "قياس الأثر", status: totalQuantity > 0 ? "محسوب" : "في الانتظار", isDone: totalQuantity > 0, icon: TrendingUp }
          ].map((st, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              st.isDone 
                ? "bg-emerald-900/60 border-emerald-700/80 text-white" 
                : "bg-emerald-900/20 border-emerald-800/40 text-emerald-300/60"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-400">{st.num}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  st.isDone ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-white/5 text-emerald-400/50"
                }`}>
                  {st.status}
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-xs block">{st.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "إجمالي الكمية المسجلة", val: `${totalQuantity.toLocaleString()} كجم`, icon: Package, desc: "كميات موثقة بأكواد NW" },
          { title: "الدفعات النشطة", val: totalBatches, icon: Building2, desc: "سجلات الإمداد الرقمية" },
          { title: "التجارب الموثقة", val: totalExperiments, icon: TestTube2, desc: "اختبارات معملية مرتبطة" }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col items-start justify-between space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.val}</p>
              <p className="text-xs font-bold text-emerald-950 mt-0.5">{s.title}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT BATCHES LIST */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-emerald-950 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            سجل الدفعات الأخيرة ومراحلها
          </h2>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
              عرض سجل الدفعات بالكامل
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        
        <div className="p-6">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-slate-600 text-xs font-bold mb-1">تتصفح حالياً كزائر</p>
              <p className="text-xs text-slate-400">سجل الدخول لعرض وإدارة دفعاتك الخاصة.</p>
            </div>
          ) : totalBatches === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-slate-700 text-xs font-bold">لا توجد دفعات مسجلة بحسابك حالياً</p>
              <Link
                href="/pit-management/batches/new"
                className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>ابدأ بتسجيل أول دفعة</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {batches.slice(0, 5).map((batch) => (
                <Link 
                  key={batch.id} 
                  href={`/pit-management/batches/${batch.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-slate-50/80 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-950 group-hover:text-white transition-colors">
                      NW
                    </div>
                    <div>
                      <div className="font-black text-sm text-slate-900 dir-ltr text-right">{batch.batch_number}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {batch.source_name || "مصدر غير محدد"} — {batch.date_type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-left">
                    <div>
                      <div className="font-black text-emerald-800 text-sm">{Number(batch.quantity).toLocaleString()} كجم</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(batch.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
