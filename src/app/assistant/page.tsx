"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Bot, Send, User, Sparkles, RefreshCw, 
  Leaf, AlertCircle, Database, MapPin, 
  Flame, Coffee, Droplets, Trash2, ArrowLeft, ArrowUpRight,
  Factory
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const TOPICS = [
  {
    id: 'registration',
    label: 'تسجيل الدفعات',
    icon: Database,
    questions: [
      "كيف أسجل دفعة نوى جديدة في المنصة؟",
      "ما هي شروط مطابقة الدفعات لمعايير الجودة؟"
    ]
  },
  {
    id: 'industrial',
    label: 'الاستفادة الصناعية',
    icon: Factory,
    questions: [
      "ما هي مواصفات مسار الفحم المنشط من نوى التمر؟",
      "ما هي شروط إنتاج بديل القهوة الخالي من الكافيين؟"
    ]
  },
  {
    id: 'oil',
    label: 'زيت النوى',
    icon: Droplets,
    questions: [
      "كيف يتم استخلاص زيت نوى التمر ومجالات استخدامه؟",
      "ما هي الفوائد الصناعية لزيت النوى؟"
    ]
  },
  {
    id: 'environment',
    label: 'الأثر البيئي',
    icon: Leaf,
    questions: [
      "كيف تحسب منصة نواة تقليل انبعاثات الكربون؟",
      "كيف يعمل الفاحص البصري الذكي للنوى؟"
    ]
  }
];

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    let trimmed = line.trim();
    if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={lineIdx} className="font-bold text-sm mt-3 mb-1 text-slate-900">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={lineIdx} className="font-bold text-base mt-4 mb-2 text-slate-900">
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
          <strong key={pIdx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pr-1 my-1">
          <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0"></span>
          <span className="flex-1">{content}</span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="my-0.5">
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
      text: 'مرحباً، كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [activeTopicId, setActiveTopicId] = useState<string>(TOPICS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeTopic = TOPICS.find(t => t.id === activeTopicId) || TOPICS[0];
  const isChatEmpty = messages.length === 1 && messages[0].id.includes("welcome");

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
        text: 'مرحباً، كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveTopicId(TOPICS[0].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white font-sans text-slate-800" dir="rtl">
      
      {/* HEADER: Clean, minimalistic */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Bot size={16} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">مساعد نواة الذكي</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </button>
          <Link
            href="/pit-management/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
          >
            <span>لوحة التحكم</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth w-full relative"
      >
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-10 pb-32 min-h-full flex flex-col">
          
          {isChatEmpty ? (
            /* EMPTY STATE: INTERACTIVE KNOWLEDGE ORBIT */
            <div className="flex flex-col items-center w-full mt-4 sm:mt-10">
              
              {/* ORBIT COMPONENT */}
              <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] mb-12 flex items-center justify-center">
                
                {/* Track */}
                <div className="absolute inset-8 sm:inset-12 border border-slate-100 rounded-full" />
                
                {/* Orbiting Particle */}
                {!prefersReducedMotion && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 sm:inset-12 rounded-full pointer-events-none"
                  >
                    <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                )}

                {/* Central Hub */}
                <div className="relative z-10 flex flex-col items-center justify-center bg-white rounded-full w-28 h-28 sm:w-32 sm:h-32 border border-slate-100 shadow-sm">
                  <Bot className="w-8 h-8 text-emerald-600 mb-2" strokeWidth={1.5} />
                  <span className="text-[11px] font-bold text-slate-700">مساعد نواة</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    متصل الآن
                  </span>
                </div>

                {/* Orbit Nodes */}
                {TOPICS.map((topic, index) => {
                  const angle = (index * 90) - 90; 
                  const isActive = activeTopicId === topic.id;
                  
                  return (
                    <div 
                      key={topic.id}
                      className="absolute inset-0 pointer-events-none"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                        <button 
                          onClick={() => setActiveTopicId(topic.id)}
                          onMouseEnter={() => setActiveTopicId(topic.id)}
                          className="group relative flex flex-col items-center justify-center transition-transform duration-300 focus:outline-none"
                          style={{ transform: `rotate(${-angle}deg)` }}
                          aria-label={topic.label}
                        >
                          {/* Node Icon */}
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm scale-110' 
                              : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm'
                          }`}>
                            <topic.icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                          </div>
                          
                          {/* Node Label (positioned absolutely to always be readable) */}
                          <div className={`absolute whitespace-nowrap transition-all duration-300 ${
                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                          } ${
                            angle === 90 ? 'top-full mt-2' : 
                            angle === -90 ? 'bottom-full mb-2' :
                            angle === 0 ? 'top-full mt-2' : 'top-full mt-2'
                          }`}>
                            <span className="text-[11px] font-bold text-slate-700 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">
                              {topic.label}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Suggested Questions */}
              <div className="w-full max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTopicId}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-2"
                  >
                    {activeTopic.questions.map((q, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="group flex items-center justify-between text-right p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent focus:outline-none focus:border-slate-300"
                      >
                        <span className="text-sm text-slate-700 font-medium transition-colors group-hover:text-slate-900">{q}</span>
                        <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" strokeWidth={1.5} />
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          ) : (
            /* ACTIVE CHAT LIST */
            <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pt-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    {m.sender === 'user' ? <User className="w-4 h-4" strokeWidth={1.5} /> : <Bot className="w-4 h-4" strokeWidth={1.5} />}
                  </div>

                  <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div className={`px-5 py-3.5 text-sm leading-relaxed rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-slate-100 text-slate-900 rounded-tr-sm'
                        : 'bg-transparent text-slate-800'
                    }`}>
                      <div className="prose prose-sm max-w-none text-inherit">
                        {renderFormattedText(m.text)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-3.5">
                    <span className="flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    </span>
                    <span className="text-xs text-slate-400 font-medium">جاري إعداد الإجابة...</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    onClick={() => {
                      const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                      if (lastUser) handleSend(lastUser.text);
                    }}
                    className="text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-100 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MESSAGE INPUT COMPOSER */}
      <footer className="w-full bg-white border-t border-slate-100 shrink-0 z-20">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-end gap-3 bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] rounded-2xl p-2 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="اكتب سؤالك حول منظومة نواة..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 px-3 py-2.5 text-sm resize-none max-h-32 min-h-[44px] placeholder:text-slate-400 disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              <Send className="w-4 h-4 rtl:-translate-x-0.5" strokeWidth={2} />
            </button>
          </form>
          <div className="flex justify-center mt-3">
            <p className="text-[10px] text-slate-400 font-medium">
              يستخدم مساعد نواة تقنيات الذكاء الاصطناعي وقد يحتاج للتحقق من بعض المعلومات الدقيقة.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
