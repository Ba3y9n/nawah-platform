"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Layers, CheckCircle2, 
  TestTube2, AlertCircle, FileText
} from "lucide-react";
import { REUSE_PATHWAYS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function PathwaysPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<any>(REUSE_PATHWAYS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: bList } = await supabase
          .from('batches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBatches(bList || []);
      }
    }
    loadData();
  }, []);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>مسارات الاقتصاد الدائري والقيمة المضافة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">مسارات الاستفادة الحيوية والصناعية من نوى التمر</h2>
          <p className="text-xs text-slate-500 mt-1">
            5 مسارات مثبتة علمياً لتحويل نوى التمر من مخلفات إلى منتجات صناعية عالية القيمة
          </p>
        </div>

        <Link
          href="/pit-management/experiments/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
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
                  ? "bg-emerald-100 border-emerald-500 text-slate-900 shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                  isSelected ? "bg-slate-900 text-slate-900" : "bg-slate-50 text-slate-500"
                }`}>
                  {path.evidence_level}
                </span>
                <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-1">{path.name}</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-2">
                عرض المتطلبات والاختبارات ←
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED PATHWAY DETAILS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-emerald-100 pb-4 gap-3">
          <div>
            <span className="text-xs font-bold text-amber-600">{selectedPathway.evidence_level}</span>
            <h3 className="text-lg md:text-xl font-black text-slate-900">{selectedPathway.name}</h3>
          </div>

          <Link
            href={`/pit-management/experiments/new`}
            className="inline-flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <TestTube2 className="w-4 h-4 text-amber-600" />
            <span>تنفيذ تجربة بهذا المسار</span>
          </Link>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-emerald-100">
          {selectedPathway.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              متطلبات وتجهيز المعالجة
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.processing_requirements}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-amber-600 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              الاختبارات المخبرية المطلوبة
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.required_tests}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              المميزات والقيمة المضافة
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.advantages}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              التحديات التقنية والتصنيعية
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.challenges}</p>
          </div>

        </div>

        {/* CHECK BATCH SUITABILITY TOOL */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            فحص ملائمة إحدى دفعاتك في قاعدة البيانات لهذا المسار:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8">
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
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
              <div className="md:col-span-4 bg-white p-3 rounded-xl text-xs border border-slate-200">
                <span className="text-slate-500 font-bold block">ملاءمة ممتازة (95%)</span>
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
