"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Menu, X, Layers, MapPin, BookOpen, 
  Bot, User, Info, LogIn, UserPlus, ChevronDown, LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(pathname);
  if (isAuthRoute) return null;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [pitDropdown, setPitDropdown] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; name: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function loadUserSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'المستخدم';
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: displayName
        });
      } else {
        setCurrentUser(null);
      }
    }

    loadUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserSession();
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isPitManagementActive = pathname.startsWith('/pit-management');

  const pitSubMenu = [
    { href: "/pit-management/dashboard", label: "نظرة عامة", desc: "المؤشرات الحية" },
    { href: "/pit-management/batches", label: "دفعات النوى", desc: "سجل الدفعات" },
    { href: "/pit-management/scanner", label: "التحليل", desc: "الرؤية الحاسوبية" },
    { href: "/pit-management/pathways", label: "الاستخدامات", desc: "مسارات الاستفادة" },
    { href: "/pit-management/experiments", label: "التجارب", desc: "سجل التجارب" },
    { href: "/pit-management/impact", label: "الأثر", desc: "بصمة الكربون" },
  ];

  const mainLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/map", label: "الخريطة الذكية" },
    { href: "/evidence", label: "الأدلة والمصادر" },
    { href: "/assistant", label: "مساعد نواة" },
    { href: "/about", label: "عن نواة" },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserDropdown(false);
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300" dir="rtl">
      <nav className={`w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3" 
          : "bg-white py-4 border-b border-slate-100"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* BRAND LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/nawah-logo.png" 
                alt="نواة | NAWAH" 
                width={120} 
                height={48} 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
            
            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden xl:flex items-center gap-2">
              
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-800" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* DROPDOWN MENU: إدارة النوى */}
              <div 
                className="relative"
                onMouseEnter={() => setPitDropdown(true)}
                onMouseLeave={() => setPitDropdown(false)}
              >
                <Link
                  href="/pit-management/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isPitManagementActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  }`}
                >
                  <span>إدارة النوى</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pitDropdown ? 'rotate-180' : ''}`} />
                </Link>

                {pitDropdown && (
                  <div className="absolute top-full right-0 w-56 pt-2 z-50">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-2 backdrop-blur-xl">
                      {pitSubMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPitDropdown(false)}
                          className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                            pathname === item.href
                              ? "bg-emerald-50 text-emerald-800 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LANGUAGE & AUTH */}
            <div className="hidden xl:flex items-center gap-3">
              
              {/* LANGUAGE SWITCHER */}
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors px-2 py-1 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-200">
                <span>EN</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-800">عربي</span>
              </button>
              
              <div className="h-5 w-px bg-slate-200 mx-1"></div>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-bold text-slate-700 hover:border-emerald-500 transition-all shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0) : 'ن'}
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdown && (
                    <div className="absolute top-full left-0 w-56 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                      <div className="px-3 py-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-right px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-xl transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button 
              className="xl:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        {isOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-6 mt-3 space-y-4">
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                إدارة النوى
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pitSubMenu.map(sub => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold ${
                      pathname === sub.href ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {mainLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold ${
                      pathname === link.href ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <hr className="border-slate-100 my-4" />

            <div className="flex flex-col gap-3">
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3 rounded-xl font-bold text-sm"
                  >
                    <User className="w-4 h-4" />
                    الملف الشخصي ({currentUser.name})
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-rose-50 text-rose-700 py-3 rounded-xl font-bold text-sm border border-rose-100"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm border border-slate-200"
                  >
                    <LogIn className="w-4 h-4" />
                    دخول
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    حساب جديد
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
