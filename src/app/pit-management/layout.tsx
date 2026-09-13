"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Scan, Sparkles, TestTube2, TrendingUp, PlusCircle
} from "lucide-react";

export default function PitManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/pit-management/dashboard",
      label: "نظرة عامة",
      icon: LayoutDashboard,
      desc: "لوحة التحكم والمؤشرات"
    },
    {
      href: "/pit-management/batches",
      label: "دفعات النوى",
      icon: Package,
      desc: "سجل الدفعات والتتبع"
    },
    {
      href: "/pit-management/scanner",
      label: "التحليل البصري",
      icon: Scan,
      desc: "الذكاء الاصطناعي"
    },
    {
      href: "/pit-management/pathways",
      label: "الاستخدامات",
      icon: Sparkles,
      desc: "المسارات الصناعية"
    },
    {
      href: "/pit-management/experiments",
      label: "التجارب",
      icon: TestTube2,
      desc: "التجارب المخبرية"
    },
    {
      href: "/pit-management/impact",
      label: "الأثر البيئي",
      icon: TrendingUp,
      desc: "قياس العوائد"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/pit-management/batches/new"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-700/20 group"
              >
                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>تسجيل دفعة جديدة</span>
              </Link>
            </div>

            {/* Main Menu */}
            <div className="bg-white border border-emerald-100/60 rounded-3xl p-3 shadow-xl shadow-emerald-900/5 lg:sticky lg:top-28">
              <div className="px-4 py-3 mb-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                  إدارة النظام
                </span>
              </div>

              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches'));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all shrink-0 lg:shrink group ${
                        isActive
                          ? "bg-emerald-50/80 text-emerald-900 font-black border border-emerald-200/50"
                          : "text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-800 border border-transparent"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-emerald-50 text-emerald-600/60 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">
                          {item.label}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-700/70' : 'text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
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
