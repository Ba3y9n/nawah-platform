"use client";

import { Bot, MessageSquare, Sparkles, ArrowLeft, ShieldCheck, Database } from "lucide-react";

export default function AssistantPage() {
  const handleOpenChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nawah:open-chat"));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8" dir="rtl">
      
      {/* HEADER BANNER */}
      <div className="bg-emerald-950 text-white border border-emerald-900 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 text-center md:text-right">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 border border-emerald-700 text-amber-400 flex items-center justify-center font-black shadow-lg shrink-0 mx-auto md:mx-0">
            <Bot className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>المساعد الرسمي للمنصة</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">مساعد نواة</h1>
            <p className="text-xs md:text-sm text-emerald-200/80 mt-1 max-w-xl leading-relaxed">
              مساعد ذكي متخصص في استكشاف نوى التمر، مسارات الاستفادة، التجارب المخبرية، والأدلة الموثقة.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenChat}
          className="relative z-10 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-950/40 hover:-translate-y-0.5 shrink-0"
        >
          <MessageSquare className="w-5 h-5 text-amber-300" />
          <span>ابدأ المحادثة</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* CAPABILITIES & INFORMATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-emerald-950">إدارة الدفعات وتتبعها</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            استفسر عن آليات تسجيل الدفعات برمز NW والمطابقة مع المصادر والكميات المخزنة في المنصة.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-emerald-950">استكشاف المسارات</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            تعرف على تطبيقات الفحم المنشط، استخلاص الزيوت، بدائل القهوة، ومستحضرات التجميل.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-emerald-950">الأدلة والتجارب المعملية</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            تمييز دقيق بين الاستخدامات القائمة على أبحاث مثبتة والتطبيقات التجريبية المفتوحة.
          </p>
        </div>
      </div>

      {/* CTA FOOTER BANNER */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
        <h2 className="text-lg font-black text-emerald-950">هل لديك استفسار محدد حول نوى التمر؟</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          انقر على زر المحادثة لفتح واجهة دردشة "مساعد نواة" الموحدة على يمين الشاشة.
        </p>
        <button
          onClick={handleOpenChat}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-3 rounded-2xl text-xs transition-all shadow-md"
        >
          <span>فتح مساعد نواة</span>
          <MessageSquare className="w-4 h-4 text-amber-300" />
        </button>
      </div>

    </div>
  );
}
