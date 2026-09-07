import { Lightbulb, TrendingUp, AlertCircle, BarChart3, ChevronLeft } from "lucide-react";

export default function InsightsPage() {
  const recommendations = [
    {
      id: 1,
      type: "alert",
      title: "تنبيه ارتفاع الحرارة",
      desc: "المنتجات المخزنة في درجات حرارة أعلى من 24 مئوية تظهر انخفاضاً أسرع في الجودة بنسبة 40%.",
      icon: <AlertCircle className="w-6 h-6 text-danger" />,
      color: "bg-red-50 border-red-100",
      textColor: "text-danger"
    },
    {
      id: 2,
      type: "action",
      title: "أولوية التوزيع",
      desc: "الدفعة رقم 24 من (الطماطم) يجب أن تعطى أولوية التوزيع خلال 48 ساعة لتقليل هدر محتمل بقيمة 2,400 ريال.",
      icon: <TrendingUp className="w-6 h-6 text-warning" />,
      color: "bg-orange-50 border-orange-100",
      textColor: "text-warning"
    },
    {
      id: 3,
      type: "insight",
      title: "تحليل كفاءة التغليف",
      desc: "أظهرت البيانات الحالية أن استخدام غلاف ثَمر الحيوي قد ساهم في إطالة عمر (الفراولة) بمقدار 3 أيام مقارنة بالتغليف السابق.",
      icon: <Lightbulb className="w-6 h-6 text-success" />,
      color: "bg-green-50 border-green-100",
      textColor: "text-success"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            الرؤى الذكية والتوصيات
          </h1>
          <p className="text-secondary/70 mt-2">تحليلات متقدمة وتوصيات مبنية على خوارزميات الذكاء الاصطناعي</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold text-secondary mb-4">التوصيات المباشرة</h2>
          
          {recommendations.map((rec) => (
            <div key={rec.id} className={`p-6 rounded-2xl border ${rec.color} shadow-sm flex gap-4 transition-transform hover:-translate-y-1`}>
              <div className="shrink-0 mt-1">
                {rec.icon}
              </div>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${rec.textColor}`}>{rec.title}</h3>
                <p className="text-secondary/80 leading-relaxed font-medium">{rec.desc}</p>
                <button className={`mt-4 flex items-center gap-1 text-sm font-bold ${rec.textColor} hover:opacity-70 transition-opacity`}>
                  عرض التفاصيل <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/10">
            <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              مؤشر الذكاء الاصطناعي
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary/70">دقة التوقعات</span>
                  <span className="font-bold text-primary">94%</span>
                </div>
                <div className="w-full bg-beige rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[94%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary/70">توفير الهدر الشهري</span>
                  <span className="font-bold text-success">+28%</span>
                </div>
                <div className="w-full bg-beige rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-[28%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-beige-light p-4 rounded-xl border border-black/5">
              <p className="text-xs text-secondary/60 leading-relaxed text-center">
                يتم تحديث هذه الرؤى لحظياً بناءً على تحليل الصور والبيانات البيئية عبر نماذج Gemini المتقدمة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
