"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Building2, MapPin, Package, TestTube2, 
  TrendingUp, ShieldCheck, LogOut, PlusCircle, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SAUDI_REGIONS, SAUDI_CITIES } from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userBatches, setUserBatches] = useState<any[]>([]);
  const [userExperiments, setUserExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');

      // Fetch profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (prof) {
        setProfile(prof);
      }

      // Fetch batches
      const { data: bList } = await supabase
        .from('batches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setUserBatches(bList || []);

      // Fetch experiments
      const { data: eList } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setUserExperiments(eList || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-emerald-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs text-emerald-700">جاري تحميل بيانات الملف الشخصي من قاعدة البيانات...</p>
      </div>
    );
  }

  const totalUserQuantity = userBatches.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
  const regionName = SAUDI_REGIONS.find(r => r.id === profile?.region_id)?.name_ar || 'غير محدد';
  const cityName = SAUDI_CITIES.find(c => c.id === profile?.city_id)?.name_ar || 'غير محدد';

  const userTypeMap: Record<string, string> = {
    date_factory: 'مصنع تمور وتجهيز',
    factory: 'مصنع / منشأة',
    farmer: 'مزارع / نخيل',
    waste_collector: 'مجمع نفايات عضوية',
    researcher: 'باحث / مركز أبحاث',
    recycler: 'منشأة تدوير',
    individual: 'فرد',
    other: 'جهة أخرى'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/20">
            {profile?.full_name ? profile.full_name.charAt(0) : 'ن'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-emerald-950">{profile?.full_name || 'المستخدم'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold border border-emerald-300">
                حساب نشط ومحمي بـ RLS
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-0.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>{userEmail || profile?.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* USER METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>عدد الدفعات المسجلة</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-950 dir-ltr text-right">
            {userBatches.length}
          </div>
          <p className="text-[11px] text-emerald-600">دُفعة نوى محفوظة لحسابك</p>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-amber-600">
            <span>إجمالي كمية النوى</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-500 dir-ltr text-right">
            {totalUserQuantity.toLocaleString()} كجم
          </div>
          <p className="text-[11px] text-emerald-600">مجموع الكيلوجرامات المسجلة</p>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>عدد التجارب المنفذة</span>
            <TestTube2 className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 dir-ltr text-right">
            {userExperiments.length}
          </div>
          <p className="text-[11px] text-emerald-600">تجربة تحويلية مرتبطة بدفعاتك</p>
        </div>

      </div>

      {/* USER PROFILE INFO & DETAILS */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          بيانات الحساب الشخصي والمنشأة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-emerald-700 font-bold block text-[10px]">نوع المستخدم:</span>
            <span className="text-sm font-extrabold text-emerald-950">
              {userTypeMap[profile?.user_type] || profile?.user_type || 'فرد'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-emerald-700 font-bold block text-[10px]">اسم المنشأة / الجهة:</span>
            <span className="text-sm font-bold text-amber-600">{profile?.organization || 'غير محدد'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-emerald-700 font-bold block text-[10px]">الموقع والمنطقة:</span>
            <span className="text-sm font-bold text-emerald-950 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {cityName} — {regionName}
            </span>
          </div>
        </div>
      </div>

      {/* RECENT USER BATCHES */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            الدفعات التي سجلتها في النظام
          </h3>

          <Link
            href="/pit-management/batches/new"
            className="flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة دفعة</span>
          </Link>
        </div>

        {userBatches.length === 0 ? (
          <div className="text-center py-8 text-xs text-emerald-700">
            لم تسجل أي دفعات حتى الآن.
          </div>
        ) : (
          <div className="space-y-2">
            {userBatches.slice(0, 5).map((b) => (
              <div key={b.id} className="bg-slate-50 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-600 dir-ltr">{b.batch_number}</span>
                  <span className="text-emerald-900 font-medium mr-3">{b.source_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-emerald-950">{b.quantity} كجم</span>
                  <Link href={`/pit-management/batches/${b.id}`} className="text-amber-500 font-bold hover:underline">
                    التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
