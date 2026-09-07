import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChatWidget from "@/components/AIChatWidget";
import Link from "next/link";
import Image from "next/image";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "THAMAR AI | ثَمر AI",
  description: "حل ذكي لتحليل المنتجات الغذائية وتحديد أفضل مسار دائري لها باستخدام الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-white text-secondary antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        
        {/* AIChatWidget will float on bottom right */}
        <AIChatWidget />

        <footer className="bg-[#041a12] text-gray-300 py-16 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <Image src="/logo.png" alt="THAMAR AI" width={150} height={50} className="mb-6 brightness-0 invert" />
                <p className="text-gray-400 max-w-sm leading-relaxed">
                  نصنع مستقبلاً مستداماً من خلال دمج التقنية المتقدمة بالزراعة والاقتصاد الدائري، لتقليل الهدر والحفاظ على الموارد للأجيال القادمة.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">روابط سريعة</h4>
                <ul className="space-y-4">
                  <li><Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link></li>
                  <li><Link href="/scanner" className="hover:text-gold transition-colors">الفحص الذكي</Link></li>
                  <li><Link href="/bio-wrap" className="hover:text-gold transition-colors">الأثر البيئي</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">الدعم القانوني</h4>
                <ul className="space-y-4">
                  <li><Link href="#" className="hover:text-gold transition-colors">الأسئلة الشائعة</Link></li>
                  <li><Link href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</Link></li>
                  <li><Link href="#" className="hover:text-gold transition-colors">شروط الاستخدام</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © THAMAR AI 2026. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Made in Saudi Arabia</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
