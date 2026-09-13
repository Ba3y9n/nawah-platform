"use client";

import Link from "next/link";
import { X, Lock, LogIn, UserPlus } from "lucide-react";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  returnUrl?: string;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  title = "تسجيل الدخول مطلوب",
  message = "هذه الميزة تتطلب حسابًا لحفظ بياناتك.",
  returnUrl
}: AuthModalProps) {
  
  // Save return URL to local storage if provided
  useEffect(() => {
    if (isOpen && returnUrl) {
      localStorage.setItem('nawah_return_url', returnUrl);
    }
  }, [isOpen, returnUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col items-center text-center mt-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6 shadow-inner border border-amber-100">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            {title}
          </h2>
          
          <p className="text-slate-500 leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="w-full space-y-3">
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              <LogIn className="w-5 h-5" />
              <span>تسجيل الدخول</span>
            </Link>
            
            <Link 
              href="/register"
              className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-emerald-800 font-bold py-3.5 px-4 rounded-xl transition-all border border-slate-200"
            >
              <UserPlus className="w-5 h-5" />
              <span>إنشاء حساب جديد</span>
            </Link>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            الاستمرار كزائر
          </button>
        </div>
      </div>
    </div>
  );
}
