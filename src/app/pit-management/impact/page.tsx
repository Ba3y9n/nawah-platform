"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Leaf, Package, TestTube2, 
  AlertCircle, PlusCircle, Database, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ImpactPage() {
  const [summary, setSummary] = useState({
    total_registered_kg: 0,
    total_batches_count: 0,
    total_experiments_count: 0,
    total_reused_kg: 0,
    landfill_diverted_ton: 0,
    estimated_co2_reduction_ton: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: batches } = await supabase
          .from('batches')
          .select('quantity')
          .eq('user_id', user.id);

        const { data: experiments } = await supabase
          .from('experiments')
          .select('quantity_used')
          .eq('user_id', user.id);

        const total_registered_kg = batches?.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0) || 0;
        const total_batches_count = batches?.length || 0;
        const total_experiments_count = experiments?.length || 0;
        const total_reused_kg = experiments?.reduce((sum, e) => sum + (Number(e.quantity_used) || 0), 0) || 0;

        const landfill_diverted_ton = Number((total_registered_kg / 1000).toFixed(3));
        const estimated_co2_reduction_ton = Number((landfill_diverted_ton * 0.65).toFixed(3));

        setSummary({
          total_registered_kg,
          total_batches_count,
          total_experiments_count,
          total_reused_kg,
          landfill_diverted_ton,
          estimated_co2_reduction_ton
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const remainingKg = Math.max(0, summary.total_registered_kg - summary.total_reused_kg);

  return (
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-emerald-950 text-white border border-emerald-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>حاسبة ومؤشرات الأثر البيئي والاقتصادي</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">قياس الأثر الحي لنوى التمر</h2>
          <p className="text-xs text-emerald-300 mt-1">
            مؤشرات تراكمية حية تحسب المجموع الفعلي للكميات المسجلة والمعاد استخدامها من قاعدة البيانات
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل دفعة لزيادة الأثر</span>
        </Link>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>إجمالي الكمية المسجلة</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900 dir-ltr text-right">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_registered_kg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600">مجموع كميات الدفعات المسجلة بحسابك</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-amber-600">
            <span>الكمية المعاد استخدامها</span>
            <TestTube2 className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-500 dir-ltr text-right">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_reused_kg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600">المستهلكة في التجارب والتطبيقات</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>الكمية المتبقية المتاحة</span>
            <Database className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 dir-ltr text-right">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${remainingKg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600">متاحة لمشاريع واستخدامات جديدة</p>
        </div>

      </div>

      {/* DETAILED ENVIRONMENTAL CONVERSION MATH */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-emerald-100 pb-3 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          المؤشرات البيئية المحسوبة من الكميات الفعلية
        </h3>

        {summary.total_registered_kg === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-xs font-bold text-slate-900">لا توجد بيانات بعد في قاعدة البيانات</p>
            <p className="text-[11px] text-emerald-700 max-w-sm mx-auto">
              تظهر الحسابات هنا فور تسجليك أول دفعة وتجربة حقيقية في النظام.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-emerald-700 font-bold block">النفايات المحولة عن المدافن:</span>
              <p className="text-2xl font-black text-slate-900">{summary.landfill_diverted_ton} طن</p>
              <p className="text-[11px] text-emerald-700">
                منع تراكم المادة العضوية الصعبة التحلل في مدافن البلديات
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-emerald-700 font-bold block">الحد من انبعاثات الميثان والـ CO2 المكافئ:</span>
              <p className="text-2xl font-black text-amber-600">{summary.estimated_co2_reduction_ton} طن CO2e</p>
              <p className="text-[11px] text-emerald-700">
                معامل التحويل البيئي: 1 طن مخلفات نخيل تجنب 0.65 طن CO2e
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
