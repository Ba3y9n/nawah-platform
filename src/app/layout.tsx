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

        <footer className="bg-emerald-950 pt-20 pb-10 relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              
              <div className="space-y-6">
                <span className="text-2xl font-black text-white tracking-tight">نواة | NAWAH</span>
                <p className="text-base text-emerald-100/70 leading-relaxed font-medium">
                  منصة رقمية لتحويل نوى التمر إلى بيانات ومعرفة وفرص قابلة للتطبيق.
                </p>
              </div>

              <div className="md:mx-auto">
                <h4 className="text-sm font-black text-white mb-8 uppercase tracking-widest border-b-2 border-white/10 pb-2 inline-block">المنصة</h4>
                <ul className="space-y-4">
                  <li><Link href="/pit-management/batches" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">إدارة الدفعات</Link></li>
                  <li><Link href="/map" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">الخريطة الذكية</Link></li>
                  <li><Link href="/evidence" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">الأدلة والمصادر</Link></li>
                  <li><Link href="/pit-management/experiments" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">التجارب</Link></li>
                  <li><Link href="/pit-management/impact" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">قياس الأثر</Link></li>
                </ul>
              </div>

              <div className="md:mx-auto">
                <h4 className="text-sm font-black text-white mb-8 uppercase tracking-widest border-b-2 border-white/10 pb-2 inline-block">عن نواة</h4>
                <ul className="space-y-4">
                  <li><Link href="/about" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">عن المنصة</Link></li>
                  <li><Link href="/#how-it-works" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">كيف تعمل نواة؟</Link></li>
                  <li><Link href="/#features" className="text-sm text-emerald-100/60 hover:text-white transition-all font-bold hover:translate-x-[-4px] inline-block">مميزات نواة</Link></li>
                </ul>
              </div>

            </div>
            
            <div className="border-t border-white/5 mt-16 pt-8 text-center">
              <p className="text-sm text-emerald-500/50 font-bold">
                © 2026 نواة | NAWAH — جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>

        {/* 9. DEVELOPMENT TEAM - Integrated Dark Theme Layout */}
        <section className="pb-24 pt-12 bg-emerald-950 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl text-center space-y-12 relative z-10">
            
            <div className="space-y-4">
               <h2 className="text-xs font-black text-white/40 tracking-[0.3em] uppercase">فريق التطوير</h2>
               <div className="w-12 h-1 bg-white/10 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {[
                { name: "بيان المطيري", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "آية السعدني", link: "https://www.linkedin.com/in/ayah-alsadany" },
                { name: "هبه عبداللطيف", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "حنين القصير", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
                { name: "وفاء المصري", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "د. نجوى الخطيب", link: null }
              ].map((m, i) => (
                m.link ? (
                  <a 
                    key={i} 
                    href={m.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-white group-hover:text-emerald-950 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </div>
                    <span className="font-bold text-xs text-emerald-50/80 group-hover:text-white transition-colors text-center leading-tight">{m.name}</span>
                  </a>
                ) : (
                  <div 
                    key={i} 
                    className="bg-white/5 border border-transparent rounded-2xl p-5 flex flex-col items-center justify-center gap-4 cursor-default"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 text-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <span className="font-bold text-xs text-white/30 text-center leading-tight">{m.name}</span>
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