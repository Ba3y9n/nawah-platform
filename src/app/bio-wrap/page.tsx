import { Leaf, ArrowDown, Recycle, ShieldCheck, TreePine } from "lucide-react";
import Image from "next/image";

export default function BioWrapPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 flex items-center justify-center gap-4">
          <Recycle className="w-10 h-10 text-primary" />
          غلاف ثَمر الحيوي
        </h1>
        <p className="text-xl text-secondary/70 max-w-3xl mx-auto leading-relaxed">
          ابتكار مادي ملموس يجمع بين الاستدامة البيئية وتكنولوجيا المواد المتقدمة، مستخلص بالكامل من الموارد المحلية السعودية.
        </p>
      </div>

      {/* Process Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary/10 mb-16">
        <h2 className="text-3xl font-bold text-secondary mb-12 text-center">رحلة الابتكار: من المخلفات إلى الحماية</h2>
        
        <div className="flex flex-col items-center max-w-2xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 -translate-x-1/2 hidden md:block"></div>
          
          {[
            {
              icon: <TreePine className="w-8 h-8 text-white" />,
              title: "مخلفات النخيل 🌴",
              desc: "استغلال سعف النخيل والمخلفات الزراعية المهدرة في البيئة المحلية السعودية.",
              color: "bg-amber-600"
            },
            {
              icon: <Recycle className="w-8 h-8 text-white" />,
              title: "معالجة الألياف",
              desc: "استخلاص السليلوز والألياف الطبيعية بطرق صديقة للبيئة بدون مواد كيميائية ضارة.",
              color: "bg-orange-500"
            },
            {
              icon: <Leaf className="w-8 h-8 text-white" />,
              title: "الغلاف الحيوي القابل للتحلل",
              desc: "تشكيل مادة التغليف الحيوية التي تسمح بتنفس المنتجات وتمنع تراكم الرطوبة المسببة للعفن.",
              color: "bg-primary"
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-white" />,
              title: "حماية المنتجات الطازجة",
              desc: "تمديد فترة الصلاحية للخضروات والفواكه بشكل طبيعي مع الحفاظ على قيمتها الغذائية.",
              color: "bg-emerald-500"
            }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center w-full mb-12 last:mb-0 relative z-10">
              <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-left' : 'md:pl-12 md:text-right order-1 md:order-3'}`}>
                <div className={`bg-beige-light p-6 rounded-2xl border border-black/5 shadow-sm ${idx % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-sm`}>
                  <h3 className="text-xl font-bold text-secondary mb-2">{step.title}</h3>
                  <p className="text-secondary/70 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
              
              <div className={`w-16 h-16 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center shrink-0 order-2 md:order-2 my-6 md:my-0`}>
                {step.icon}
              </div>
              
              <div className="md:w-1/2 order-3 md:order-1 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center">
          <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-3">استدامة 100%</h3>
          <p className="text-secondary/70">يتحلل الغلاف بالكامل في التربة ليتحول إلى سماد عضوي، مما يمنع التلوث البلاستيكي.</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center">
          <Recycle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-3">الاقتصاد الدائري</h3>
          <p className="text-secondary/70">تحويل تكلفة التخلص من المخلفات الزراعية إلى عوائد اقتصادية للمزارعين.</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center">
          <TreePine className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-3">موارد محلية</h3>
          <p className="text-secondary/70">الاعتماد الكامل على ملايين النخلات في المملكة كمصدر متجدد ومستدام للمواد الخام.</p>
        </div>
      </div>
    </div>
  );
}
