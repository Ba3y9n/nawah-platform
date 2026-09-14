"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, CheckCircle2, TestTube2, AlertCircle, FileText, 
  ArrowRight, Package, ShieldCheck
} from "lucide-react";
import { REUSE_PATHWAYS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

function PathwaysContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batch_id") || "";

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<any>(REUSE_PATHWAYS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState(batchId);

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
        if (batchId && !selectedBatchId) {
          setSelectedBatchId(batchId);
        }
      }
    }
    loadData();
  }, [batchId]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-emerald-100/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {batchId && selectedBatch && (
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/pit-management/batches/${batchId}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للدفعة: {selectedBatch.batch_number}</span>
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>مسارات الاستفادة ومسارات الاقتصاد الدائري</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">مسارات الاستفادة الحيوية والصناعية المحتملة من نوى التمر</h2>
          <p className="text-xs text-slate-500 mt-1">
            التمييز الواضح بين المسارات المحتملة (Potential Uses) والنتائج المعملية المثبتة (Validated Results)
          </p>
        </div>

        <Link
          href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
          className="inline-flex items-center gap-2 bg-[#022B1E] hover:bg-[#033D2B] text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-[#022B1E]/10"
        >
          <TestTube2 className="w-4 h-4" />
          <span>بدء تجربة لاختبار مسار</span>
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
                  ? "bg-emerald-50 border-emerald-500 text-slate-900 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                  isSelected ? "bg-[#022B1E] text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  مسار محتمل / Potential Use
                </span>
                <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-1">{path.name}</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-2">
                عرض التفاصيل والأدلة ←
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED PATHWAY DETAILS */}
      <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-3 py-0.5 rounded-full">
                مسار محتمل / Potential Use
              </span>
              <span className="text-xs font-bold text-slate-500">مستوى الدليل: {selectedPathway.evidence_level}</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900">{selectedPathway.name}</h3>
          </div>

          <Link
            href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : `/pit-management/experiments/new`}
            className="inline-flex items-center gap-2 bg-[#022B1E] hover:bg-[#033D2B] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#022B1E]/10"
          >
            <TestTube2 className="w-4 h-4" />
            <span>توثيق تجربة لتأكيد هذا المسار</span>
          </Link>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 font-medium">
          {selectedPathway.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              متطلبات وتجهيز المعالجة
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.processing_requirements}</p>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              الاختبارات المخبرية المطلوبة للتحقق العلمي (Lab Validation)
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.required_tests}</p>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              المميزات والقيمة الاقتصادية
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.advantages}</p>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              التحديات التقنية والصناعية
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedPathway.challenges}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function PathwaysPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-slate-500 text-xs animate-pulse">
        جاري تحميل مسارات الاستفادة المحتملة...
      </div>
    }>
      <PathwaysContent />
    </Suspense>
  );
}
