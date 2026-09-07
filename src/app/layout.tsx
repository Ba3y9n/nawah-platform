import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "THAMAR AI | ثَمر AI",
  description: "نحفظ الغذاء، ونحوّل المخلفات إلى قيمة - تغليف حيوي ذكي من مخلفات النخيل مدعوم بالذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-beige-light text-secondary antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-secondary text-white py-8 mt-12 text-center">
          <div className="container mx-auto px-4">
            <p className="text-lg font-bold mb-2">THAMAR AI | ثَمر AI</p>
            <p className="opacity-75">ابتكار من أجل استدامة بيئية وأمن غذائي</p>
            <p className="mt-4 text-sm opacity-50">© 2026 جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
