"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/scanner", label: "الفحص الذكي" },
    { href: "/bio-wrap", label: "الغلاف الحيوي" },
    { href: "/insights", label: "الرؤى الذكية" },
    { href: "/dashboard", label: "لوحة التحكم" },
    { href: "/prediction", label: "توقع الصلاحية" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-2" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="THAMAR AI Logo" width={140} height={50} className="object-contain h-12 w-auto" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-bold transition-colors duration-200 ${
                  pathname === link.href 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : scrolled ? "text-secondary hover:text-primary" : "text-white hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className={`flex items-center gap-1 text-sm font-bold transition-colors ${scrolled ? 'text-secondary hover:text-primary' : 'text-white hover:text-gold'}`}>
              <Globe className="w-4 h-4" />
              العربية / EN
            </button>
            <div className={`h-6 w-px ${scrolled ? 'bg-gray-300' : 'bg-white/30'}`}></div>
            <button className={`text-sm font-bold transition-colors ${scrolled ? 'text-secondary hover:text-primary' : 'text-white hover:text-gold'}`}>
              تسجيل الدخول
            </button>
            <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20">
              إنشاء حساب
            </button>
          </div>

          <button 
            className={`lg:hidden ${scrolled ? 'text-secondary' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl px-4 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-bold ${
                pathname === link.href ? "text-primary" : "text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-100 my-2" />
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-2 text-secondary font-bold">
              <Globe className="w-5 h-5" /> العربية / English
            </button>
            <button className="text-secondary font-bold text-right">تسجيل الدخول</button>
            <button className="bg-primary text-white py-3 rounded-xl font-bold w-full">إنشاء حساب</button>
          </div>
        </div>
      )}
    </nav>
  );
}
