"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
        <h3 key={lineIdx} className={`font-black text-base mt-4 mb-2 ${isUser ? "text-white" : "text-emerald-950 border-b border-slate-200 pb-1"}`}>
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
          <strong key={pIdx} className={`font-black ${isUser ? "text-white" : "text-emerald-950"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pr-2 my-1">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isUser ? "bg-white" : "bg-emerald-600"}`}></span>
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
      text: 'مرحباً بك! أنا «مساعد نواة الذكي» المستشار المباشر لمنظومة (نواة | NAWAH) لتتبع وإعادة تدوير نوى التمر وتطبيقات الاقتصاد الدائري بالمملكة العربية السعودية.\n\nكيف يمكنني إرشادك اليوم في تسجيل الدفعات، مسارات الاستفادة الصناعية (الفحم، الزيوت، القهوة)، أو استعراض الخريطة الذكية وسجل الأثر؟',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Use a ref for the scrollable container itself, NOT a dummy element at the end
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

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 py-4 px-4 sm:px-6 flex flex-col" dir="rtl">
      <div className="container mx-auto max-w-5xl flex-1 flex flex-col space-y-4 overflow-hidden">
        
        {/* HEADER CARD */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            
            {/* Interactive Animated Ring around Bot Icon */}
            <div className="relative flex items-center justify-center w-14 h-14">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 border-dashed"
              />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 rounded-xl bg-emerald-100/50"
              />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black shadow-md shadow-emerald-700/20">
                <Bot className="w-6 h-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  مساعد نواة الذكي
                </h1>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                  AI Assistant
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  متصل ومتاح
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                مستشارك الفني الذكي في إدارة وتدوير نوى التمر، مسارات الاستفادة الصناعية، واللوائح البيئية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 border border-slate-200 transition-colors"
              title="بدء محادثة جديدة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
            <Link
              href="/pit-management/dashboard"
              className="group flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-colors"
            >
              <span>لوحة التحكم</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* QUICK SUGGESTIONS BADGES */}
        <div className="space-y-2 shrink-0">
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            أسئلة مقترحة للبدء السريع:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  disabled={loading}
                  className="group relative flex items-center justify-between text-right p-3 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-700 hover:text-emerald-900 transition-all shadow-xs disabled:opacity-50 overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 z-10">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate max-w-[200px]">{prompt.text}</span>
                  </div>
                  {/* Interactive Arrow on Hover */}
                  <div className="z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-emerald-600 shrink-0">
                    <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                  </div>
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/30 to-emerald-100/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT MESSAGES CONTAINER */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm flex-1 flex flex-col justify-between overflow-hidden min-h-0 relative">
          
          {/* MESSAGES LIST (Custom Scroll Logic applied directly to this container) */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
          >
            {messages.map((m) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={m.id}
                className={`flex items-start gap-3 text-xs sm:text-sm ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* AVATAR */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
                  m.sender === 'user' 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* MESSAGE BUBBLE */}
                <div className={`p-4 rounded-3xl max-w-[85%] sm:max-w-[78%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs font-medium'
                    : 'bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-xs'
                }`}>
                  <div className="prose prose-sm max-w-none text-inherit space-y-2 leading-relaxed">
                    {renderFormattedText(m.text, m.sender === 'user')}
                  </div>
                  <div className={`text-[10px] mt-2 font-mono ${
                    m.sender === 'user' ? 'text-emerald-200 text-left' : 'text-slate-400 text-right'
                  }`}>
                    {m.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-xs text-emerald-800 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 w-max"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>مساعد نواة يقوم بتحليل الاستفسار وتجهيز الإجابة المعتمدة...</span>
              </motion.div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => {
                    const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                    if (lastUser) handleSend(lastUser.text);
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  إعادة المحاولة
                </button>
              </div>
            )}
          </div>

          {/* INPUT FORM */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="اسأل مساعد نواة عن الدفعات، الفاحص الذكي، مسارات الفحم والزيوت، أو أثر الكربون..."
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 transition-all shadow-xs"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="group bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 sm:px-6 sm:py-3.5 rounded-2xl font-bold transition-all shadow-sm shadow-emerald-700/20 disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer overflow-hidden relative"
              >
                <span className="hidden sm:inline text-xs font-bold z-10 relative">إرسال</span>
                <Send className="w-4 h-4 rtl:rotate-180 z-10 relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              مدعوم بالذكاء الاصطناعي لمنصة نواة الوطنية • متوافق مع مستهدفات الاستدامة والاقتصاد الدائري
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
