"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, ExternalLink, Search, Filter, AlertCircle, ShieldCheck } from "lucide-react";
import { EVIDENCE_SOURCES, REUSE_PATHWAYS } from "@/lib/store";
import { EvidenceSource } from "@/lib/types";

function EvidenceContent() {
  const searchParams = useSearchParams();
  const pathwayId = searchParams.get("pathway_id") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPathwayId, setSelectedPathwayId] = useState(pathwayId);

  useEffect(() => {
    if (pathwayId) {
      setSelectedPathwayId(pathwayId);
    }
  }, [pathwayId]);

  const filteredSources = EVIDENCE_SOURCES.filter(ev => {
    const matchesSearch = searchTerm === "" || 
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ev.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPathway = !selectedPathwayId || ev.reuse_pathway_id === selectedPathwayId;

    return matchesSearch && matchesPathway;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-emerald-100/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>قاعدة الأدلة والأبحاث العلمية الموثقة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">المصادر والأبحاث الرسمية لحوكمة نوى التمر</h2>
          <p className="text-xs text-slate-500 mt-1">
            أبحاث وتقارير حكومية حقيقية لجامعات ومؤسسات سعودية ودولية موثقة دون ادعاءات أو مصادر وهمية
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-2 rounded-2xl border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>أبحاث محكّمة ومصادر موثقة</span>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="البحث في الأبحاث والدراسات العلمية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
        </div>

        <select
          value={selectedPathwayId}
          onChange={(e) => setSelectedPathwayId(e.target.value)}
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="">جميع المسارات العلمية</option>
          {REUSE_PATHWAYS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* EVIDENCE LIST OR EMPTY STATE */}
      {filteredSources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">لا يوجد دليل موثق مرتبط بهذا المسار أو البحث حالياً</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            نعمل على توثيق الأوراق العلمية والبراءات وتحديث قاعدة البيانات باستمرار فور اعتماد الأبحاث.
          </p>
          <button
            onClick={() => { setSelectedPathwayId(""); setSearchTerm(""); }}
            className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            إلغاء التصفية وعرض كل المصادر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSources.map((ev) => (
            <div key={ev.id} className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                    {ev.source_type} ({ev.year})
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">{ev.evidence_level}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>
                <p className="text-xs text-slate-500 font-bold">الجهة / الباحث: {ev.organization}</p>
                
                <p className="text-xs text-slate-700 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60 leading-relaxed font-medium">
                  {ev.summary}
                </p>
              </div>

              {ev.url && (
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline pt-2 border-t border-slate-100"
                >
                  <span>رابط المصدر والدراسة المحكّمة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default function EvidencePage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-slate-500 text-xs animate-pulse">
        جاري تحميل مكتبة الأدلة العلمية...
      </div>
    }>
      <EvidenceContent />
    </Suspense>
  );
}
