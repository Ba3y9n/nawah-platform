"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Leaf, Building2, Package, TestTube2, 
  ShieldCheck, AlertCircle, PlusCircle, ArrowLeft, Database
} from "lucide-react";
import { getImpactSummary, subscribeToStore } from "@/lib/store";
import { ImpactSummary } from "@/lib/types";

export default function ImpactPage() {
  const [summary, setSummary] = useState<ImpactSummary>({
    total_registered_kg: 0,
    total_batches_count: 0,
    total_experiments_count: 0,
    total_sources_count: 0,
    total_reused_kg: 0,
    landfill_diverted_ton: 0,
    estimated_co2_reduction_ton: 0
  });

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const sum = await getImpactSummary();
    setSummary(sum);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(() => {
      loadData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const remainingKg = Math.max(0, summary.total_registered_kg - summary.total_reused_kg);

  return (
    <div className="space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-200/80 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>حاسبة ومؤشرات الأثر البيئي والاقتصادي</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">قياس الأثر الحي لنوى التمر</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            مؤشرات تراكمية حية تحسب المجموع الفعلي للكميات المسجلة والمعاد استخدامها من DB
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل دفعة لزيادة الأثر</span>
        </Link>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
            <span>إجمالي الكمية المسجلة</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-950 dir-ltr text-right">
            {loading ? "..." : `${summary.total_registered_kg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600/70">مجموع كميات الدفعات بـ DB</p>
        </div>

        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-amber-400">
            <span>الكمية المعاد استخدامها</span>
            <TestTube2 className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-300 dir-ltr text-right">
            {loading ? "..." : `${summary.total_reused_kg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600/70">المستهلكة في التجارب والتطبيقات</p>
        </div>

        <div className="bg-slate-50/90 border border-emerald-200/70 p-5 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
            <span>الكمية المتبقية المتاحة</span>
            <Database className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 dir-ltr text-right">
            {loading ? "..." : `${remainingKg.toLocaleString()} كجم`}
          </div>
          <p className="text-[11px] text-emerald-600/70">متاحة لمشاريع واستخدامات جديدة</p>
        </div>

      </div>

      {/* DETAILED ENVIRONMENTAL CONVERSION MATH */}
      <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          المؤشرات البيئية المحسوبة من الكميات الفعلية
        </h3>

        {summary.total_registered_kg === 0 ? (
          <div className="text-center py-10 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200/60 space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-xs font-bold text-emerald-800">لا توجد بيانات بعد في قاعدة البيانات</p>
            <p className="text-[11px] text-emerald-600/80 max-w-sm mx-auto">
              تظهر الحسابات هنا فور تسجليك أول دفعة وتجربة حقيقية في النظام.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
              <span className="text-emerald-600/80 font-bold block">النفايات المحولة عن المدافن:</span>
              <p className="text-2xl font-black text-emerald-950">{summary.landfill_diverted_ton} طن</p>
              <p className="text-[11px] text-emerald-700/70">
                منع تراكم المادة العضوية الصعبة التحلل في مدافن البلديات
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900 space-y-1">
              <span className="text-emerald-600/80 font-bold block">الحد من انبعاثات الميثان والـ CO2 المكافئ:</span>
              <p className="text-2xl font-black text-amber-300">{summary.estimated_co2_reduction_ton} طن CO2e</p>
              <p className="text-[11px] text-emerald-700/70">
                معامل التحويل البيئي: 1 طن مخلفات نخيل تجنب 0.65 طن CO2e
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
