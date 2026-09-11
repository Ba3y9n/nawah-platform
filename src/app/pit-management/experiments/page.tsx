"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TestTube2, PlusCircle, Package, ArrowLeft, 
  Calendar, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import { getExperiments, subscribeToStore } from "@/lib/store";
import { Experiment } from "@/lib/types";

export default function ExperimentsListPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExperiments = async () => {
    setLoading(true);
    const data = await getExperiments();
    setExperiments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExperiments();
    const unsubscribe = subscribeToStore(() => {
      loadExperiments();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <TestTube2 className="w-4 h-4" />
            <span>سجل التجارب المختبرية والتطبيقية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">تجارب تحويل وتدوير النوى</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            كافة التجارب مسجلة ومربوطة مباشرة بدفعات النوى المسجلة في قاعدة البيانات ({experiments.length} تجربة)
          </p>
        </div>

        <Link
          href="/pit-management/experiments/new"
          className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-amber-400/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل تجربة جديدة</span>
        </Link>
      </div>

      {/* EXPERIMENTS LIST OR EMPTY STATE */}
      {loading ? (
        <div className="text-center py-16 bg-slate-50/60 rounded-3xl border border-emerald-200/40">
          <p className="text-xs text-emerald-700 animate-pulse">جاري تحميل بيانات التجارب من قاعدة البيانات...</p>
        </div>
      ) : experiments.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/80 border border-dashed border-emerald-200/70 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-950/40 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-800/40">
            <TestTube2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لم يتم تسجيل أي تجارب حتى الآن</h3>
            <p className="text-xs text-emerald-700/80 max-w-md mx-auto">
              ابدأ بتسجيل أول تجربة تحويلية أو مختبرية وربطها بدفعة نوى من قاعدة البيانات.
            </p>
          </div>
          <Link
            href="/pit-management/experiments/new"
            className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-300 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            تسجيل أول تجربة الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-50/90 border border-emerald-200/70 hover:border-amber-400/60 rounded-3xl p-5 shadow-lg space-y-3 transition-all"
            >
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">رقم التجربة</span>
                  <span className="text-base font-black text-emerald-950 dir-ltr text-right block">{exp.experiment_number}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
                    {exp.status}
                  </span>
                  <Link
                    href={`/pit-management/batches/${exp.batch_id}`}
                    className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-bold dir-ltr"
                  >
                    {exp.batch_number}
                  </Link>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-emerald-950 text-sm">{exp.objective}</h4>
                
                <div className="grid grid-cols-2 gap-2 text-emerald-800">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-900">
                    <span className="text-emerald-600/80 text-[10px] block">الكمية المستخدمة:</span>
                    <span className="font-bold text-amber-300">{exp.quantity_used} كجم</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-900">
                    <span className="text-emerald-600/80 text-[10px] block">طريقة المعالجة:</span>
                    <span className="font-semibold text-emerald-950">{exp.processing_method}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 block">النتيجة المسجلة:</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{exp.result}</p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-emerald-600/70 flex justify-between items-center border-t border-emerald-900/60">
                <span>تاريخ الإنشاء: {new Date(exp.created_at).toLocaleDateString('ar-SA')}</span>
                <span>مدة التجربة: {exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
