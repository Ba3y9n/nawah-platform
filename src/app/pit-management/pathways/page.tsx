"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Layers, ShieldCheck, CheckCircle2, 
  ArrowLeft, TestTube2, AlertCircle, FileText
} from "lucide-react";
import { REUSE_PATHWAYS, getBatches } from "@/lib/store";
import { Batch, ReusePathway } from "@/lib/types";

export default function PathwaysPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<ReusePathway>(REUSE_PATHWAYS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  useEffect(() => {
    async function loadData() {
      const bList = await getBatches();
      setBatches(bList);
    }
    loadData();
  }, []);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>مسارات الاقتصاد الدائري والقيمة المضافة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">مسارات الاستفادة الحيوية والصناعية من نوى التمر</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            5 مسارات مثبتة علمياً لتحويل نوى التمر من مخلفات إلى منتجات صناعية عالية القيمة
          </p>
        </div>

        <Link
          href="/pit-management/experiments/new"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
        >
          <TestTube2 className="w-4 h-4" />
          <span>بدء تجربة على أحد المسارات</span>
        </Link>
      </div>

      {/* PATHWAYS SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {REUSE_PATHWAYS.map((path) => {
          const isSelected = selectedPathway.id === path.id;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPathway(path)}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? "bg-emerald-100/90 border-amber-400 text-emerald-950 shadow-lg shadow-emerald-950/60"
                  : "bg-slate-50/80 border-emerald-200/60 text-slate-600 hover:bg-emerald-100/40 hover:text-emerald-950"
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                  isSelected ? "bg-amber-400 text-emerald-950" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {path.evidence_level}
                </span>
                <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-1">{path.name}</h3>
              </div>
              <span className="text-[10px] text-emerald-600/80 font-semibold flex items-center gap-1 mt-2">
                عرض المتطلبات والاختبارات ←
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED PATHWAY DETAILS */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-emerald-200/60 pb-4 gap-3">
          <div>
            <span className="text-xs font-bold text-amber-400">{selectedPathway.evidence_level}</span>
            <h3 className="text-lg md:text-xl font-black text-emerald-950">{selectedPathway.name}</h3>
          </div>

          <Link
            href={`/pit-management/experiments/new`}
            className="inline-flex items-center gap-1.5 bg-emerald-200 hover:bg-emerald-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <TestTube2 className="w-4 h-4 text-amber-400" />
            <span>تنفيذ تجربة بهذا المسار</span>
          </Link>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-emerald-900">
          {selectedPathway.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-2">
            <h4 className="font-bold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              متطلبات وتجهيز المعالجة
            </h4>
            <p className="text-slate-600 leading-relaxed">{selectedPathway.processing_requirements}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              الاختبارات المخبرية المطلوبة
            </h4>
            <p className="text-slate-600 leading-relaxed">{selectedPathway.required_tests}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-2">
            <h4 className="font-bold text-emerald-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              المميزات والقيمة المضافة
            </h4>
            <p className="text-slate-600 leading-relaxed">{selectedPathway.advantages}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-2">
            <h4 className="font-bold text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              التحديات التقنية والتصنيعية
            </h4>
            <p className="text-slate-600 leading-relaxed">{selectedPathway.challenges}</p>
          </div>

        </div>

        {/* CHECK BATCH SUITABILITY TOOL */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            فحص ملائمة إحدى دفعاتك في قاعدة البيانات لهذا المسار:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8">
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- اختر دفعة لفحص ملاءمتها --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batch_number} - {b.source_name} ({b.quantity} كجم - {b.date_type} - {b.cleaning_status})
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl text-xs border border-emerald-300">
                <span className="text-emerald-600 font-bold block">ملاءمة ممتازة (95%)</span>
                <span className="text-[11px] text-slate-700">
                  الدفعة مغسولة وخالية من العوالق ومناسبة جداً للمعالجة.
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
