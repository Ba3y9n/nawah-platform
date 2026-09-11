"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Leaf, AlertCircle } from "lucide-react";
import { signup } from "@/app/auth/actions";
import { SAUDI_REGIONS, SAUDI_CITIES } from "@/lib/store";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState(SAUDI_REGIONS[0].id);
  const [selectedCityId, setSelectedCityId] = useState(
    SAUDI_CITIES.find(c => c.region_id === SAUDI_REGIONS[0].id)?.id || ""
  );

  const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg("");
    
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setErrorMsg("كلمات المرور غير متطابقة");
      setLoading(false);
      return;
    }

    const result = await signup(formData);
    if (result?.error) {
      setErrorMsg(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-white">
      <div className="max-w-2xl w-full bg-slate-50 border border-emerald-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto font-black shadow-lg shadow-amber-400/20">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">إنشاء حساب في نواة</h2>
          <p className="text-sm text-emerald-700/80">
            انضم إلى منظومة الاستفادة من نوى التمر
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form action={handleAction} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">الاسم الكامل <span className="text-rose-500">*</span></label>
              <input type="text" name="name" required placeholder="الاسم ثلاثي" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">البريد الإلكتروني <span className="text-rose-500">*</span></label>
              <input type="email" name="email" required placeholder="name@domain.com" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">كلمة المرور <span className="text-rose-500">*</span></label>
              <input type="password" name="password" required placeholder="******" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">تأكيد كلمة المرور <span className="text-rose-500">*</span></label>
              <input type="password" name="confirmPassword" required placeholder="******" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">نوع المستخدم:</label>
              <select name="user_type" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400">
                <option value="individual">فرد</option>
                <option value="factory">مصنع / منشأة</option>
                <option value="researcher">باحث</option>
                <option value="other">جهة أخرى</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">اسم المنشأة/الجهة (إن وجد):</label>
              <input type="text" name="organization" placeholder="مثال: مصنع تمور كذا" className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">المنطقة:</label>
              <select 
                name="region_id"
                value={selectedRegionId} 
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  const firstCity = SAUDI_CITIES.find(c => c.region_id === e.target.value);
                  if (firstCity) setSelectedCityId(firstCity.id);
                }} 
                className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400">
                {SAUDI_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name_ar}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-emerald-900">المدينة:</label>
              <select 
                name="city_id"
                value={selectedCityId} 
                onChange={(e) => setSelectedCityId(e.target.value)} 
                className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400">
                {availableCities.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black py-3 rounded-2xl transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? "جاري إنشاء الحساب..." : "إنشاء حساب في نواة"}</span>
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
