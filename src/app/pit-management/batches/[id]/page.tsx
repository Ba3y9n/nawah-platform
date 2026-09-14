"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  Package, MapPin, TestTube2, Sparkles, Scan, ArrowRight, 
  PlusCircle, AlertCircle, TrendingUp, Loader2, CheckCircle2,
  FileText, ShieldAlert, BookOpen, ChevronLeft, ArrowDown
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { REUSE_PATHWAYS, EVIDENCE_SOURCES, getBatchById, getImageAnalysisByBatchId, getExperimentsByBatchId } from "@/lib/store";

export default function BatchDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const [batch, setBatch] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      
      let bData = null;
      try {
        const { data: b } = await supabase
          .from('batches')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();
        bData = b;
      } catch (e) {
        console.warn("Supabase fetch notice:", e);
      }

      if (!bData) {
        bData = await getBatchById(resolvedParams.id);
      }

      if (bData) {
        setBatch(bData);

        let anlData = null;
        try {
          const { data: anl } = await supabase
            .from('image_analysis')
            .select('*')
            .eq('batch_id', bData.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          anlData = anl;
        } catch (e) {}

        if (!anlData) {
          anlData = await getImageAnalysisByBatchId(bData.id);
        }
        setAnalysis(anlData);

        let expsData: any[] = [];
        try {
          const { data: exps } = await supabase
            .from('experiments')
            .select('*')
            .eq('batch_id', bData.id)
            .order('created_at', { ascending: false });
          expsData = exps || [];
        } catch (e) {}

        if (!expsData || expsData.length === 0) {
          expsData = await getExperimentsByBatchId(bData.id);
        }
        setExperiments(expsData);
      }

      setLoading(false);
    }

    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">جاري تحميل رحلة الدفعة الرقمية...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">الدفعة غير موجودة أو تم نقلها</h3>
        <Link
          href="/pit-management/batches"
          className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold"
        >
          العودة لسجل الدفعات
        </Link>
      </div>
    );
  }

  const batchDivertedTon = (Number(batch.quantity) / 1000).toFixed(3);
  const batchCo2Ton = (Number(batchDivertedTon) * 0.65).toFixed(3);
  const relevantEvidence = EVIDENCE_SOURCES.slice(0, 2);

  const stages = [
    { num: "01", name: "تسجيل الدفعة", isDone: true, desc: `NW-${batch.batch_number || '2026'}` },
    { num: "02", name: "التحليل البصري", isDone: !!analysis, desc: analysis ? "مكتمل" : "في الانتظار" },
    { num: "03", name: "الاستخدام المحتمل", isDone: true, desc: "3 مسارات" },
    { num: "04", name: "التجارب", isDone: experiments.length > 0, desc: experiments.length > 0 ? `${experiments.length} تجربة` : "لم تبدأ" },
    { num: "05", name: "الأدلة", isDone: true, desc: "مرتبطة" },
    { num: "06", name: "الأثر", isDone: Number(batch.quantity) > 0, desc: `${batchCo2Ton} طن CO2e` }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      
      {/* HEADER HUB BANNER */}
      <div className="bg-emerald-950 text-white border border-emerald-900 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-900/80 pb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/pit-management/batches"
              className="p-2.5 rounded-2xl bg-white/10 text-emerald-200 hover:bg-white/20 transition-colors border border-white/10"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-black text-white dir-ltr">{batch.batch_number}</span>
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-800 text-emerald-200 border border-emerald-700 font-bold">
                  {batch.status || 'رحلة نشطة'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1 flex items-center gap-2">
                <span className="font-bold text-white">{batch.source_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  تاريخ الجمع: {batch.date_collected}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/pit-management/scanner?batch_id=${batch.id}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors border border-white/10"
            >
              <Scan className="w-4 h-4 text-amber-300" />
              <span>فحص بصري</span>
            </Link>
            <Link
              href={`/pit-management/experiments/new?batch_id=${batch.id}`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md"
            >
              <TestTube2 className="w-4 h-4" />
              <span>إجراء تجربة</span>
            </Link>
          </div>
        </div>

        {/* BATCH JOURNEY TIMELINE BAR */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">مسار رحلة الدفعة (Process Hub):</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((st, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                st.isDone ? "bg-emerald-900/80 border-emerald-700 text-white" : "bg-emerald-950/40 border-emerald-900 text-emerald-400/50"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-amber-400">{st.num}</span>
                  {st.isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">{st.name}</span>
                  <span className="text-[10px] text-emerald-200/70 block mt-0.5">{st.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STAGE 1: BATCH CREATION & METADATA */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-950 text-amber-400 font-black text-xs flex items-center justify-center">01</span>
            <div>
              <h3 className="text-base font-black text-emerald-950">تسجيل الدفعة (Batch Creation)</h3>
              <p className="text-xs text-slate-500">مواصفات شحنة النوى المسجلة وسجل المصدر</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
            ✓ موثقة ومسجلة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">الكمية المسجلة</span>
            <span className="text-lg font-black text-emerald-950">{Number(batch.quantity).toLocaleString()} كجم</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">صنف التمر</span>
            <span className="text-xs font-bold text-slate-900">{batch.date_type}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">حالة التنظيف</span>
            <span className="text-xs font-bold text-slate-900">{batch.cleaning_status}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">التجفيف</span>
            <span className="text-xs font-bold text-slate-900">{batch.drying_status}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">نسبة الرطوبة</span>
            <span className="text-xs font-bold text-emerald-700">{batch.moisture ? `${batch.moisture}%` : 'تقديرية'}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold">التخزين</span>
            <span className="text-xs font-bold text-slate-900">{batch.storage_method || 'أكياس تهوية'}</span>
          </div>
        </div>

        {/* STEP DIRECTIONAL LINK */}
        <div className="pt-2 flex justify-end">
          <Link href={`/pit-management/scanner?batch_id=${batch.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900">
            <span>الانتقال للمرحلة التالية: التحليل البصري</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STAGE 2: VISUAL ANALYSIS */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-950 text-amber-400 font-black text-xs flex items-center justify-center">02</span>
            <div>
              <h3 className="text-base font-black text-emerald-950">التحليل البصري التقديري (Visual Analysis)</h3>
              <p className="text-xs text-slate-500">نتائج فحص المظهر السطحي ونسبة النقاء والشوائب</p>
            </div>
          </div>

          {analysis ? (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              مكتمل (ثقة {analysis.confidence || 92}%)
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
              لم يُجرَ فحص بصري بعد
            </span>
          )}
        </div>

        {analysis ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">الملاحظات البصرية السطحية:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{analysis.visual_features}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">مؤشر النقاء والشوائب:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{analysis.visible_impurities}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">التجانس البصري:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{analysis.visual_homogeneity}</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-[11px] text-amber-950 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                تنبيه هام: هذا الفحص البصري التقديري يحلل المظهر السطحي والشوائب الظاهرة فقط، ولا يغني عن الفحوصات المعملية لتحديد الرطوبة والتركيب الكيميائي أو السلامة الميكروبية.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
            <Scan className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">لم يتم تسجيل فحص بصري لهذه الدفعة بعد</p>
            <Link
              href={`/pit-management/scanner?batch_id=${batch.id}`}
              className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إجراء الفحص البصري الآن</span>
            </Link>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/pit-management/pathways?batch_id=${batch.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900">
            <span>الانتقال للمرحلة التالية: الاستخدامات المحتملة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STAGE 3: POTENTIAL USES */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-950 text-amber-400 font-black text-xs flex items-center justify-center">03</span>
            <div>
              <h3 className="text-base font-black text-emerald-950">مسارات الاستفادة المحتملة (Potential Uses)</h3>
              <p className="text-xs text-slate-500">مسارات مرشحة للاستفادة تتطلب تجارب واختبارات لرفع الموثوقية</p>
            </div>
          </div>
          <Link href={`/pit-management/pathways?batch_id=${batch.id}`} className="text-xs font-bold text-emerald-700">
            استكشاف كافة المسارات ←
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REUSE_PATHWAYS.slice(0, 3).map((path) => (
            <div key={path.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  مسار محتمل / Potential Use
                </span>
                <h4 className="text-xs font-bold text-emerald-950">{path.name}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">{path.description}</p>
              </div>

              <Link
                href={`/pit-management/experiments/new?batch_id=${batch.id}`}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 pt-2 block"
              >
                اختبار المسار بتجربة ←
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* STAGE 4: EXPERIMENTS */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-950 text-amber-400 font-black text-xs flex items-center justify-center">04</span>
            <div>
              <h3 className="text-base font-black text-emerald-950">التجارب الموثقة ({experiments.length})</h3>
              <p className="text-xs text-slate-500">ربط الفرضيات بالنتائج والمخرجات الفعلية</p>
            </div>
          </div>
          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>إضافة تجربة</span>
          </Link>
        </div>

        {experiments.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
            <TestTube2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">لم يتم تسجيل تجارب على هذه الدفعة بعد</p>
            <Link
              href={`/pit-management/experiments/new?batch_id=${batch.id}`}
              className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>إجراء تجربة جديدة</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((e) => (
              <div key={e.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-950 dir-ltr">{e.experiment_number}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                    {e.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900">{e.objective}</h4>
                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1 mt-2">
                  <span className="font-bold text-[10px] text-amber-600 block">النتيجة المسجلة:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{e.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STAGE 5 & 6: SCIENTIFIC EVIDENCE & IMPACT SUMMARY */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-900 text-amber-400 font-black text-xs flex items-center justify-center">05 & 06</span>
            <div>
              <h3 className="text-base font-black text-white">الأثر التراكمي والمصادر العلمية الموثقة</h3>
              <p className="text-xs text-emerald-200/80">ربط المخرجات بالدراسات الأكاديمية وحساب الانبعاثات المتجنبة</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
            <span className="text-emerald-300 font-bold text-[10px] block uppercase">بيانات فعلية:</span>
            <span className="text-xl font-black text-white">{Number(batch.quantity).toLocaleString()} كجم</span>
            <p className="text-[11px] text-emerald-200/70">الكمية المسجلة برقم NW المعتمد</p>
          </div>

          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
            <span className="text-emerald-300 font-bold text-[10px] block uppercase">تقدير نظري:</span>
            <span className="text-xl font-black text-amber-400">{batchDivertedTon} طن</span>
            <p className="text-[11px] text-emerald-200/70">نفايات عضوية محولة عن المدافن</p>
          </div>

          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
            <span className="text-emerald-300 font-bold text-[10px] block uppercase">تقدير انبعاثات متجنبة:</span>
            <span className="text-xl font-black text-amber-400">{batchCo2Ton} طن</span>
            <p className="text-[11px] text-emerald-200/70">انبعاثات متجنبة (معامل تقديري 0.65 طن CO2e / طن)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
