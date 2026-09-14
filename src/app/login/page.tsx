"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginAction } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false);
      } else if (result?.success) {
        const urlParams = new URLSearchParams(window.location.search);
        const nextUrl = urlParams.get('next') || '/pit-management/dashboard';
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <AuthLayout>
      {(dict, lang) => (
        <div className="flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900">{dict.welcomeBack}</h1>
            <p className="text-sm text-slate-500 font-medium">
              {dict.loginSubtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700 block">{dict.emailLabel}</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  required 
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                  dir="ltr"
                />
                <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700 block">{dict.passwordLabel}</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  required 
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                  dir="ltr"
                />
                <Lock className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-xs font-medium text-slate-600">{dict.rememberMe}</span>
              </label>
              <Link href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                {dict.forgotPassword}
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.signIn}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">{dict.or}</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleOAuth('google')}
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {dict.continueWithGoogle}
            </button>
            <button 
              onClick={() => handleOAuth('apple')}
              type="button"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-3 text-sm shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 1.15c.19 1.25-.33 2.55-1.18 3.55-.83.98-2.12 1.63-3.26 1.54-.22-1.3.36-2.58 1.16-3.55.85-1.02 2.19-1.68 3.28-1.54zm-6.66 4.93c1.94-.13 3.63 1.05 4.54 1.05 1.05 0 2.81-1.34 4.88-1.08 2.08.26 3.98 1.35 5.06 3.25-4.32 2.5-3.64 8.7 1.25 10.66-1.03 2.53-2.17 5.06-4.66 5.06-2.08 0-2.88-1.32-5.1-1.32-2.17 0-3.08 1.27-4.99 1.32-2.31.05-4.07-2.64-5.63-5.21-2.99-4.83-4.95-12.01-2.26-16.14 1.38-2.11 3.66-3.4 5.92-3.47 2.04-.06 3.69 1.16 5.01 1.16z"/></svg>
              {dict.continueWithApple}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link href="/register" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              {dict.noAccount}
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
    </Suspense>
  );
}
