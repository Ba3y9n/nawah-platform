"use client";

import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      {(dict, lang) => (
        <div className="flex flex-col space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-2">
            <Mail className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-slate-900">{dict.verifyEmailTitle}</h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
              {dict.verifyEmailMessage}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
            <Link 
              href="/login"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              {dict.backToLogin}
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
