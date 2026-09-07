import Link from "next/link";
import { ArrowLeft, Leaf, ScanLine, ShieldCheck, TrendingDown, Recycle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beige to-white -z-10" />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 -z-10" />
        
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 font-semibold">
            <Leaf className="w-4 h-4" />
            <span>الابتكار البيئي للمستقبل</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-secondary leading-tight">
            نحفظ الغذاء، ونحوّل <span className="text-primary">المخلفات</span> إلى قيمة
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary/80 mb-10 leading-relaxed">
            ثَمر AI يحوّل مخلفات النخيل إلى غلاف حيوي ذكي مدعوم بالذكاء الاصطناعي لتقليل هدر الخضار والفواكه.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scanner" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
              <ScanLine className="w-5 h-5" />
              جرب الفحص الذكي
            </Link>
            <Link href="/bio-wrap" className="bg-white text-primary border-2 border-primary/20 hover:border-primary px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Recycle className="w-5 h-5" />
              اكتشف الغلاف الحيوي
            </Link>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-danger flex items-center gap-3">
                <TrendingDown className="w-8 h-8" />
                المشكلة: الهدر الغذائي
              </h2>
              <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                تتلف الخضروات والفواكه بسرعة هائلة، ويحدث الهدر بسبب عدة عوامل رئيسية:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "التقلبات في درجات الحرارة",
                  "مستويات الرطوبة غير المناسبة",
                  "ظروف التخزين والنقل",
                  "النمو البكتيري والميكروبي",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary/90 font-medium bg-beige/50 p-3 rounded-lg border border-beige-light">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-10 rounded-3xl border border-primary/20">
              <h2 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
                <ShieldCheck className="w-8 h-8" />
                الحل: ثَمر AI
              </h2>
              <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                غلاف حيوي قابل للتحلل، مستخلص من ألياف مخلفات النخيل، يعمل بتناغم مع تحليل الذكاء الاصطناعي لضمان الجودة وإطالة فترة الصلاحية.
              </p>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                <h3 className="font-bold text-xl mb-4">مميزات الحل:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2"><Leaf className="w-5 h-5 text-primary shrink-0" /> <span className="text-sm">مواد مستدامة 100% من سعف النخيل</span></li>
                  <li className="flex items-start gap-2"><ScanLine className="w-5 h-5 text-primary shrink-0" /> <span className="text-sm">تحليل دقيق عبر الرؤية الحاسوبية (Gemini Vision)</span></li>
                  <li className="flex items-start gap-2"><Recycle className="w-5 h-5 text-primary shrink-0" /> <span className="text-sm">دعم الاقتصاد الدائري في المملكة</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Economy Flow */}
      <section className="py-24 bg-beige-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16 text-secondary">دورة الاقتصاد الدائري</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
            {[
              { icon: "🌴", title: "مخلفات النخيل", color: "bg-amber-100" },
              { icon: "⚙️", title: "معالجة الألياف", color: "bg-orange-100" },
              { icon: "🧪", title: "مادة حيوية", color: "bg-emerald-100" },
              { icon: "📦", title: "تغليف ذكي", color: "bg-primary/20" },
              { icon: "🤖", title: "تحليل AI", color: "bg-blue-100" },
              { icon: "♻️", title: "تقليل الهدر", color: "bg-green-200" },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex flex-col md:flex-row items-center">
                <div className={`flex flex-col items-center p-6 rounded-2xl ${step.color} w-36 h-36 justify-center shadow-sm border border-black/5 hover:-translate-y-2 transition-transform duration-300`}>
                  <span className="text-4xl mb-3">{step.icon}</span>
                  <span className="font-bold text-sm text-secondary text-center">{step.title}</span>
                </div>
                {idx !== arr.length - 1 && (
                  <ArrowLeft className="w-6 h-6 text-secondary/30 my-4 md:my-0 md:mx-2 rotate-90 md:rotate-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
