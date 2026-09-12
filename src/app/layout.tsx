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

        <footer className="bg-emerald-950 text-emerald-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white">نواة | NAWAH</span>
                </div>
                <p className="text-xs text-emerald-200/80 max-w-sm leading-relaxed">
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
            
            <div className="border-t border-emerald-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-400/80">
              <p>
                © 2026 منصة نواة NAWAH. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-4 mt-2 md:mt-0">
                <span>رؤية المملكة 2030 | الاقتصاد الدائري</span>
              </div>
            </div>
          </div>
        </footer>

{/* 9. DEVELOPMENT TEAM */}
      <section className="pb-12 pt-4 bg-emerald-950">
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-12">
          <h2 className="text-2xl font-black text-emerald-950">فريق التطوير</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "بيان المطيري", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "آية السعدني", link: "https://www.linkedin.com/in/ayah-alsadany" },
              { name: "هبه عبداللطيف", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "حنين القصير", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
              { name: "وفاء المصري", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "د. نجوى الخطيب", link: null }
            ].map((m, i) => (
              m.link ? (
                <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-slate-50 border border-slate-100 hover:border-emerald-500 rounded-xl p-4 aspect-square flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm hover:shadow-md">
                  <span className="font-bold text-xs text-slate-700 group-hover:text-emerald-700 transition-colors">{m.name}</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">LinkedIn</span>
                </a>
              ) : (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 aspect-square flex flex-col items-center justify-center gap-2 shadow-sm cursor-default">
                  <span className="font-bold text-xs text-slate-700">{m.name}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
      </body>
    </html>
  );
}