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
        <h4 key={lineIdx} className={`font-black text-sm mt-3 mb-1.5 ${isUser ? "text-white" : "text-emerald-400"}`}>
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={lineIdx} className={`font-black text-base mt-4 mb-2 ${isUser ? "text-white" : "text-emerald-400 border-b border-white/10 pb-1"}`}>
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
          <strong key={pIdx} className={`font-black ${isUser ? "text-white" : "text-emerald-300"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pr-2 my-1">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isUser ? "bg-white" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`}></span>
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col font-sans" dir="rtl">
      
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_80%)]" />
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowRight size={20} className="text-gray-400 hover:text-white" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Bot size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400">
                مساعد نواة الذكي
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                متصل ومتاح
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 px-3 py-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
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
                {/* Cinematic Glowing Orb */}
                <div className="relative mb-8 group">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] rounded-full border border-emerald-500/30 border-dashed opacity-50"
                  />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-700" />
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-gray-900 to-black border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                    <Sparkles className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                  مرحباً بك في نواة
                </h2>
                <p className="text-gray-400 max-w-lg mb-10 text-sm leading-relaxed">
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
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-emerald-900/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 text-right group"
                      >
                        <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                          <Icon size={18} />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
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
                      ? 'bg-gray-800/80 border-gray-700 text-gray-300' 
                      : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  }`}>
                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={22} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative max-w-[85%] sm:max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-bl from-gray-800 to-gray-900 border border-gray-700 text-gray-100 rounded-tr-sm shadow-lg'
                      : 'bg-gradient-to-br from-emerald-950/30 to-black border border-emerald-900/60 text-gray-300 rounded-tl-sm backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      {renderFormattedText(msg.text, msg.sender === 'user')}
                    </div>
                    <div className={`text-[10px] mt-3 font-mono opacity-50 ${
                      msg.sender === 'user' ? 'text-left' : 'text-right'
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
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <Bot size={22} />
              </div>
              <div className="px-6 py-5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-emerald-950/30 to-black border border-emerald-900/60 backdrop-blur-md flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-emerald-400/80 text-xs font-medium">مساعد نواة يقوم بتحليل الاستفسار...</span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between gap-3 bg-rose-950/30 border border-rose-900/50 text-rose-400 p-4 rounded-2xl text-xs backdrop-blur-sm mx-auto max-w-2xl w-full"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => {
                  const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                  if (lastUser) handleSend(lastUser.text);
                }}
                className="bg-rose-900/50 hover:bg-rose-800/80 text-rose-200 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                إعادة المحاولة
              </button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area (Floating Cinematic) */}
      <div className="relative z-10 px-4 pb-6 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {/* Animated Glow Border on Focus */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 focus-within:border-emerald-500/50 rounded-2xl px-2 py-2 backdrop-blur-xl transition-all shadow-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="اسأل مساعد نواة عن الدفعات، الفاحص الذكي، مسارات الفحم والزيوت، أو الأثر الكربوني..."
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 text-sm sm:text-base placeholder:text-gray-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none"
            >
              <Send size={20} className="rtl:rotate-180" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-gray-600 font-medium tracking-wide">
              مدعوم بالذكاء الاصطناعي لمنصة نواة الوطنية • قد يرتكب الذكاء الاصطناعي أخطاء، يرجى التحقق
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
