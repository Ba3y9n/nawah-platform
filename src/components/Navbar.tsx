"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/scanner", label: "فحص الذكاء الاصطناعي" },
    { href: "/prediction", label: "توقع الصلاحية" },
    { href: "/dashboard", label: "لوحة التحكم" },
    { href: "/bio-wrap", label: "الغلاف الحيوي" },
    { href: "/insights", label: "الرؤى الذكية" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary leading-none">ثَمر AI</h1>
              <p className="text-xs text-primary font-semibold tracking-wider">THAMAR</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  pathname === link.href ? "text-primary border-b-2 border-primary pb-1" : "text-secondary/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button 
            className="md:hidden text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-primary/10 px-4 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-semibold ${
                pathname === link.href ? "text-primary" : "text-secondary/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
