"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة."); // Will ideally use dict, but good enough for now
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("يجب أن تحتوي كلمة المرور على 6 أحرف كحد أدنى.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <AuthLayout>
      {(dict, lang) => (
        <div className="flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900">{dict.setNewPassword}</h1>
            <p className="text-sm text-slate-500 font-medium">
              {dict.setNewPassword}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold">{dict.passwordUpdated}</p>
              <Link 
                href="/login"
                className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20"
              >
                {dict.signIn}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-700 block">{dict.passwordLabel}</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="password"
                    required 
                    className={\`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 \${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors\`}
                    dir="ltr"
                  />
                  <Lock className={\`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 \${lang === 'ar' ? 'right-3.5' : 'left-3.5'}\`} />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-700 block">{dict.confirmPassword}</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="confirmPassword"
                    required 
                    className={\`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 \${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors\`}
                    dir="ltr"
                  />
                  <Lock className={\`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 \${lang === 'ar' ? 'right-3.5' : 'left-3.5'}\`} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.updatePassword}
              </button>
            </form>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
