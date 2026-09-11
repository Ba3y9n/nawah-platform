"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Leaf, AlertCircle, Loader2 } from "lucide-react";
import { loginAction } from "@/app/auth/actions";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false);
      } else if (result?.success) {
        router.push('/pit-management/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white border border-emerald-200 rounded-3xl p-8 shadow-xl space-y-6">
        
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
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-900">البريد الإلكتروني</label>
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
            <div className="flex justify-between items-center">
              <label className="font-bold text-emerald-900">كلمة المرور</label>
              <span className="text-xs text-emerald-600">نسيت كلمة المرور؟</span>
            </div>
            <input
              type="password"
              name="password"
              required
              disabled={loading}
              placeholder="******"
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-black py-3 rounded-2xl transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول</span>
              </>
            )}
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
