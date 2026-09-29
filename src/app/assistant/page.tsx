"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, Sparkles, RefreshCw, 
  Leaf, AlertCircle, Database, MapPin, 
  Flame, Coffee, Droplets, Trash2, ArrowLeft, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { icon: Database, text: "كيف أسجل دفعة نوى جديدة في المنصة؟" },
  { icon: Flame, text: "ما هي مواصفات مسار الفحم المنشط من نوى التمر؟" },
  { icon: Droplets, text: "كيف يتم استخلاص زيت نوى التمر ومجالات استخدامه؟" },
  { icon: Coffee, text: "ما هي شروط إنتاج بديل القهوة الخالي من الكافيين؟" },
  { icon: Sparkles, text: "كيف يعمل الفاحص البصري الذكي للنوى؟" },
  { icon: Leaf, text: "كيف تحسب منصة نواة تقليل انبعاثات الكربون والأثر البيئي؟" }
];

function renderFormattedText(text: string, isUser: boolean) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    let trimmed = line.trim();
    if (!trimmed) return <div key={lineIdx} className="h-2" />;

    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={lineIdx} className={`font-black text-sm mt-3 mb-1.5 ${isUser ? "text-white" : "text-emerald-950"}`}>
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={lineIdx} className={`font-black text-base mt-4 mb-2 ${isUser ? "text-white" : "text-emerald-950 border-b border-slate-100 pb-1"}`}>
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
    }

    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
    if (isBullet) {
      trimmed = trimmed.replace(/^[\*\-•]\s+/, "");
    }

    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className={`font-black ${isUser ? "text-white" : "text-emerald-800"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pr-2 my-1">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isUser ? "bg-white" : "bg-emerald-500"}`}></span>
          <span className="flex-1">{content}</span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="my-1">
        {content}
      </p>
    );
  });
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: 'assistant',
      text: 'مرحباً بك! أنا مساعد نواة الذكي، المستشار المباشر لمنظومة (نواة | NAWAH) لتتبع وإعادة تدوير نوى التمر وتطبيقات الاقتصاد الدائري بالمملكة العربية السعودية.\n\nكيف يمكنني إرشادك اليوم في تسجيل الدفعات، مسارات الاستفادة الصناعية (الفحم، الزيوت، القهوة)، أو استعراض الخريطة الذكية وسجل الأثر؟',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    setInput("");
    setErrorMsg("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بخدمة المساعد');
      }

      const data = await res.json();
      const replyText = data.reply || 'تم استلام استفسارك وتأكيده مع قاعدة بيانات نواة.';

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("تعذر التواصل مع المساعد حالياً، يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: 'assistant',
        text: 'أهلاً بك مجدداً في مساعد نواة الذكي! جاهز للإجابة عن أي استفسار حول نوى التمر وتطبيقات المنصة.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const isChatEmpty = messages.length === 1 && messages[0].id.includes("welcome");

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-10 px-4 sm:px-6 flex flex-col items-center" dir="rtl">
      
      {/* BEAUTIFUL FLOATING CARD LAYOUT */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col h-[750px] max-h-[85vh]">
        
        {/* HEADER INSIDE THE CARD */}
        <header className="flex items-center justify-between px-6 sm:px-8 py-5 bg-white border-b border-slate-100 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border border-dashed border-emerald-300 opacity-50"
              />
              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black shadow-md">
                <Bot className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-lg">مساعد نواة الذكي</h1>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                متصل ومتاح
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-4 py-2.5 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">محادثة جديدة</span>
            </button>
            <Link
              href="/pit-management/dashboard"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors group"
            >
              <span>لوحة التحكم</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* MAIN SCROLLABLE AREA INSIDE THE CARD */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/30 p-6 sm:p-10 relative z-10"
        >
          <AnimatePresence mode="wait">
            {isChatEmpty ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center pt-8 pb-12 w-full max-w-2xl mx-auto"
              >
                {/* LARGE INTERACTIVE ANIMATED RING (Light Theme) */}
                <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-10px] rounded-full border-2 border-emerald-300 border-dashed opacity-60"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-emerald-100 blur-xl opacity-60"
                  />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-2xl shadow-emerald-700/30">
                    <Sparkles className="w-10 h-10" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  كيف يمكنني مساعدتك اليوم؟
                </h2>
                <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium">
                  أنا المستشار المباشر لمنظومة نواة. اسألني عن تسجيل الدفعات، مسارات الاستفادة الصناعية، الخريطة الذكية، أو سجل الأثر البيئي.
                </p>

                {/* INTERACTIVE QUICK PROMPTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {QUICK_PROMPTS.map((prompt, idx) => {
                    const Icon = prompt.icon;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        onClick={() => handleSend(prompt.text)}
                        className="group relative flex items-center justify-between text-right p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 z-10">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-emerald-900 transition-colors">
                            {prompt.text}
                          </span>
                        </div>
                        {/* Interactive Arrow */}
                        <div className="z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-emerald-600 shrink-0">
                          <ArrowUpRight className="w-5 h-5 rtl:-scale-x-100" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chat-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6 w-full max-w-3xl mx-auto"
              >
                {messages.map((m) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={m.id}
                    className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-sm border ${
                      m.sender === 'user' 
                        ? 'bg-emerald-700 text-white border-emerald-800' 
                        : 'bg-white text-emerald-700 border-emerald-200'
                    }`}>
                      {m.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                    </div>

                    <div className={`p-5 rounded-3xl max-w-[85%] sm:max-w-[80%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-sm shadow-md font-medium'
                        : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200 shadow-sm'
                    }`}>
                      <div className="prose prose-sm max-w-none text-inherit">
                        {renderFormattedText(m.text, m.sender === 'user')}
                      </div>
                      <div className={`text-[10px] mt-3 font-mono opacity-60 ${
                        m.sender === 'user' ? 'text-left text-emerald-100' : 'text-right text-slate-500'
                      }`}>
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-600 shadow-sm flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="px-5 py-4 rounded-3xl rounded-tl-sm bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-slate-600 text-sm font-medium">يقوم المساعد بتحليل البيانات...</span>
                    </div>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                    <button
                      onClick={() => {
                        const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                        if (lastUser) handleSend(lastUser.text);
                      }}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      إعادة المحاولة
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* INPUT FORM AT BOTTOM OF CARD */}
        <div className="p-6 bg-white border-t border-slate-100 shrink-0 z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-emerald-400 focus-within:ring-4 ring-emerald-500/10 transition-all max-w-3xl mx-auto w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="اسأل مساعد نواة عن الخريطة الذكية، مسارات الاستفادة، أو سجل الأثر..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 px-4 py-2 text-sm font-medium placeholder:text-slate-400 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="group bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0 transition-all shadow-md shadow-emerald-600/20 disabled:shadow-none overflow-hidden relative"
            >
              <span className="hidden sm:inline text-sm z-10 relative">إرسال</span>
              <Send className="w-4 h-4 rtl:rotate-180 z-10 relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-3 font-bold">
            مساعد نواة الذكي • قد يقدم الذكاء الاصطناعي معلومات غير دقيقة أحياناً
          </p>
        </div>

      </div>
    </div>
  );
}
