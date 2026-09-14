"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-950" dir="rtl">
      
      {/* MOBILE TOP JOURNEY BAR */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {journeySteps.map((item) => {
            const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches') && !pathname.includes('/new'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-emerald-950 text-white border-emerald-950 shadow-sm"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <span className={`text-[10px] ${isActive ? "text-emerald-400 font-black" : "text-slate-400"}`}>{item.step}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* EDITORIAL SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            
            {/* BRAND HEADER */}
            <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-emerald-900 shadow-xl space-y-4">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">مركز التحكم والرحلة</span>
                <h2 className="text-xl font-black text-white">إدارة النوى</h2>
                <p className="text-xs text-emerald-200/70 mt-1 font-medium leading-relaxed">
                  منظومة رقمية متكاملة لربط شحنات نوى التمر بالبيانات والتحليل والتجارب وقياس الأثر.
                </p>
              </div>

              <Link
                href="/pit-management/batches/new"
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-md w-full"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>تسجيل دفعة جديدة</span>
              </Link>
            </div>

            {/* PROCESS STEP NAVIGATION */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-2">
                تسلسل مراحل الرحلة
              </span>

              <nav className="space-y-1 relative">
                {journeySteps.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches') && !pathname.includes('/new'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between p-3 rounded-2xl transition-all border ${
                        isActive
                          ? "bg-emerald-50/90 text-emerald-950 font-black border-emerald-300/80 shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-black ${
                          isActive ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {item.step}
                        </span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>

                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isActive ? "bg-emerald-950 text-white font-bold" : "text-slate-400 bg-slate-100"
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
