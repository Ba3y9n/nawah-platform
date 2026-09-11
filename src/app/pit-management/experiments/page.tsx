"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TestTube2, PlusCircle, Loader2
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
        .select('*, batches(batch_number, source_name)')
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
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
            <TestTube2 className="w-4 h-4" />
            <span>سجل التجارب المختبرية والتطبيقية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">تجارب تحويل وتدوير النوى</h2>
          <p className="text-xs text-emerald-700 mt-1">
            كافة التجارب مسجلة ومربوطة مباشرة بدفعات النوى المسجلة بحسابك ({experiments.length} تجربة)
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
        <div className="text-center py-16 bg-white rounded-3xl border border-emerald-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-emerald-700">جاري تحميل بيانات التجارب من قاعدة البيانات...</p>
        </div>
      ) : experiments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-emerald-200 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <TestTube2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لم يتم تسجيل أي تجارب حتى الآن</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              ابدأ بتسجيل أول تجربة تحويلية أو مختبرية وربطها بدفعة نوى مسجلة بحسابك.
            </p>
          </div>
          <Link
            href="/pit-management/experiments/new"
            className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-300 transition-all shadow"
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
              className="bg-white border border-emerald-200 hover:border-amber-400 rounded-3xl p-5 shadow-lg space-y-3 transition-all"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div>
                  <span className="text-[10px] text-amber-600 font-bold block">رقم التجربة</span>
                  <span className="text-base font-black text-emerald-950 dir-ltr text-right block">{exp.experiment_number}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    {exp.status}
                  </span>
                  <Link
                    href={`/pit-management/batches/${exp.batch_id}`}
                    className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md font-bold dir-ltr"
                  >
                    {exp.batches?.batch_number || exp.batch_id?.slice(0, 8)}
                  </Link>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-emerald-950 text-sm">{exp.objective}</h4>
                
                <div className="grid grid-cols-2 gap-2 text-emerald-900">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[10px] block">الكمية المستخدمة:</span>
                    <span className="font-bold text-amber-600">{exp.quantity_used} كجم</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[10px] block">طريقة المعالجة:</span>
                    <span className="font-semibold text-emerald-950">{exp.processing_method}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-600 block">النتيجة المسجلة:</span>
                  <p className="text-slate-800 text-[11px] leading-relaxed">{exp.result}</p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-emerald-700 flex justify-between items-center border-t border-emerald-100">
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
