"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Building2, MapPin, Package, TestTube2, 
  TrendingUp, ShieldCheck, LogOut, PlusCircle, ArrowLeft 
} from "lucide-react";
import { 
  getCurrentUser, logoutUser, getBatches, getExperiments, 
  SAUDI_REGIONS, SAUDI_CITIES, subscribeToStore 
} from "@/lib/store";
import { UserProfile, Batch, Experiment } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userBatches, setUserBatches] = useState<Batch[]>([]);
  const [userExperiments, setUserExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Create guest profile if not logged in
      const guest: UserProfile = {
        id: 'user-default',
        name: 'مُستخدِم نواة التجريبي',
        email: 'user@nawah.sa',
        user_type: 'date_factory',
        organization: 'منشأة معالجة وتدوير النوى',
        created_at: new Date().toISOString()
      };
      setUser(guest);
    } else {
      setUser(currentUser);
    }

    const allBatches = await getBatches();
    const allExperiments = await getExperiments();

    setUserBatches(allBatches);
    setUserExperiments(allExperiments);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
    const unsubscribe = subscribeToStore(() => {
      loadProfile();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const totalUserQuantity = userBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const regionName = SAUDI_REGIONS.find(r => r.id === user?.region_id)?.name_ar || 'القصيم';
  const cityName = SAUDI_CITIES.find(c => c.id === user?.city_id)?.name_ar || 'بريدة';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/20">
            {user?.name ? user.name.charAt(0) : 'ن'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-emerald-950">{user?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold border border-emerald-300">
                حساب نشط بـ RLS
              </span>
            </div>
            <p className="text-xs text-emerald-700/80 mt-0.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-rose-950/80 border border-rose-800/80 text-rose-300 hover:bg-rose-900 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* USER METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
            <span>عدد الدفعات المسجلة</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-950 dir-ltr text-right">
            {loading ? "..." : userBatches.length}
          </div>
          <p className="text-[11px] text-emerald-600/70">دُفعة نوى محفوظة لحسابك</p>
        </div>

        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-amber-400">
            <span>إجمالي كمية النوى</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-300 dir-ltr text-right">
            {loading ? "..." : `${totalUserQuantity.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600/70">مجموع الكيلوجرامات المسجلة</p>
        </div>

        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>عدد التجارب المنفذة</span>
            <TestTube2 className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 dir-ltr text-right">
            {loading ? "..." : userExperiments.length}
          </div>
          <p className="text-[11px] text-emerald-600/70">تجربة تحويلية مرتبطة بدفعاتك</p>
        </div>

      </div>

      {/* USER PROFILE INFO & DETAILS */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          بيانات الحساب الشخصي والمنشأة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="text-emerald-600/80 font-bold block text-[10px]">نوع المستخدم:</span>
            <span className="text-sm font-extrabold text-emerald-950">
              {user?.user_type === 'date_factory' ? 'مصنع تمور وتجهيز' :
               user?.user_type === 'farmer' ? 'مزارع / نخيل' :
               user?.user_type === 'waste_collector' ? 'مجمع نفايات عضوية' :
               user?.user_type === 'researcher' ? 'باحث / مركز أبحاث' : 'منشأة تدوير'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="text-emerald-600/80 font-bold block text-[10px]">اسم المنشأة / الجهة:</span>
            <span className="text-sm font-bold text-amber-300">{user?.organization || 'غير محدد'}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
            <span className="text-emerald-600/80 font-bold block text-[10px]">الموقع والمنطقة:</span>
            <span className="text-sm font-bold text-emerald-950 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {cityName} — {regionName}
            </span>
          </div>
        </div>
      </div>

      {/* RECENT USER BATCHES */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            الدفعات التي سجلتها في النظام
          </h3>

          <Link
            href="/pit-management/batches/new"
            className="flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-bold text-xs"
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
            {userBatches.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-white p-3.5 rounded-2xl border border-emerald-900 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-300 dir-ltr">{b.batch_number}</span>
                  <span className="text-slate-600 font-medium mr-3">{b.source_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-emerald-950">{b.quantity} كجم</span>
                  <Link href={`/pit-management/batches/${b.id}`} className="text-amber-400 font-bold hover:underline">
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
