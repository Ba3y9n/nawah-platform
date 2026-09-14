"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: \`\${window.location.origin}/reset-password\`,
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

  return (
    <AuthLayout>
      {(dict, lang) => (
        <div className="flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900">{dict.resetYourPassword}</h1>
            <p className="text-sm text-slate-500 font-medium">
              {dict.resetSubtitle}
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
              <p className="text-sm font-bold">{dict.resetLinkSent}</p>
              <Link 
                href="/login"
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors"
              >
                {dict.backToLogin}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-700 block">{dict.emailLabel}</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    required 
                    className={\`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 \${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors\`}
                    dir="ltr"
                  />
                  <Mail className={\`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 \${lang === 'ar' ? 'right-3.5' : 'left-3.5'}\`} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.sendResetLink}
              </button>
            </form>
          )}

          {!success && (
            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{dict.backToLogin}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
