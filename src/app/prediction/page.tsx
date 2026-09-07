"use client";

import { useState } from "react";
import { Activity, Clock, Thermometer, Droplets, Calendar, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { day: 'يوم 1', quality: 100 },
  { day: 'يوم 2', quality: 95 },
  { day: 'يوم 3', quality: 88 },
  { day: 'يوم 4', quality: 75 },
  { day: 'يوم 5', quality: 60 },
  { day: 'يوم 6', quality: 40 },
  { day: 'يوم 7', quality: 20 },
];

export default function PredictionPage() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    // Simulate AI prediction
    setTimeout(() => {
      setIsPredicting(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4 flex items-center justify-center gap-3">
          <Activity className="w-10 h-10 text-primary" />
          توقع الصلاحية
        </h1>
        <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
          أدخل بيانات المنتج وظروف التخزين وسيقوم الذكاء الاصطناعي الخاص بنا بحساب العمر الافتراضي المتبقي بدقة.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-primary/10">
          <h2 className="text-2xl font-bold mb-6 text-secondary">البيانات المدخلة</h2>
          <form onSubmit={handlePredict} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-secondary mb-2">نوع المنتج</label>
              <div className="relative">
                <input required type="text" placeholder="مثال: طماطم، فراولة" className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-10" />
                <Package className="w-5 h-5 text-secondary/40 absolute top-3.5 right-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-2">تاريخ التعبئة</label>
                <div className="relative">
                  <input required type="date" className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-2">مدة التخزين (أيام)</label>
                <div className="relative">
                  <input required type="number" min="0" placeholder="0" className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-10" />
                  <Calendar className="w-5 h-5 text-secondary/40 absolute top-3.5 right-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-2">الحرارة (°C)</label>
                <div className="relative">
                  <input required type="number" placeholder="24" className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-10" />
                  <Thermometer className="w-5 h-5 text-secondary/40 absolute top-3.5 right-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-2">الرطوبة (%)</label>
                <div className="relative">
                  <input required type="number" placeholder="60" className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-10" />
                  <Droplets className="w-5 h-5 text-secondary/40 absolute top-3.5 right-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-2">نوع التغليف</label>
              <select className="w-full bg-beige-light border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                <option>غلاف ثَمر الحيوي (موصى به)</option>
                <option>بلاستيك تقليدي</option>
                <option>بدون تغليف</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isPredicting}
              className="w-full bg-primary text-white hover:bg-primary-dark disabled:opacity-50 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-4"
            >
              {isPredicting ? "جاري المعالجة..." : "حساب الصلاحية"}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7 space-y-6">
          {showResult ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary text-white p-6 rounded-3xl shadow-sm border border-primary/20 flex flex-col items-center justify-center text-center">
                  <p className="text-sm opacity-80 mb-1">العمر الافتراضي الكلي</p>
                  <p className="text-3xl font-bold">6 أيام</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/10 flex flex-col items-center justify-center text-center">
                  <Clock className="w-6 h-6 text-warning mb-2" />
                  <p className="text-sm text-secondary/60 mb-1">الوقت المتبقي</p>
                  <p className="text-2xl font-bold text-secondary">3 أيام</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/10 flex flex-col items-center justify-center text-center">
                  <Activity className="w-6 h-6 text-warning mb-2" />
                  <p className="text-sm text-secondary/60 mb-1">مستوى الخطر</p>
                  <p className="text-2xl font-bold text-warning">متوسط</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/10">
                <h3 className="text-xl font-bold text-secondary mb-6">منحنى الجودة الزمني</h3>
                <div className="h-[250px] w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="day" tick={{fontSize: 12}} />
                      <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="quality" stroke="#2a7a40" strokeWidth={3} dot={{r: 5, fill: "#2a7a40"}} activeDot={{r: 8}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/20 flex gap-4 items-start">
                <div className="bg-primary text-white p-3 rounded-full shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">تفسير الذكاء الاصطناعي:</h4>
                  <p className="text-secondary/80 leading-relaxed">
                    استناداً إلى درجة الحرارة المدخلة (24°C) ونوع التغليف الحيوي المختار، تم تمديد الصلاحية بنسبة 35% مقارنة بالتغليف التقليدي. ينصح بخفض درجة الحرارة إلى 15°C لزيادة العمر الافتراضي ليومين إضافيين.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/50 h-full min-h-[400px] rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-secondary/40">
              <Activity className="w-16 h-16 mb-4 opacity-30" />
              <p>قم بتعبئة البيانات لعرض التوقع الدقيق</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
