"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TestTube2, PlusCircle, Loader2, Package, Sparkles, ChevronLeft, ArrowRight, CheckCircle2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ExperimentsListPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExperiments = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('experiments')
        .select('*, batches(batch_number, source_name, date_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setExperiments(data || []);
    } else {
      setExperiments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <TestTube2 className="w-3.5 h-3.5" />
            <span>المرحلة 05 من رحلة النواة: التجارب والتطبيق</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">تجارب تحويل وتدوير النوى الموثقة</h2>
          <p className="text-xs text-slate-500 mt-1">
            سجل التجارب المعملية والميدانية المربوطة بدفعات النوى لتوثيق نتائج الاختبارات ومستويات الجودة ({experiments.length} تجربة).
          </p>
        </div>

        <Link
          href="/pit-management/experiments/new"
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>تسجيل تجربة جديدة</span>
        </Link>
      </div>

      {/* EXPERIMENTS LIST OR EMPTY STATE */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">جاري تحميل سجل التجارب المعملية...</p>
        </div>
      ) : experiments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <TestTube2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لم يتم تسجيل أي تجارب معملية حتى الآن</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ابدأ بتسجيل أول تجربة تحويلية أو اختبار معملي وربطه بدفعة نوى مسجلة لتسجيل المخرجات وقياس الأثر.
            </p>
          </div>
          <Link
            href="/pit-management/experiments/new"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs hover:bg-emerald-800 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            إضافة أول تجربة معملية الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-6 shadow-sm space-y-4 transition-all"
            >
              {/* EXPERIMENT HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">رقم التجربة</span>
                  <span className="text-base font-black text-emerald-950 dir-ltr text-right block">{exp.experiment_number}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {exp.status || "قيد التقييم"}
                  </span>
                  <Link
                    href={`/pit-management/batches/${exp.batch_id}`}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl font-bold dir-ltr transition-colors"
                  >
                    {exp.batches?.batch_number || exp.batch_id?.slice(0, 8)}
                  </Link>
                </div>
              </div>

              {/* EXPERIMENT TIMELINE & DETAILS */}
              <div className="space-y-3 text-xs">
                <h4 className="font-black text-emerald-950 text-sm leading-snug">{exp.objective}</h4>
                
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold block">الكمية المستهلكة:</span>
                    <span className="font-black text-emerald-700 text-sm">{exp.quantity_used} كجم</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold block">طريقة المعالجة:</span>
                    <span className="font-bold text-slate-800">{exp.processing_method}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 block">النتيجة المسجلة (Validated Result):</span>
                  <p className="text-slate-800 text-xs leading-relaxed font-medium">
                    {exp.result || "لم يتم تسجيل النتائج بعد."}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 font-medium flex justify-between items-center border-t border-slate-100">
                <span>تاريخ التوثيق: {new Date(exp.created_at).toLocaleDateString('ar-SA')}</span>
                <span>مدة التجربة: {exp.duration || "غير محددة"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEXT STEP TO IMPACT */}
      <div className="bg-emerald-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">المرحلة الأخيرة في الرحلة</span>
          <h4 className="text-sm font-black text-white mt-0.5">قياس الأثر البيئي والعائد التراكمي للتجارب والدفعات</h4>
        </div>

        <Link
          href="/pit-management/impact"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md shrink-0"
        >
          <span>عرض شاشة قياس الأثر الرقمي</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
