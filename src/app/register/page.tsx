"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Leaf, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { signupAction } from "@/app/auth/actions";
import { SAUDI_REGIONS, SAUDI_CITIES } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  
  const [selectedRegionId, setSelectedRegionId] = useState(SAUDI_REGIONS[0].id);
  const [selectedCityId, setSelectedCityId] = useState(
    SAUDI_CITIES.find(c => c.region_id === SAUDI_REGIONS[0].id)?.id || ""
  );

  const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setInfoMsg("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("كلمة المرور يجب ألا تقل عن 6 أحرف.");
      return;
    }

    setLoading(true);

    try {
      const result = await signupAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false);
      } else if (result?.info) {
        setInfoMsg(result.info);
        setLoading(false);
      } else if (result?.success) {
        router.push('/pit-management/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ غير متوقع أثناء إنشاء الحساب. يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-slate-50">
      <div className="max-w-2xl w-full bg-white border border-emerald-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto font-black shadow-lg shadow-amber-400/20">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">إنشاء حساب في نواة</h2>
          <p className="text-sm text-emerald-700/80">
            انضم إلى المنصة الوطنية للتدوير الحيوي لنوى التمر
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">الاسم الكامل <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                required 
                disabled={loading}
                placeholder="الاسم ثلاثي" 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">البريد الإلكتروني <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                name="email" 
                required 
                disabled={loading}
                placeholder="name@domain.com" 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">كلمة المرور <span className="text-rose-500">*</span></label>
              <input 
                type="password" 
                name="password" 
                required 
                disabled={loading}
                placeholder="أدخل 6 أحرف على الأقل" 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">تأكيد كلمة المرور <span className="text-rose-500">*</span></label>
              <input 
                type="password" 
                name="confirmPassword" 
                required 
                disabled={loading}
                placeholder="أعد كتابة كلمة المرور" 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">نوع المستخدم:</label>
              <select 
                name="user_type" 
                disabled={loading}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                <option value="individual">فرد</option>
                <option value="factory">مصنع / منشأة</option>
                <option value="farmer">مزارع / نخيل</option>
                <option value="waste_collector">مجمع نفايات عضوية</option>
                <option value="researcher">باحث / مركز أبحاث</option>
                <option value="other">جهة أخرى</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">اسم المنشأة/الجهة (إن وجد):</label>
              <input 
                type="text" 
                name="organization" 
                disabled={loading}
                placeholder="مثال: مصنع تمور كذا" 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">المنطقة:</label>
              <select 
                name="region_id"
                disabled={loading}
                value={selectedRegionId} 
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  const firstCity = SAUDI_CITIES.find(c => c.region_id === e.target.value);
                  if (firstCity) setSelectedCityId(firstCity.id);
                }} 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                {SAUDI_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name_ar}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">المدينة:</label>
              <select 
                name="city_id"
                disabled={loading}
                value={selectedCityId} 
                onChange={(e) => setSelectedCityId(e.target.value)} 
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                {availableCities.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black py-3 rounded-2xl transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>إنشاء حساب في نواة</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-sm text-emerald-700/80">
          لديك حساب مسبقاً؟{" "}
          <Link href="/login" className="text-amber-500 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
}
