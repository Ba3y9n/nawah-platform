"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles, RefreshCw, Leaf, AlertCircle } from "lucide-react";

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'مرحباً بك! أنا مساعد نواة الذكي، مستشارك المباشر في المنصة الوطنية لإدارة وتدوير نوى التمر (NAWAH Platform). كيف يمكنني مساعدتك اليوم في تسجيل الدفعات، مسارات التفحيم والاستخلاص، أو فحص التحليل البصري لحساب الأثر البيئي؟'
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setErrorMsg("");

    const updatedMessages: Message[] = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build simple history for server action API
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بخدمة المساعد');
      }

      const data = await res.json();
      const replyText = data.reply || 'تم استلام استفسارك وتأكيده مع قاعدة بيانات نواة.';

      setMessages(prev => [...prev, { sender: 'assistant', text: replyText }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("تعذر تشغيل المساعد الآن، يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length > 1) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.text);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              مساعد نواة الذكي
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                AI Assistant
              </span>
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5">
              مستشار متخصص في استغلال نوى التمر، مسارات التفحيم والاستخلاص، والأدلة العلمية
            </p>
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES CONTAINER */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl h-[520px] flex flex-col justify-between space-y-4">
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                m.sender === 'user' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[82%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                  : 'bg-slate-50 text-emerald-950 border border-emerald-200 shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 animate-pulse bg-slate-50 p-3.5 rounded-2xl border border-emerald-200 w-max">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>مساعد نواة يفكر في الإجابة الفنية...</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={handleRetry}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-xl text-[11px] transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-emerald-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="اسأل مساعد نواة عن تسجيل الدفعات، مسارات الفحم والزيوت، أو الاختبارات المطلوب إجراؤها..."
            className="flex-1 bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-xs text-emerald-950 placeholder-emerald-700/50 focus:outline-none focus:border-amber-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 p-3.5 rounded-2xl font-bold transition-all shadow-md shadow-amber-400/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
