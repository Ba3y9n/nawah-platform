"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LogIn, Leaf, AlertCircle } from "lucide-react";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg("");
    const result = await login(formData);
    if (result?.error) {
      setErrorMsg(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-slate-50 border border-emerald-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto font-black shadow-lg shadow-amber-400/20">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">تسجيل الدخول</h2>
          <p className="text-sm text-emerald-700/80">
            مرحباً بعودتك إلى منصة نواة
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form action={handleAction} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-900">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@domain.com"
              className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-emerald-900">كلمة المرور</label>
              <Link href="#" className="text-xs text-amber-500 hover:underline">نسيت كلمة المرور؟</Link>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="******"
              className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black py-3 rounded-2xl transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
          </button>
        </form>

        <div className="text-center text-sm text-emerald-700/80">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-amber-500 font-bold hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>

      </div>
    </div>
  );
}
