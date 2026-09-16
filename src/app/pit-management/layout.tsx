"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PitManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const journeySteps = [
    { step: "01", href: "/pit-management/dashboard", label: "نظرة عامة", status: "مباشر" },
    { step: "02", href: "/pit-management/batches", label: "دفعات النوى", status: "السجل" },
    { step: "03", href: "/pit-management/scanner", label: "التحليل البصري", status: "ذكاء اصطناعي" },
    { step: "04", href: "/pit-management/pathways", label: "الاستخدامات", status: "مسارات" },
    { step: "05", href: "/pit-management/experiments", label: "التجارب", status: "اختبارات" },
    { step: "06", href: "/pit-management/impact", label: "قياس الأثر", status: "عوائد" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-950" dir="rtl">
      
      {/* MOBILE TOP JOURNEY BAR */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {journeySteps.map((item) => {
            const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches') && !pathname.includes('/new'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#F0FDF4] text-[#064E3B] border-[#86EFAC]"
                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <span className={`text-[10px] ${isActive ? "text-[#059669] font-black" : "text-slate-400"}`}>{item.step}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* EDITORIAL SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 lg:sticky lg:top-28">
            
            {/* BRAND HEADER */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-5">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#059669] block mb-2">مركز التحكم والرحلة</span>
                <h2 className="text-2xl font-black text-slate-900">إدارة النوى</h2>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  منظومة رقمية متكاملة لربط شحنات نوى التمر بالبيانات والتحليل والتجارب وقياس الأثر.
                </p>
              </div>

              <Link
                href="/pit-management/batches/new"
                className="flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-bold px-4 py-3.5 rounded-2xl text-xs transition-all shadow-[0_8px_16px_-6px_rgba(6,78,59,0.3)] w-full"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>تسجيل دفعة جديدة</span>
              </Link>
            </div>

            {/* PROCESS STEP NAVIGATION - REDESIGNED TO MATCH USER IMAGE */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] space-y-4">
              <span className="text-xs font-black text-[#64748B] block px-3 mb-4">
                تسلسل مراحل الرحلة
              </span>

              <nav className="space-y-2 relative">
                {journeySteps.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches') && !pathname.includes('/new'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between p-4 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#F0FDF4] border border-[#86EFAC] text-[#0F172A]"
                          : "bg-transparent border border-transparent hover:bg-slate-50 text-[#475569]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black ${
                          isActive ? "text-[#059669]" : "text-[#94A3B8]"
                        }`}>
                          {item.step}
                        </span>
                        <span className="text-[15px] font-bold">{item.label}</span>
                      </div>

                      <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full ${
                        isActive 
                          ? "bg-[#064E3B] text-white" 
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {item.status}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* MAIN SECTION CONTENT */}
          <main className="lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
