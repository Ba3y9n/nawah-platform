"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, Sparkles, RefreshCw, 
  Leaf, AlertCircle, Database, MapPin, 
  Flame, Coffee, Droplets, Trash2, ArrowLeft, ArrowRight
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

    // Headers (### or ##)
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={lineIdx} className={`font-black text-sm mt-3 mb-1.5 ${isUser ? "text-white" : "text-emerald-800"}`}>
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={lineIdx} className={`font-black text-base mt-4 mb-2 ${isUser ? "text-white" : "text-emerald-800 border-b border-emerald-100 pb-1"}`}>
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
    }

    // Bullet points (* or - or •)
    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
    if (isBullet) {
      trimmed = trimmed.replace(/^[\*\-•]\s+/, "");
    }

    // Inline bold formatting (**text**)
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className={`font-black ${isUser ? "text-emerald-100" : "text-emerald-700"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pr-2 my-1">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isUser ? "bg-white" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"}`}></span>
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
      text: 'مرحباً بك! أنا «مساعد نواة الذكي» 🌴🤖 المستشار المباشر لمنظومة (نواة | NAWAH) لتتبع وإعادة تدوير نوى التمر وتطبيقات الاقتصاد الدائري بالمملكة العربية السعودية.\n\nكيف يمكنني إرشادك اليوم في تسجيل الدفعات، مسارات الاستفادة الصناعية (الفحم، الزيوت، القهوة)، أو استعراض الخريطة الذكية وسجل الأثر؟',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-sans" dir="rtl">
      
      {/* Background Cinematic Effects (Light Mode) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/40 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(248,250,252,1)_80%)]" />
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowRight size={20} className="text-slate-500 hover:text-slate-900" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Bot size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide text-slate-800">
                مساعد نواة الذكي
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                متصل ومتاح
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
          title="محادثة جديدة"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">محادثة جديدة</span>
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          
          <AnimatePresence>
            {messages.length === 1 && messages[0].id.includes("welcome") ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center justify-center h-[60vh] text-center"
              >
                {/* Cinematic Glowing Orb - Light Mode */}
                <div className="relative mb-8 group">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] rounded-full border border-emerald-500/30 border-dashed opacity-50"
                  />
                  <div className="absolute inset-0 bg-emerald-200 blur-2xl rounded-full group-hover:bg-emerald-300 transition-all duration-700" />
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-white to-emerald-50 border border-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900">
                  مرحباً بك في نواة
                </h2>
                <p className="text-slate-500 max-w-lg mb-10 text-sm leading-relaxed font-medium">
                  أنا مساعدك الذكي المدمج 🌴🤖 يمكنك سؤالي عن تسجيل الدفعات، مسارات الاستفادة الصناعية، الخريطة الذكية، أو سجل الأثر البيئي.
                </p>

                {/* Quick Prompts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
                  {QUICK_PROMPTS.map((prompt, idx) => {
                    const Icon = prompt.icon;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        onClick={() => handleSend(prompt.text)}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] transition-all duration-300 text-right group shadow-sm"
                      >
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:border-emerald-200 transition-all">
                          <Icon size={18} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-emerald-900 transition-colors">
                          {prompt.text}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-700 border-emerald-800 text-white shadow-md' 
                      : 'bg-white border-emerald-200 text-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.1)]'
                  }`}>
                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={22} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative max-w-[85%] sm:max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 border border-emerald-800 text-white rounded-tr-sm shadow-md font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                  }`}>
                    <div className="prose prose-sm max-w-none text-inherit">
                      {renderFormattedText(msg.text, msg.sender === 'user')}
                    </div>
                    <div className={`text-[10px] mt-3 font-mono ${
                      msg.sender === 'user' ? 'text-emerald-200 text-left' : 'text-slate-400 text-right'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-emerald-200 text-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.1)]">
                <Bot size={22} />
              </div>
              <div className="px-6 py-5 rounded-2xl rounded-tl-sm bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-emerald-700 text-xs font-bold">مساعد نواة يقوم بتحليل الاستفسار وتجهيز الإجابة المعتمدة...</span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs mx-auto max-w-2xl w-full"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
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

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area (Floating Cinematic Light Mode) */}
      <div className="relative z-10 px-4 pb-6 pt-4 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {/* Animated Glow Border on Focus */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center bg-white border border-slate-200 hover:border-emerald-300 focus-within:border-emerald-500 rounded-2xl px-2 py-2 transition-all shadow-lg shadow-slate-200/50 focus-within:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="اسأل مساعد نواة عن الدفعات، الفاحص الذكي، مسارات الفحم والزيوت، أو الأثر الكربوني..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 px-4 py-2 text-sm sm:text-base placeholder:text-slate-400 disabled:opacity-50 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-md shadow-emerald-600/20 disabled:shadow-none"
            >
              <Send size={20} className="rtl:rotate-180" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-400 font-bold tracking-wide">
              مدعوم بالذكاء الاصطناعي لمنصة نواة الوطنية • قد يرتكب الذكاء الاصطناعي أخطاء، يرجى التحقق
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
