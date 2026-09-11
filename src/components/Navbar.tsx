"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, X, Leaf, Layers, MapPin, BookOpen, 
  Bot, User, Info, LogIn, UserPlus, ChevronDown, LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser, subscribeToStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [pitDropdown, setPitDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const unsubscribe = subscribeToStore(() => {
      setCurrentUser(getCurrentUser());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isPitManagementActive = pathname.startsWith('/pit-management') || pathname === '/dashboard' || pathname === '/batches' || pathname === '/scanner' || pathname === '/experiments' || pathname === '/pathways' || pathname === '/impact';

  const pitSubMenu = [
    { href: "/pit-management/dashboard", label: "نظرة عامة", desc: "لوحة التحكم الرئيسية والمؤشرات الحية" },
    { href: "/pit-management/batches", label: "دفعات النوى", desc: "سجل الدفعات ورخص التتبع والـ QR" },
    { href: "/pit-management/scanner", label: "تحليل النواة", desc: "تحليل الرطوبة والخصائص البصرية" },
    { href: "/pit-management/pathways", label: "الاستخدامات", desc: "مسارات الاستفادة الصناعية والتحويلية" },
    { href: "/pit-management/experiments", label: "التجارب", desc: "سجل التجارب المختبرية والتطبيقات" },
    { href: "/pit-management/impact", label: "الأثر", desc: "حساب النفايات المحولة وبصمة الكربون" },
  ];

  const mainLinks = [
    { href: "/", label: "الرئيسية", icon: Leaf },
    { href: "/map", label: "الخريطة الذكية", icon: MapPin },
    { href: "/evidence", label: "المصادر والأدلة", icon: BookOpen },
    { href: "/assistant", label: "مساعد نواة", icon: Bot },
    { href: "/about", label: "عن نواة", icon: Info },
  ];

  const handleLogout = async () => {
    await logoutUser();
    setUserDropdown(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      <nav className={`w-full transition-all duration-300 ${
        scrolled || pathname !== '/' 
          ? "bg-emerald-50/95 backdrop-blur-md shadow-lg border-b border-emerald-200/40 py-3" 
          : "bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-4 border-b border-emerald-200/30"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* BRAND LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-emerald-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-emerald-950 tracking-tight flex items-center gap-1.5">
                  نواة <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">NAWAH</span>
                </span>
                <span className="text-[10px] text-emerald-700/80 font-medium">المنصة الوطنية للتدوير الحيوي لنوى التمر</span>
              </div>
            </Link>
            
            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden xl:flex items-center gap-1">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === '/' 
                    ? "bg-emerald-200/60 text-emerald-950 shadow-sm" 
                    : "text-emerald-100/90 hover:text-emerald-950 hover:bg-emerald-100/40"
                }`}
              >
                الرئيسية
              </Link>

              {/* DROPDOWN MENU: إدارة النوى */}
              <div 
                className="relative"
                onMouseEnter={() => setPitDropdown(true)}
                onMouseLeave={() => setPitDropdown(false)}
              >
                <Link
                  href="/pit-management/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isPitManagementActive
                      ? "bg-amber-500 text-emerald-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-amber-300 hover:bg-emerald-100/60"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>إدارة النوى</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pitDropdown ? 'rotate-180' : ''}`} />
                </Link>

                {pitDropdown && (
                  <div className="absolute top-full right-0 w-64 pt-2 z-50">
                    <div className="bg-emerald-50 border border-emerald-300/60 rounded-2xl shadow-2xl p-2 backdrop-blur-xl">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-amber-400 border-b border-emerald-200/60 mb-1">
                        منظومة إدارة وتتبع نوى التمر
                      </div>
                      {pitSubMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPitDropdown(false)}
                          className={`block px-3 py-2 rounded-xl text-xs transition-colors ${
                            pathname === item.href
                              ? "bg-emerald-200 text-amber-300 font-bold"
                              : "text-emerald-100 hover:bg-emerald-100/80 hover:text-emerald-950"
                          }`}
                        >
                          <div className="font-bold">{item.label}</div>
                          <div className="text-[10px] text-emerald-600/80 font-normal">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mainLinks.filter(l => l.href !== '/').map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-emerald-200/60 text-emerald-950 shadow-sm" 
                        : "text-emerald-100/90 hover:text-emerald-950 hover:bg-emerald-100/40"
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* USER ACTIONS & AUTH */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 bg-emerald-100/80 border border-emerald-300/60 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-950 hover:border-amber-400 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0) : 'ن'}
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                  </button>

                  {userDropdown && (
                    <div className="absolute top-full left-0 w-52 mt-2 bg-emerald-50 border border-emerald-300/80 rounded-2xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-emerald-200/60 mb-1">
                        <p className="text-xs font-bold text-emerald-950 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-emerald-700/70 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-100/80 hover:text-amber-300 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>الحساب الشخصي</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-right px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 hover:text-amber-300 px-3 py-2 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب</span>
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button 
              className="xl:hidden text-emerald-100 p-2 rounded-lg hover:bg-emerald-100/60"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        {isOpen && (
          <div className="xl:hidden bg-emerald-50 border-b border-emerald-200 shadow-2xl px-4 py-6 mt-3 space-y-4 animate-in slide-in-from-top duration-200">
            
            <div className="bg-emerald-100/60 p-3 rounded-2xl border border-emerald-300/60">
              <p className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                إدارة النوى
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {pitSubMenu.map(sub => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                      pathname === sub.href ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-emerald-100 hover:bg-emerald-200/50'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
                      pathname === link.href ? "bg-emerald-200 text-amber-300" : "text-emerald-100 hover:bg-emerald-100/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 opacity-80" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <hr className="border-emerald-200/60 my-2" />

            <div className="flex flex-col gap-2 pt-2">
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-emerald-200 text-emerald-950 py-2.5 rounded-xl font-bold text-xs"
                  >
                    <User className="w-4 h-4" />
                    الحساب الشخصي ({currentUser.name})
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-rose-950/60 text-rose-300 py-2.5 rounded-xl font-bold text-xs border border-rose-800/40"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-100 py-2.5 rounded-xl font-bold text-xs border border-emerald-300/60"
                  >
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-amber-400 text-emerald-950 py-2.5 rounded-xl font-bold text-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
}
