"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Scan, Sparkles, TestTube2, TrendingUp, PlusCircle, ChevronLeft
} from "lucide-react";

export default function PitManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const journeySteps = [
    {
      step: "01",
      href: "/pit-management/dashboard",
      label: "نظرة عامة",
      icon: LayoutDashboard,
      desc: "لوحة تتبع الرحلة الرقمية"
    },
    {
      step: "02",
      href: "/pit-management/batches",
      label: "دفعات النوى",
      icon: Package,
      desc: "بداية الرحلة وسجل الدفعات"
    },
    {
      step: "03",
      href: "/pit-management/scanner",
      label: "التحليل البصري",
      icon: Scan,
      desc: "استخراج الخصائص والمؤشرات"
    },
    {
      step: "04",
      href: "/pit-management/pathways",
      label: "الاستخدامات المحتملة",
      icon: Sparkles,
      desc: "اكتشاف المسارات التحويلية"
    },
    {
      step: "05",
      href: "/pit-management/experiments",
      label: "التجارب",
      icon: TestTube2,
      desc: "توثيق نتائج الاختبارات"
    },
    {
      step: "06",
      href: "/pit-management/impact",
      label: "قياس الأثر",
      icon: TrendingUp,
      desc: "العوائد البيئية والاقتصادية"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION: DIGITAL JOURNEY FLOW */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Quick Primary Action */}
            <div className="flex flex-col gap-3">
              <Link
                href="/pit-management/batches/new"
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/10 group border border-emerald-600"
              >
                <PlusCircle className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>تسجيل دفعة جديدة</span>
              </Link>
            </div>

            {/* Journey Sidebar Container */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xl shadow-slate-950/5 lg:sticky lg:top-28">
              <div className="px-3 py-2 mb-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider block">
                  رحلة النواة الرقمية
                </span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  6 مراحل
                </span>
              </div>

              {/* Horizontal Scroll on Mobile / Vertical Process Line on Desktop */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
                
                {/* Visual Vertical Connecting Line for Desktop */}
                <div className="hidden lg:block absolute top-6 bottom-6 right-8 w-0.5 bg-slate-100 z-0 pointer-events-none" />

                {journeySteps.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches') && !pathname.includes('/new'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative z-10 flex items-center gap-3 p-3 rounded-2xl transition-all shrink-0 lg:shrink border ${
                        isActive
                          ? "bg-emerald-950 text-white shadow-lg shadow-emerald-950/20 border-emerald-900"
                          : "bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 border-slate-100"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isActive 
                          ? "bg-amber-400 text-emerald-950 shadow-sm" 
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {item.step}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                          {item.label}
                        </div>
                        <div className={`text-[10px] truncate mt-0.5 ${isActive ? "text-emerald-200/80 font-medium" : "text-slate-400"}`}>
                          {item.desc}
                        </div>
                      </div>

                      {isActive && (
                        <ChevronLeft className="w-4 h-4 text-amber-400 shrink-0 hidden lg:block" />
                      )}
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
