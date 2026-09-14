"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Language, authDict } from "@/lib/i18n/authDict";
import { Globe } from "lucide-react";

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
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#FAFAFA] font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* BRAND PANEL - Premium Dark Emerald */}
      <div className={`flex-1 relative flex flex-col items-center justify-center p-8 md:p-12 min-h-[30vh] md:min-h-screen overflow-hidden ${isRtl ? 'md:order-1' : 'md:order-2'} order-1 bg-[#022B1E]`}>
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-[#022B1E] to-[#01140E]"></div>
        
        {/* Minimal grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
        
        <div className="relative z-10 w-full max-w-md flex flex-col items-start md:items-center text-start md:text-center">
          <Link href="/" className="mb-10 inline-block">
            <Image 
              src="/nawah-logo.png" 
              alt="نواة | NAWAH" 
              width={180} 
              height={72} 
              className="h-10 md:h-14 w-auto object-contain brightness-0 invert opacity-90"
              priority
            />
          </Link>
          
          <h2 className="text-2xl md:text-4xl font-black mb-5 text-white leading-snug tracking-tight">
            نواة | NAWAH
          </h2>
          <p className="text-emerald-100/70 leading-relaxed text-sm md:text-base font-medium">
            {dict.nawahMessage}
          </p>
        </div>
      </div>

      {/* FORM PANEL - Clean & Minimal */}
      <div className={`flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen ${isRtl ? 'md:order-2' : 'md:order-1'} order-2`}>
        <div className="w-full max-w-[420px] relative">
          
          {/* Subtle Language Switcher */}
          <div className="absolute -top-12 md:-top-16 right-0 left-auto flex justify-end">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 p-8 sm:p-10">
            {children(dict, lang)}
          </div>
        </div>
      </div>
    </div>
  );
}
