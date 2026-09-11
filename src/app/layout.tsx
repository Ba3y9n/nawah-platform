import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChatWidget from "@/components/AIChatWidget";
import Link from "next/link";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "نواة | NAWAH Platform - المنصة الوطنية لتتبع وتدوير نوى التمر",
  description: "منظومة رقمية حقيقية لإدارة وتتبع نوى التمر وتطبيقات الاقتصاد الدائري في المملكة العربية السعودية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-white text-slate-100 antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Floating AI Assistant Widget */}
        <AIChatWidget />

        <footer className="bg-emerald-50 border-t border-emerald-200/60 text-slate-600 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-emerald-950">نواة | NAWAH</span>
                </div>
                <p className="text-xs text-emerald-700/80 max-w-sm leading-relaxed">
                  نصنع حلاً وطنياً مستداماً لتدوير واستغلال نوى التمر في المملكة العربية السعودية بدمج تقنيات الذكاء الاصطناعي مع سلاسل الإمداد وقواعد البيانات الحقيقية.
                </p>
              </div>
              
              <div>
                <h4 className="text-amber-400 font-bold mb-4 text-xs uppercase tracking-wider">منظومة إدارة النوى</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/pit-management/dashboard" className="hover:text-amber-300 transition-colors">نظرة عامة (لوحة التحكم)</Link></li>
                  <li><Link href="/pit-management/batches" className="hover:text-amber-300 transition-colors">دفعات النوى والـ QR</Link></li>
                  <li><Link href="/pit-management/scanner" className="hover:text-amber-300 transition-colors">تحليل النواة البصري</Link></li>
                  <li><Link href="/pit-management/pathways" className="hover:text-amber-300 transition-colors">مسارات الاستخدامات</Link></li>
                  <li><Link href="/pit-management/experiments" className="hover:text-amber-300 transition-colors">سجل التجارب</Link></li>
                  <li><Link href="/pit-management/impact" className="hover:text-amber-300 transition-colors">مؤشرات الأثر</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-amber-400 font-bold mb-4 text-xs uppercase tracking-wider">روابط الوصول</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/map" className="hover:text-amber-300 transition-colors">الخريطة الذكية</Link></li>
                  <li><Link href="/evidence" className="hover:text-amber-300 transition-colors">المصادر والأدلة</Link></li>
                  <li><Link href="/assistant" className="hover:text-amber-300 transition-colors">مساعد نواة الذكي</Link></li>
                  <li><Link href="/profile" className="hover:text-amber-300 transition-colors">الحساب الشخصي</Link></li>
                  <li><Link href="/about" className="hover:text-amber-300 transition-colors">عن نواة</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-emerald-200/60 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-600/80">
              <p>
                © 2026 منصة نواة NAWAH. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-4 mt-2 md:mt-0">
                <span>رؤية المملكة 2030 | الاقتصاد الدائري</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
