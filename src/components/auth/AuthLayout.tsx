"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Language, authDict } from "@/lib/i18n/authDict";

interface AuthLayoutProps {
  children: (dict: typeof authDict.ar, lang: Language) => React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [lang, setLang] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nawah_auth_lang') as Language;
    if (saved === 'ar' || saved === 'en') {
      setLang(saved);
    }
    setMounted(true);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('nawah_auth_lang', newLang);
  };

  if (!mounted) return null;

  const dict = authDict[lang];
  const isRtl = lang === 'ar';

  return (
    <div 
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8faf9] overflow-hidden font-sans transition-all duration-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* LANGUAGE SWITCHER - Floating */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <button 
          onClick={toggleLang}
          className="bg-white/80 backdrop-blur-md border border-emerald-100 text-emerald-900 font-bold px-4 py-2 rounded-full text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span className={lang === 'ar' ? 'text-emerald-700' : 'text-slate-400'}>العربية</span>
          <span className="text-slate-300">|</span>
          <span className={lang === 'en' ? 'text-emerald-700' : 'text-slate-400'}>English</span>
        </button>
      </div>

      {/* BRAND PANEL - Always on the Right side visually on desktop */}
      <div className={`flex-1 bg-emerald-950 text-white relative flex flex-col items-center justify-center p-12 min-h-[40vh] md:min-h-[100dvh] overflow-hidden ${isRtl ? 'md:order-1' : 'md:order-2'} order-1`}>
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent bg-[length:20px_20px]" style={{ backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)' }} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-emerald-950/90" />
        
        <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
          <Link href="/" className="mb-8 block transform hover:scale-105 transition-transform">
            <div className="bg-white/95 p-4 rounded-2xl shadow-2xl backdrop-blur-sm">
              <Image 
                src="/nawah-logo.png" 
                alt="نواة | NAWAH" 
                width={160} 
                height={64} 
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
          </Link>
          
          <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
            نواة | NAWAH
          </h2>
          <p className="text-emerald-100/90 leading-relaxed text-sm md:text-base font-medium max-w-md">
            {dict.nawahMessage}
          </p>
        </div>
      </div>

      {/* FORM PANEL - Always on the Left side visually on desktop */}
      <div className={`flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 min-h-[100dvh] ${isRtl ? 'md:order-2' : 'md:order-1'} order-2`}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100/60 p-8 relative">
          {children(dict, lang)}
        </div>
      </div>
    </div>
  );
}
