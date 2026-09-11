"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles, RefreshCw, Leaf } from "lucide-react";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'مرحباً بك! أنا مساعد منصة نواة (NAWAH AI Assistant) المتخصص في استغلال وتدوير نوى التمر في المملكة العربية السعودية. كيف يمكنني مساعدتك اليوم في تحليل الدفعات، مسارات التفحيم والاستخلاص، أو حسابات الأثر البيئي والاقتصادي؟'
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'assistant', text: data.reply || 'تم استلام استفسارك وتأكيده مع قاعدة بيانات نواة.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: 'أعتذر، حدث تعذر مؤقت في الاتصال بالمحرك. يرجى تجربة السؤال مرة أخرى.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              مساعد نواة الذكي للبحوث والاستشارات
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                Gemini AI
              </span>
            </h2>
            <p className="text-xs text-emerald-700/80 mt-0.5">
              مستشار خبير في مسارات التدوير، تفحيم الفحم المنشط، واستخلاص زيت النواة
            </p>
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES CONTAINER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl h-[500px] flex flex-col justify-between space-y-4">
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                m.sender === 'user' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950 font-semibold shadow-md'
                  : 'bg-white text-slate-100 border border-emerald-900 shadow'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 animate-pulse bg-white p-3 rounded-2xl border border-emerald-900 w-max">
              <Sparkles className="w-4 h-4 text-amber-400" />
              جاري توليد الإجابة الفنية...
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن مسارات تدوير النوى، متطلبات التفحيم، أو الاختبارات المطلوبة..."
            className="flex-1 bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-xs text-emerald-950 placeholder-emerald-500/50 focus:outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 p-3 rounded-2xl font-bold transition-all shadow-md shadow-amber-400/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
