"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, CheckCircle2, TestTube2, AlertCircle, FileText, 
  ArrowRight, Package, ShieldCheck, ChevronLeft
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
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            {batchId && selectedBatch && (
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  href={`/pit-management/batches/${batchId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>الدفعة الحالية: {selectedBatch.batch_number}</span>
                </Link>
              </div>
            )}
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المرحلة 04 من رحلة النواة: الاستخدامات المحتملة</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-emerald-950">مسارات الاستفادة الحيوية والصناعية المحتملة من نوى التمر</h2>
            <p className="text-xs text-slate-500 mt-1">
              مسارات مرشحة غير قطعية (Potential Uses) وتستدعي إجراء تجارب واختبارات لرفع درجة الموثوقية.
            </p>
          </div>

          <Link
            href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shrink-0"
          >
            <TestTube2 className="w-4 h-4 text-amber-300" />
            <span>إنشاء تجربة لهذا المسار</span>
          </Link>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            تنويه المنهجية: هذه مسارات محتملة للاستفادة من النوى وليست نتائج مثبتة لهذه الدفعة. للوصول لنتيجة مثبتة وموثقة (Validated Result) يجب إجراء وتوثيق تجربة معملية.
          </p>
        </div>
      </div>

      {/* PATHWAYS SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {REUSE_PATHWAYS.map((path) => {
          const isSelected = selectedPathway.id === path.id;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPathway(path)}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-emerald-950 border-emerald-950 text-white shadow-md"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="space-y-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                  isSelected ? "bg-amber-400 text-emerald-950" : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}>
                  استخدام محتمل
                </span>
                <h3 className="text-xs font-bold leading-snug line-clamp-2">{path.name}</h3>
              </div>
              <span className={`text-[10px] font-semibold flex items-center gap-1 mt-2 ${isSelected ? "text-emerald-200" : "text-slate-400"}`}>
                عرض التفاصيل والأدلة ←
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED PATHWAY DETAILS */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-3 py-0.5 rounded-full">
                مسار محتمل / Potential Use
              </span>
              <span className="text-xs font-bold text-slate-500">مستوى الدليل: {selectedPathway.evidence_level}</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-emerald-950">{selectedPathway.name}</h3>
          </div>

          <Link
            href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : `/pit-management/experiments/new`}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shrink-0"
          >
            <TestTube2 className="w-4 h-4 text-amber-300" />
            <span>توثيق تجربة لتأكيد هذا المسار</span>
          </Link>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
          {selectedPathway.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              متطلبات وتجهيز المعالجة
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium">{selectedPathway.processing_requirements}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              الاختبارات المخبرية المطلوبة للتحقق العلمي (Lab Validation)
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium">{selectedPathway.required_tests}</p>
          </div>
        </div>

        {/* NEXT STEP DIRECTED PANEL */}
        <div className="bg-emerald-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">الخطوة التالية في الرحلة</span>
            <h4 className="text-sm font-black text-white mt-0.5">الانتقال لمرحلة التجارب وإضافة اختبار معملي</h4>
          </div>

          <Link
            href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md shrink-0"
          >
            <span>إنشاء تجربة معملية جديدة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
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
