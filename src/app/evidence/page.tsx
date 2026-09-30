"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Search, ShieldCheck, Database, Building, FileText } from "lucide-react";

const REAL_EVIDENCE_SOURCES = [
  {
    id: "source-1",
    title: "Date Seeds: A Promising Source of Oil with Functional Properties",
    type: "دراسة علمية محكّمة",
    topic: "استخلاص زيت نواة التمر وخصائصه الوظيفية",
    desc: "تستعرض الدراسة نواة التمر كمصدر محتمل للزيت، وتناقش طرق استخلاصه، بما في ذلك الاستخلاص بالمذيبات وطريقة Soxhlet، إلى جانب الخصائص المرتبطة بزيت نواة التمر.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7353509/",
    buttonText: "عرض الدراسة",
    icon: FileText
  },
  {
    id: "source-2",
    title: "المركز الوطني للنخيل والتمور",
    type: "مصدر حكومي سعودي",
    topic: "إحصاءات قطاع النخيل والتمور في المملكة",
    desc: "مصدر رسمي للبيانات والإحصاءات المتعلقة بقطاع النخيل والتمور في المملكة العربية السعودية، ويشمل معلومات عن الإنتاج والأصناف والحيازات الزراعية وقيمة إنتاج التمور.",
    url: "https://ncpd.gov.sa/ar",
    buttonText: "زيارة المصدر الرسمي",
    icon: Building
  },
  {
    id: "source-3",
    title: "الهيئة العامة للغذاء والدواء — التمر",
    type: "مصدر حكومي سعودي",
    topic: "الخصائص الغذائية ومكونات التمر",
    desc: "مصدر توعوي رسمي يوضح المكونات الغذائية للتمر، بما في ذلك السكريات والألياف والبروتين والمعادن والفيتامينات، إضافة إلى معلومات متعلقة بحفظ التمور وسلامتها الغذائية.",
    url: "https://www.sfda.gov.sa/ar/awarenessarticle/التمر",
    buttonText: "عرض المصدر",
    icon: ShieldCheck
  },
  {
    id: "source-4",
    title: "Physicochemical and Structural Characteristics of Date Seed and Starch Composite Powder as Prepared by Heating at Different Temperatures",
    type: "دراسة علمية محكّمة",
    topic: "الخصائص الفيزيائية والكيميائية والتركيبية لنواة التمر",
    desc: "دراسة علمية تبحث في الخصائص الفيزيائية والكيميائية والتركيبية لنواة التمر ومساحيقها المركبة، وتوفر أساسًا معرفيًا لفهم خصائص المورد قبل دراسة مسارات الاستفادة التطبيقية منه.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12298933/",
    buttonText: "عرض الدراسة",
    icon: FileText
  }
];

export default function EvidencePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("جميع المصادر");

  const filteredSources = REAL_EVIDENCE_SOURCES.filter(ev => {
    const matchesSearch = searchTerm === "" || 
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ev.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "جميع المصادر" || 
      (filterType === "الدراسات العلمية" && ev.type === "دراسة علمية محكّمة") ||
      (filterType === "المصادر الحكومية" && ev.type === "مصدر حكومي سعودي") ||
      (filterType === "البيانات والإحصاءات" && ev.topic.includes("إحصاءات"));

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 font-sans text-slate-800" dir="rtl">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-stone-200 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">الأدلة والمصادر العلمية</h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
            قاعدة معرفية موثقة تجمع الدراسات العلمية والمصادر الحكومية ذات الصلة بالتمر ونوى التمر وتطبيقاتهما المحتملة.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-lg border border-emerald-100 text-sm font-bold shrink-0">
          <BookOpen className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
          <span>مصادر موثقة</span>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="البحث في الأدلة والمصادر العلمية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-900 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4" strokeWidth={2} />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-emerald-500 font-bold transition-all"
        >
          <option value="جميع المصادر">جميع المصادر</option>
          <option value="الدراسات العلمية">الدراسات العلمية</option>
          <option value="المصادر الحكومية">المصادر الحكومية</option>
          <option value="البيانات والإحصاءات">البيانات والإحصاءات</option>
        </select>
      </div>

      {/* EVIDENCE LIST OR EMPTY STATE */}
      {filteredSources.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-16 text-center space-y-4 shadow-sm">
          <Database className="w-12 h-12 text-slate-300 mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-slate-900">لا توجد مصادر مطابقة لبحثك</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            حاول استخدام كلمات مفتاحية مختلفة أو تغيير الفلتر لعرض المزيد من النتائج الموثقة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSources.map((ev) => (
            <div key={ev.id} className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col h-full hover:border-emerald-500 hover:shadow-md transition-all">
              
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center shrink-0 border border-stone-200 text-slate-600">
                  <ev.icon size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400">{ev.type}</span>
                  <span className="text-sm font-bold text-emerald-800">{ev.topic}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900 leading-relaxed" dir="auto">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {ev.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100">
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-white font-bold bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-lg transition-colors"
                >
                  <span>{ev.buttonText}</span>
                  <ExternalLink size={14} strokeWidth={2} className="rtl:-scale-x-100" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
