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
      desc: "لوحة التحكم الحية والمؤشرات"
    },
    {
      href: "/pit-management/batches",
      label: "دفعات النوى",
      icon: Package,
      desc: "سجل الدفعات ورخص التتبع والـ QR"
    },
    {
      href: "/pit-management/scanner",
      label: "تحليل النواة",
      icon: Scan,
      desc: "تحليل الصورة ورطوبة ونقاء الدفعة"
    },
    {
      href: "/pit-management/pathways",
      label: "الاستخدامات",
      icon: Sparkles,
      desc: "مسارات الاستفادة الحيوية والصناعية"
    },
    {
      href: "/pit-management/experiments",
      label: "التجارب",
      icon: TestTube2,
      desc: "التجارب المخبرية والتطبيقية"
    },
    {
      href: "/pit-management/impact",
      label: "الأثر",
      icon: TrendingUp,
      desc: "قياس الأثر البيئي والاقتصادي"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-100 font-sans border-t border-emerald-900/40">
      {/* HEADER BAR FOR PIT MANAGEMENT */}
      <div className="bg-emerald-50/80 border-b border-emerald-200/50 sticky top-[69px] z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md shadow-amber-400/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-emerald-950 flex flex-wrap items-center gap-2">
                قسم إدارة النوى
                <span className="hidden sm:inline text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300/60 font-semibold">
                  مترابط ومحفوظ بـ Supabase DB
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-700/80 font-medium">
                منظومة موحدة لتسجيل، تحليل، وتتبع دفعة نوى التمر من المصدر إلى التجربة والأثر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/pit-management/batches/new"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تسجيل دفعة جديدة</span>
            </Link>

            <Link
              href="/pit-management/experiments/new"
              className="flex items-center gap-1.5 bg-emerald-100/80 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all"
            >
              <TestTube2 className="w-4 h-4 text-amber-400" />
              <span>تسجيل تجربة</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER WITH SIDEBAR */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SIDEBAR NAVIGATION (Desktop 3 cols) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-emerald-50/90 border border-emerald-200/70 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl backdrop-blur-md lg:sticky lg:top-36">
              
              <div className="px-3 py-2 border-b border-emerald-200/60 mb-3">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  أقسام إدارة النوى
                </span>
                <span className="text-[10px] text-emerald-600/70">تغييرات البيانات تنعكس فورياً</span>
              </div>

              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/pit-management/batches' && pathname.startsWith('/pit-management/batches'));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start gap-3 p-3 rounded-2xl transition-all shrink-0 lg:shrink ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-800 to-emerald-900 border border-amber-400/50 text-emerald-950 shadow-lg shadow-emerald-950/50"
                          : "text-emerald-800/90 hover:bg-emerald-100/40 hover:text-emerald-950 border border-transparent"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isActive ? "bg-amber-400 text-emerald-950" : "bg-emerald-100/80 text-emerald-600"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight flex items-center justify-between">
                          <span>{item.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                        </div>
                        <div className="text-[10px] text-emerald-600/70 font-medium mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden lg:block mt-6 p-3.5 rounded-2xl bg-emerald-100/40 border border-emerald-200/60 text-[11px] text-emerald-700/80 space-y-1">
                <p className="font-bold text-amber-300">تسلسل البيانات الحقيقي:</p>
                <p className="text-[10px] leading-relaxed">
                  تسجيل الدفعة ← حفظ في Supabase ← التحليل البصري ← اختيار المسار ← إجراء التجربة ← حساب الأثر
                </p>
              </div>

            </div>
          </aside>

          {/* MAIN SECTION CONTENT (Desktop 9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
