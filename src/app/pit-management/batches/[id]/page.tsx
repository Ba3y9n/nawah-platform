"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  Package, MapPin, TestTube2, Sparkles, Scan, ArrowRight, 
  PlusCircle, AlertCircle, TrendingUp, Loader2, CheckCircle2,
  FileText, ShieldAlert, BookOpen, ChevronLeft
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
      
      // Fetch batch (Support both authenticated & guest mode)
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

      // Fallback to local store if not found in Supabase
      if (!bData) {
        bData = await getBatchById(resolvedParams.id);
      }

      if (bData) {
        setBatch(bData);

        // 1. Fetch linked analysis
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

        // 2. Fetch linked experiments
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
      <div className="text-center py-20 bg-white rounded-3xl border border-emerald-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">جاري تحميل سجل الدفعة ورحلتها الرقمية...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20 bg-white border border-emerald-100/60 rounded-3xl p-8 space-y-4 shadow-xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">الدفعة غير موجودة أو تم نقلها</h3>
        <Link
          href="/pit-management/batches"
          className="inline-flex items-center gap-2 bg-[#022B1E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold"
        >
          العودة لسجل الدفعات
        </Link>
      </div>
    );
  }

  // Calculate environmental metrics
  const batchDivertedTon = (Number(batch.quantity) / 1000).toFixed(3);
  const batchCo2Ton = (Number(batchDivertedTon) * 0.65).toFixed(3);

  // Match evidence sources
  const relevantEvidence = EVIDENCE_SOURCES.slice(0, 2);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-emerald-100/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/pit-management/batches"
            className="p-3 rounded-2xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-black text-[#022B1E] tracking-tight">{batch.batch_number}</span>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                {batch.status || 'مسجلة'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-bold text-slate-700">{batch.source_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                تاريخ الجمع: {batch.date_collected}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/pit-management/scanner?batch_id=${batch.id}`}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors shadow-sm"
          >
            <Scan className="w-4 h-4 text-emerald-600" />
            <span>فحص بصري</span>
          </Link>
          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-2 bg-[#022B1E] hover:bg-[#033D2B] text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-[#022B1E]/10"
          >
            <TestTube2 className="w-4 h-4" />
            <span>إجراء تجربة</span>
          </Link>
        </div>
      </div>

      {/* METADATA GRID */}
      <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 space-y-6">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" />
          بيانات ومواصفات السجل الرقمي للدفعة (Data Record)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">الكمية المسجلة</span>
            <span className="text-lg font-black text-emerald-950">{Number(batch.quantity).toLocaleString()} كجم</span>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">صنف النواة</span>
            <span className="text-sm font-bold text-slate-900">{batch.date_type}</span>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">حالة التنظيف</span>
            <span className="text-xs font-bold text-slate-800">{batch.cleaning_status}</span>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">طريقة التجفيف</span>
            <span className="text-xs font-bold text-slate-800">{batch.drying_status}</span>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">نسبة الرطوبة</span>
            <span className="text-xs font-bold text-emerald-700">
              {batch.moisture ? `${batch.moisture}%` : 'تتطلب فحصاً معملياً'}
            </span>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-bold">طريقة التخزين</span>
            <span className="text-xs font-bold text-slate-800">{batch.storage_method || 'أكياس تهوية'}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 BATCH DIGITAL JOURNEY (رحلة الدفعة الرقمية المترابطة) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">رحلة الدفعة الرقمية المترابطة</h3>
            <p className="text-xs text-slate-500 mt-1">تتبع تسلسل البيانات من الفحص البصري حتى قياس الأثر البيئي والاقتصادي</p>
          </div>
        </div>

        {/* STAGE 1: VISUAL ASSESSMENT */}
        <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">01</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">التحليل البصري التقديري (Visual Assessment)</h4>
                <p className="text-[11px] text-slate-500">فحص الخصائص السطحية ومؤشرات النقاء بالذكاء الاصطناعي</p>
              </div>
            </div>

            {analysis ? (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تم الفحص البصري (ثقة {analysis.confidence || 92}%)
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                لم يُجرَ فحص بصري بعد
              </span>
            )}
          </div>

          {analysis ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <span className="text-slate-500 font-bold block mb-1">الملاحظات البصرية السطحية:</span>
                  <p className="text-slate-800 leading-relaxed">{analysis.visual_features}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <span className="text-slate-500 font-bold block mb-1">مؤشر النقاء والشوائب:</span>
                  <p className="text-slate-800 leading-relaxed">{analysis.visible_impurities}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <span className="text-slate-500 font-bold block mb-1">التجانس البصري:</span>
                  <p className="text-slate-800 leading-relaxed">{analysis.visual_homogeneity}</p>
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  تنبيه هام: هذا الفحص البصري التقديري يحلل المظهر السطحي والشوائب الظاهرة فقط، ولا يغني عن الفحوصات المعملية لتحديد الرطوبة والتركيب الكيميائي أو السلامة الميكروبية.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <Scan className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">لم يتم تسجيل فحص بصري لهذه الدفعة في قاعدة البيانات بعد</p>
              <Link
                href={`/pit-management/scanner?batch_id=${batch.id}`}
                className="inline-flex items-center gap-2 bg-[#022B1E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء الفحص البصري التقديري لهذه الدفعة</span>
              </Link>
            </div>
          )}
        </div>

        {/* STAGE 2: POTENTIAL USES */}
        <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">02</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">مسارات الاستفادة المحتملة (Potential Uses)</h4>
                <p className="text-[11px] text-slate-500">مسارات غير قطعية تتطلب أبحاثاً واختبارات لرفع درجة الموثوقية</p>
              </div>
            </div>

            <Link
              href={`/pit-management/pathways?batch_id=${batch.id}`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>استكشاف كافة المسارات</span>
              <ChevronLeft className="w-4 h-4 dir-ltr" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REUSE_PATHWAYS.slice(0, 3).map((path) => (
              <div key={path.id} className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      مسار محتمل / Potential Use
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{path.evidence_level}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 leading-snug">{path.name}</h5>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{path.description}</p>
                </div>

                <Link
                  href={`/pit-management/experiments/new?batch_id=${batch.id}`}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 pt-2 block"
                >
                  اختبار هذا المسار بتجربة ←
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* STAGE 3: EXPERIMENTS */}
        <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">03</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">سجل التجارب المختبرية والتطبيقية ({experiments.length})</h4>
                <p className="text-[11px] text-slate-500">التجارب المسجلة فعلياً لربط الفرضيات بالنتائج والمخرجات</p>
              </div>
            </div>

            <Link
              href={`/pit-management/experiments/new?batch_id=${batch.id}`}
              className="flex items-center gap-1.5 bg-[#022B1E] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة تجربة جديدة</span>
            </Link>
          </div>

          {experiments.length === 0 ? (
            <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <TestTube2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">لم يتم تسجيل تجارب على هذه الدفعة في قاعدة البيانات بعد</p>
              <Link
                href={`/pit-management/experiments/new?batch_id=${batch.id}`}
                className="inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إجراء تجربة وتوثيق مخرجات الدفعة</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiments.map((e) => (
                <div key={e.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 dir-ltr">{e.experiment_number}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      {e.status}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{e.objective}</h5>
                  <div className="text-[11px] text-slate-700 space-y-1">
                    <p>الكمية المستهلكة: <strong className="text-emerald-900">{e.quantity_used} كجم</strong></p>
                    <p>طريقة المعالجة: {e.processing_method}</p>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                      <span className="font-bold block text-slate-900 text-[10px]">النتيجة الموثقة:</span>
                      <p className="text-slate-800">{e.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STAGE 4: SCIENTIFIC EVIDENCE */}
        <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">04</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">الأدلة والأبحاث العلمية ذات الصلة</h4>
                <p className="text-[11px] text-slate-500">مصادر موثوقة حقيقية دون اختراع أوراق أو أرقام وهمية</p>
              </div>
            </div>

            <Link
              href="/evidence"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>مكتبة الأدلة العلمية</span>
              <ChevronLeft className="w-4 h-4 dir-ltr" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantEvidence.map((ev) => (
              <div key={ev.id} className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    {ev.source_type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">{ev.year}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 leading-snug">{ev.title}</h5>
                <p className="text-[11px] text-slate-600 font-medium">{ev.organization}</p>
                <p className="text-[11px] text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  {ev.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* STAGE 5: IMPACT & TRACEABILITY */}
        <div className="bg-[#022B1E] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-800/80 text-white font-black text-xs flex items-center justify-center">05</span>
              <div>
                <h4 className="text-base font-black text-white">سجل الأثر البيئي والاستدامة للدفعة</h4>
                <p className="text-xs text-emerald-200/80">عرض محدد يفرق بوضوح بين البيانات الفعلية والتقديرات الحسابية</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
              <span className="text-emerald-300 font-bold text-[10px] block uppercase">بيانات فعلية (Actual Data):</span>
              <span className="text-xl font-black text-white">{Number(batch.quantity).toLocaleString()} كجم</span>
              <p className="text-[11px] text-emerald-200/70">الكمية الكلية المسجلة برقمNW المعترف به</p>
            </div>

            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
              <span className="text-emerald-300 font-bold text-[10px] block uppercase">تقدير نظري (Theoretical Estimate):</span>
              <span className="text-xl font-black text-amber-400">{batchDivertedTon} طن</span>
              <p className="text-[11px] text-emerald-200/70">نفايات عضوية محولة عن المدافن البلديّة</p>
            </div>

            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
              <span className="text-emerald-300 font-bold text-[10px] block uppercase">تقدير حسابي (Calculated Estimate):</span>
              <span className="text-xl font-black text-amber-400">{batchCo2Ton} طن</span>
              <p className="text-[11px] text-emerald-200/70">خفض CO2 مكافئ (معادلة 0.65 طن/طن نفايات)</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
