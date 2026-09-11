"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { EVIDENCE_SOURCES, REUSE_PATHWAYS } from "@/lib/store";
import { EvidenceSource } from "@/lib/types";

export default function EvidencePage() {
  const [sources, setSources] = useState<EvidenceSource[]>(EVIDENCE_SOURCES);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>قاعدة البيانات والأدلة العلمية الموثقة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">المصادر والدراسات الموثقة</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            دليل كامل بالأوراق العلمية، التشاريع، والتقارير الحكومية الخاصة باستغلال وتدوير نوى التمر
          </p>
        </div>
      </div>

      {/* EVIDENCE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((ev) => (
          <div key={ev.id} className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-amber-300 border border-emerald-300 font-bold">
                {ev.source_type} ({ev.year})
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">{ev.evidence_level}</span>
            </div>

            <h3 className="text-sm font-bold text-emerald-950 leading-snug">{ev.title}</h3>
            
            <p className="text-xs text-emerald-700/80 font-medium">الجهة / المؤسسة: {ev.organization}</p>
            
            <p className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-emerald-900 leading-relaxed">
              {ev.summary}
            </p>

            {ev.url && (
              <a
                href={ev.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline pt-1"
              >
                <span>رابط المصدر والدراسة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
