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

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch User Batches
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch User Experiments
  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id);

  const totalBatches = batches?.length || 0;
  const totalExperiments = experiments?.length || 0;
  const totalQuantity = batches?.reduce((acc, b) => acc + (b.quantity || 0), 0) || 0;
  const recentBatches = batches?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950 flex items-center gap-2">
            مرحباً، {profile?.full_name || 'المستخدم'} 👋
          </h1>
          <p className="text-sm text-emerald-700/80 mt-1">
            لوحة التحكم الشخصية في نظام إدارة نوى التمر
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-slate-50/80 border border-emerald-200/60 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">إجمالي النوى المسجلة</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
              {totalQuantity.toLocaleString()} كجم
            </div>
            <p className="text-[11px] text-emerald-700/70 mt-1">
              إجمالي الكمية التي قمت بتسجيلها
            </p>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-emerald-200/60 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">عدد الدفعات</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-amber-300 border border-emerald-200/60">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
              {totalBatches}
            </div>
            <p className="text-[11px] text-emerald-700/70 mt-1">
              التي قمت بإضافتها للمنصة
            </p>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-emerald-200/60 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">عدد التجارب</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <TestTube2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tight">
              {totalExperiments}
            </div>
            <p className="text-[11px] text-emerald-700/70 mt-1">
              تجارب إعادة الاستخدام التي بدأتها
            </p>
          </div>
        </div>

      </div>

      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              أحدث الدفعات المسجلة
            </h3>
          </div>
          
          <Link
            href="/pit-management/batches"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            عرض جميع الدفعات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {recentBatches.length === 0 ? (
          <div className="text-center py-12 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200/60 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-emerald-800">لم تقم بتسجيل أي دفعات حتى الآن.</p>
            <Link
              href="/pit-management/batches/new"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              تسجيل أول دفعة
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-emerald-600 border-b border-emerald-200/60">
                  <th className="py-2.5 px-3">رقم الدفعة</th>
                  <th className="py-2.5 px-3">المصدر</th>
                  <th className="py-2.5 px-3">الكمية (كجم)</th>
                  <th className="py-2.5 px-3">تاريخ التسجيل</th>
                  <th className="py-2.5 px-3">تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/60 text-slate-700">
                {recentBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-emerald-100/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-300 dir-ltr text-right">{b.batch_number}</td>
                    <td className="py-3 px-3 font-medium">
                      <div>{b.source_name}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-950">{b.quantity.toLocaleString()} كجم</td>
                    <td className="py-3 px-3 text-emerald-700/80">{new Date(b.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/pit-management/batches/${b.id}`}
                        className="text-xs text-amber-400 hover:underline font-bold"
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
