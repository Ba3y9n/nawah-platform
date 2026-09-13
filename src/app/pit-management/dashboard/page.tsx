import Link from "next/link";
import { 
  Package, TestTube2, Building2, TrendingUp, PlusCircle, 
  ArrowLeft, Leaf, MapPin, Search
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function PitDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guest mode allowed
  
  // Data for logged-in users, empty for guests
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
      .select('*')
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
  const recentBatches = batches?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      
      {!user && (
        <div className="bg-emerald-950 border border-emerald-900 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">تتصفح المنصة كزائر</h3>
              <p className="text-sm text-emerald-200/80 mt-1">
                استكشف الأقسام بحرية. لحفظ أعمالك وتجاربك، نرجو تسجيل الدخول.
              </p>
            </div>
          </div>
          <Link href="/login" className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors text-center shrink-0 shadow-sm whitespace-nowrap">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}

      {/* WELCOME BANNER */}
      <div className="bg-white border border-emerald-100/60 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            مرحباً بك، {userName} 
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg">
            لوحة التحكم الشخصية في نظام إدارة وتتبع نوى التمر. تابع مستجدات دفعاتك، وتطورات التجارب، والأثر البيئي.
          </p>
        </div>
        {user && (
          <Link
            href="/pit-management/batches/new"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 shrink-0 relative z-10"
          >
            <PlusCircle className="w-5 h-5" />
            <span>تسجيل دفعة جديدة</span>
          </Link>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "إجمالي النوى المسجلة", val: `${totalQuantity} كجم`, icon: Package, col: "emerald" },
          { title: "عدد الدفعات", val: totalBatches, icon: Building2, col: "blue" },
          { title: "عدد التجارب", val: totalExperiments, icon: TestTube2, col: "amber" }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-100/60 p-6 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col items-center justify-center text-center group hover:border-slate-300 transition-colors">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1 ${
              s.col === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              s.col === 'blue' ? 'bg-blue-50 text-blue-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{s.val}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.title}</p>
          </div>
        ))}
      </div>

      {/* RECENT BATCHES */}
      <div className="bg-white border border-emerald-100/60 rounded-3xl shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            أحدث الدفعات
          </h2>
          {totalBatches > 0 && (
            <Link href="/pit-management/batches" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
              عرض الجميع
              <ArrowLeft className="w-3 h-3" />
            </Link>
          )}
        </div>
        
        <div className="p-6">
          {!user ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 font-bold mb-1">لم تقم بتسجيل الدخول</p>
              <p className="text-sm text-slate-400">سجل الدخول لعرض وتتبع بياناتك الخاصة.</p>
            </div>
          ) : totalBatches === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-emerald-900 font-bold mb-1">لا توجد دفعات مسجلة</p>
              <p className="text-sm text-slate-500 mb-6">ابدأ رحلتك بتسجيل أول دفعة نوى تمر.</p>
              <Link
                href="/pit-management/batches/new"
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>تسجيل دفعة</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBatches.map((batch) => (
                <Link 
                  key={batch.id} 
                  href={`/pit-management/batches/${batch.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{batch.batch_number}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {batch.source_name || "مصدر غير محدد"}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-emerald-700">{batch.quantity} كجم</div>
                    <div className="text-[10px] text-emerald-200/80 mt-1">
                      {new Date(batch.created_at).toLocaleDateString('ar-SA')}
                    </div>
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
