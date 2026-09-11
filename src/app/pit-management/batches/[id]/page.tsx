"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, MapPin, TestTube2, Sparkles, Scan, ArrowRight, 
  Calendar, ShieldCheck, CheckCircle2, PlusCircle, AlertCircle, TrendingUp
} from "lucide-react";
import { 
  getBatchById, getExperimentsByBatchId, getImageAnalysisByBatchId, REUSE_PATHWAYS 
} from "@/lib/store";
import { Batch, Experiment, ImageAnalysisRecord } from "@/lib/types";

export default function BatchDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [analysis, setAnalysis] = useState<ImageAnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const b = await getBatchById(resolvedParams.id);
      if (b) {
        setBatch(b);
        const exps = await getExperimentsByBatchId(b.id);
        setExperiments(exps);
        const anl = await getImageAnalysisByBatchId(b.id);
        setAnalysis(anl);
      }
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="text-center py-20 bg-slate-50/60 rounded-3xl border border-emerald-200/40">
        <p className="text-xs text-emerald-700 animate-pulse">جاري جلب تفاصيل الدفعة من قاعدة البيانات...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20 bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-950">الدفعة غير موجودة أو تم حذفها</h3>
        <Link
          href="/pit-management/batches"
          className="inline-flex items-center gap-2 bg-emerald-300 text-emerald-950 px-5 py-2 rounded-xl text-xs font-bold"
        >
          العودة لسجل الدفعات
        </Link>
      </div>
    );
  }

  // Calculate environmental impact for this batch
  const batchDivertedTon = (batch.quantity / 1000).toFixed(3);
  const batchCo2Ton = (Number(batchDivertedTon) * 0.65).toFixed(3);

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/pit-management/batches"
            className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-300 dir-ltr">{batch.batch_number}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold">
                {batch.status}
              </span>
            </div>
            <p className="text-xs text-emerald-700/80 mt-1 flex items-center gap-2">
              <span>{batch.source_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <MapPin className="w-3 h-3 text-amber-400" />
                {batch.city_name || batch.region_name}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
          >
            <TestTube2 className="w-4 h-4" />
            <span>إجراء تجربة على هذه الدفعة</span>
          </Link>

          <Link
            href={`/pit-management/scanner?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-3.5 py-2.5 rounded-2xl text-xs transition-colors"
          >
            <Scan className="w-4 h-4 text-amber-400" />
            <span>تحليل الصورة والخصائص</span>
          </Link>
        </div>
      </div>

      {/* METADATA GRID & IMAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* METADATA (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            تفاصيل شحنة ومواصفات النوى
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">الكمية الإجمالية</span>
              <span className="text-lg font-black text-amber-300">{batch.quantity.toLocaleString()} كجم</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">نوع التمر</span>
              <span className="text-sm font-bold text-emerald-950">{batch.date_type}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">تاريخ الجمع</span>
              <span className="text-sm font-bold text-emerald-950">{batch.date_collected}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">حالة التنظيف</span>
              <span className="text-xs font-semibold text-emerald-700">{batch.cleaning_status}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">حالة التجفيف</span>
              <span className="text-xs font-semibold text-emerald-700">{batch.drying_status}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-900">
              <span className="text-emerald-600/80 block text-[10px]">نسبة الرطوبة</span>
              <span className="text-xs font-semibold text-amber-300">
                {batch.moisture ? `${batch.moisture}%` : 'غير مقاسة'}
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600/80 font-bold">طريقة التخزين:</span>
              <span className="text-slate-700">{batch.storage_method}</span>
            </div>
            {batch.notes && (
              <div className="flex items-start gap-2">
                <span className="text-emerald-600/80 font-bold">ملاحظات:</span>
                <span className="text-slate-600">{batch.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* IMAGE & VISUAL SUMMARY (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
            <Scan className="w-4 h-4 text-amber-400" />
            صورة الدفعة والتحليل البصري
          </h3>

          <div className="bg-white border border-emerald-900 rounded-2xl p-2 text-center">
            {batch.image_url ? (
              <img
                src={batch.image_url}
                alt={batch.batch_number}
                className="max-h-48 mx-auto rounded-xl object-cover"
              />
            ) : (
              <div className="py-8 text-emerald-500/60 text-xs font-semibold">
                لا تتوفر صورة مرفوعة للدفعة
              </div>
            )}
          </div>

          {analysis ? (
            <div className="bg-emerald-50/80 border border-emerald-200/60 p-3 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>التحليل البصري المسجل:</span>
                <span>دقة {analysis.confidence}%</span>
              </div>
              <p className="text-slate-700 text-[11px]">{analysis.visual_features}</p>
            </div>
          ) : (
            <Link
              href={`/pit-management/scanner?batch_id=${batch.id}`}
              className="block text-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-amber-300 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              تشغيل التحليل البصري للدفعة
            </Link>
          )}
        </div>

      </div>

      {/* RE-USE PATHWAYS MATCHING THIS BATCH */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          المسارات التحويلية المقترحة لهذه الدفعة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REUSE_PATHWAYS.slice(0, 3).map((path) => (
            <div key={path.id} className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-2">
              <span className="text-[10px] bg-emerald-100 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {path.evidence_level}
              </span>
              <h4 className="text-xs font-bold text-emerald-950">{path.name}</h4>
              <p className="text-[11px] text-emerald-700/80 leading-relaxed line-clamp-2">
                {path.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIMENTS PERFORMED ON THIS BATCH */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-amber-400" />
              التجارب المختبرية والتطبيقية على هذه الدفعة ({experiments.length})
            </h3>
            <p className="text-xs text-emerald-700/70">كل تجربة ترتبط بالدفعة لتحديث الكميات والأثر</p>
          </div>

          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة تجربة جديدة</span>
          </Link>
        </div>

        {experiments.length === 0 ? (
          <div className="text-center py-10 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200/60 space-y-2">
            <TestTube2 className="w-8 h-8 text-amber-400/60 mx-auto" />
            <p className="text-xs font-bold text-emerald-800">لم يتم تنفيذ أي تجربة على هذه الدفعة بعد</p>
            <p className="text-[11px] text-emerald-600/70">
              يمكنك إنشاء تجربة (مثل تحضير الفحم المنشط أو استخلاص الزيت أو التحميص) لربط نتائجها بهذه الدفعة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((e) => (
              <div key={e.id} className="bg-white border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 dir-ltr">{e.experiment_number}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                    {e.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-emerald-950">{e.objective}</h4>
                <div className="text-[11px] text-emerald-700/80 space-y-1">
                  <p>الكمية المستهلكة: <strong className="text-amber-300">{e.quantity_used} كجم</strong></p>
                  <p>طريقة المعالجة: {e.processing_method}</p>
                  <p className="text-emerald-800 bg-emerald-100/50 p-2 rounded-xl">النتيجة: {e.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ENVIRONMENTAL IMPACT OF THIS BATCH */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-200/80 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-400 text-emerald-950 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">الأثر البيئي المحسوب لهذه الدفعة</h4>
            <p className="text-xs text-emerald-700/80">
              تحويل {batchDivertedTon} طن من النفايات العضوية عن المدافن ← خفض {batchCo2Ton} طن مكافئ CO2
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
