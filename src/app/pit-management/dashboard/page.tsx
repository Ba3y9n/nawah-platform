import Link from "next/link";
import { 
  Package, TestTube2, Building2, TrendingUp, PlusCircle, 
  ArrowLeft, Leaf, MapPin
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PitDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guest mode allowed

  
  // Data for logged-in users, empty for guests
  let profile = null;
  let batches = [];
  let experiments = [];

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


  const totalBatches = batches?.length || 0;
  const totalExperiments = experiments?.length || 0;
  const totalQuantity = batches?.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0) || 0;
  const recentBatches = batches?.slice(0, 5) || [];
  const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';

  return (
    <div className="space-y-6">
      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-amber-900 font-bold flex items-center gap-2">
              تتصفح المنصة كزائر
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              يمكنك استكشاف جميع أقسام المنصة، ولكن لتسجيل الدفعات وحفظ التجارب وإنشاء بياناتك الخاصة، نرجو تسجيل الدخول.
            </p>
          </div>
          <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors text-center shrink-0">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}
      
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950 flex items-center gap-2">
            مرحباً، {userName} 👋
          </h1>
          <p className="text-sm text-emerald-700/80 mt-1">
            لوحة التحكم الشخصية في نظام إدارة وتتبع نوى التمر
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/pit-management/batches/new"
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
          >
            <PlusCircle className="w-5 h-5" />
            تسجيل دفعة جديدة
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">إجمالي النوى المسجلة</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
              {totalQuantity.toLocaleString()} كجم
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">
              إجمالي الكمية التي قمت بتسجيلها في حسابك
            </p>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">عدد الدفعات</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-amber-600 border border-emerald-200">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
              {totalBatches}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">
              دُفعة نوى محفوظة في قاعدة البيانات
            </p>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">عدد التجارب</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TestTube2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">
              {totalExperiments}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">
              تجارب إعادة الاستخدام المرتبطة بدفعاتك
            </p>
          </div>
        </div>

      </div>

      {/* RECENT BATCHES TABLE */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              أحدث الدفعات المسجلة بحسابك
            </h3>
          </div>
          
          <Link
            href="/pit-management/batches"
            className="text-xs font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors"
          >
            عرض جميع الدفعات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {recentBatches.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-emerald-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-emerald-900">لم تقم بتسجيل أي دفعات حتى الآن.</p>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              قم بتسجيل أول دفعة من نوى التمر لحسابك لتظهر البيانات تلقائياً في لوحة التحكم.
            </p>
            <Link
              href="/pit-management/batches/new"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow"
            >
              <PlusCircle className="w-4 h-4" />
              تسجيل أول دفعة
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-emerald-700 border-b border-emerald-100">
                  <th className="py-2.5 px-3">رقم الدفعة</th>
                  <th className="py-2.5 px-3">المصدر</th>
                  <th className="py-2.5 px-3">الكمية (كجم)</th>
                  <th className="py-2.5 px-3">تاريخ التسجيل</th>
                  <th className="py-2.5 px-3">تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-emerald-950">
                {recentBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-600 dir-ltr text-right">{b.batch_number}</td>
                    <td className="py-3 px-3 font-medium">
                      <div>{b.source_name}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-950">{Number(b.quantity).toLocaleString()} كجم</td>
                    <td className="py-3 px-3 text-emerald-700">{new Date(b.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/pit-management/batches/${b.id}`}
                        className="text-xs text-amber-600 hover:underline font-bold"
                      >
                        عرض
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
