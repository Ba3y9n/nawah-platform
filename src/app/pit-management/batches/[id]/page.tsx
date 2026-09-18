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
  const [activeStepTab, setActiveStepTab] = useState(1);

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
        <p className="text-xs text-slate-500 font-medium">جاري تحميل رحلة الدفعة...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">الدفعة غير موجودة</h3>
        <Link href="/pit-management/batches" className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold">
          العودة لسجل الدفعات
        </Link>
      </div>
    );
  }

  const batchDivertedTon = (Number(batch.quantity) / 1000).toFixed(3);
  const batchCo2Ton = (Number(batchDivertedTon) * 0.65).toFixed(3);
  const relevantEvidence = EVIDENCE_SOURCES.slice(0, 2);

  const stagesNav = [
    { id: 1, step: "01", name: "تسجيل الدفعة", isDone: true },
    { id: 2, step: "02", name: "التحليل البصري", isDone: !!analysis },
    { id: 3, step: "03", name: "الاستخدامات المحتملة", isDone: true },
    { id: 4, step: "04", name: "التجارب", isDone: experiments.length > 0 },
    { id: 5, step: "05", name: "الأدلة والأثر", isDone: Number(batch.quantity) > 0 }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" dir="rtl">
      
      {/* HEADER EDITORIAL BANNER */}
      <div className="bg-emerald-950 text-white border border-emerald-900 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-900 pb-4">
          <div className="flex items-center gap-4">
            <Link href="/pit-management/batches" className="p-2.5 rounded-2xl bg-white/10 text-emerald-200 hover:bg-white/20 transition-colors border border-white/10">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-black text-white dir-ltr">{batch.batch_number}</span>
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-800 text-emerald-200 font-bold">
                  {batch.status || 'مسجلة رقمياً'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1 font-medium">
                تم إنشاء سجل رقمي للدفعة داخل نواة. يمكنك الآن متابعة بياناتها وما يرتبط بها من تحليل وأدلة وتجارب ونتائج عند توفرها.
              </p>
              <p className="text-[10px] text-amber-300 font-bold mt-1">
                {batch.source_name} — {batch.quantity} كجم ({batch.date_type}) • تاريخ الجمع: {batch.date_collected}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/pit-management/scanner?batch_id=${batch.id}`} className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors border border-white/10">
              فحص بصري
            </Link>
            <Link href={`/pit-management/experiments/new?batch_id=${batch.id}`} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md">
              إجراء تجربة
            </Link>
          </div>
        </div>

        {/* NUCLEUS PROCESS LINE (INTERACTIVE NAV) */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">اختر المرحلة لاستعراض تفاصيلها (Nucleus Process Line):</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stagesNav.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStepTab(st.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  activeStepTab === st.id
                    ? "bg-white text-emerald-950 border-white shadow-lg font-black"
                    : st.isDone 
                      ? "bg-emerald-900/60 text-white border-emerald-800 hover:bg-emerald-900" 
                      : "bg-emerald-950/40 text-emerald-400/50 border-emerald-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-black ${activeStepTab === st.id ? "text-emerald-700" : "text-amber-400"}`}>{st.step}</span>
                  {st.isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${activeStepTab === st.id ? "text-emerald-700" : "text-emerald-400"}`} />}
                </div>
                <span className="text-xs font-bold block">{st.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DYNAMIC TAB CONTENT PANEL */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* TAB 1: BATCH METADATA */}
        {activeStepTab === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-black text-emerald-950 border-b border-slate-100 pb-3">01 مواصفات وسجل الدفعة (Batch Record)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">الكمية</span><span className="text-lg font-black text-emerald-950">{Number(batch.quantity).toLocaleString()} كجم</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">الصنف</span><span className="text-xs font-bold text-slate-800">{batch.date_type}</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">التنظيف</span><span className="text-xs font-bold text-slate-800">{batch.cleaning_status}</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">التجفيف</span><span className="text-xs font-bold text-slate-800">{batch.drying_status}</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">الرطوبة</span><span className="text-xs font-bold text-emerald-700">{batch.moisture ? `${batch.moisture}%` : 'تقديرية'}</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">التخزين</span><span className="text-xs font-bold text-slate-800">{batch.storage_method || 'أكياس تهوية'}</span></div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL ANALYSIS */}
        {activeStepTab === 2 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-black text-emerald-950 border-b border-slate-100 pb-3">02 نتيجة التحليل البصري بالذكاء الاصطناعي</h3>
            {analysis ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 font-bold block mb-1">الملاحظات السطحية:</span><p className="text-slate-800 font-medium">{analysis.visual_features}</p></div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 font-bold block mb-1">مؤشر النقاء:</span><p className="text-slate-800 font-medium">{analysis.visible_impurities}</p></div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 font-bold block mb-1">التجانس البصري:</span><p className="text-slate-800 font-medium">{analysis.visual_homogeneity}</p></div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl text-center space-y-3">
                <p className="text-slate-600 font-medium">لم يتم تسجيل فحص بصري لهذه الدفعة بعد.</p>
                <Link href={`/pit-management/scanner?batch_id=${batch.id}`} className="inline-block bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl text-xs">بدء الفحص البصري الآن</Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POTENTIAL PATHWAYS */}
        {activeStepTab === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-black text-emerald-950 border-b border-slate-100 pb-3">03 مسارات الاستفادة المحتملة (Potential Uses)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {REUSE_PATHWAYS.slice(0, 3).map((path) => (
                <div key={path.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">مسار محتمل</span>
                  <h4 className="font-bold text-emerald-950">{path.name}</h4>
                  <p className="text-slate-600 font-medium line-clamp-2">{path.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXPERIMENTS */}
        {activeStepTab === 4 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-black text-emerald-950 border-b border-slate-100 pb-3">04 سجل التجارب الموثقة ({experiments.length})</h3>
            {experiments.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl text-center space-y-3">
                <p className="text-slate-600 font-medium">لا توجد تجارب موثقة لهذه الدفعة بعد.</p>
                <Link href={`/pit-management/experiments/new?batch_id=${batch.id}`} className="inline-block bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl text-xs">توثيق تجربة جديدة</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experiments.map((e) => (
                  <div key={e.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-black text-emerald-950 dir-ltr block">{e.experiment_number}</span>
                    <p className="font-bold text-slate-800">{e.objective}</p>
                    <p className="text-slate-600 font-medium">النتيجة: {e.result}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: IMPACT & EVIDENCE */}
        {activeStepTab === 5 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h3 className="text-base font-black text-emerald-950 border-b border-slate-100 pb-3">05 الأثر البيئي والمصادر الموثقة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">كمية فعلية</span><span className="text-lg font-black text-emerald-950">{Number(batch.quantity).toLocaleString()} كجم</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">تقدير محول</span><span className="text-lg font-black text-emerald-950">{batchDivertedTon} طن</span></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><span className="text-slate-400 block text-[10px] font-bold">انبعاثات متجنبة</span><span className="text-lg font-black text-emerald-700">{batchCo2Ton} طن CO2e</span></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
