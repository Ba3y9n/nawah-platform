"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Leaf, Package, TestTube2, 
  AlertCircle, PlusCircle, Database, Loader2, Info
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getImpactSummary } from "@/lib/store";

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
      let realSummary = null;

      try {
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

          realSummary = {
            total_registered_kg,
            total_batches_count,
            total_experiments_count,
            total_reused_kg,
            landfill_diverted_ton,
            estimated_co2_reduction_ton
          };
        }
      } catch (e) {
        console.warn("Supabase fetch notice:", e);
      }

      if (!realSummary || realSummary.total_registered_kg === 0) {
        // Fallback to aggregated local store metrics
        realSummary = await getImpactSummary();
      }

      setSummary(realSummary);
      setLoading(false);
    }

    loadData();
  }, []);

  const remainingKg = Math.max(0, summary.total_registered_kg - summary.total_reused_kg);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* TITLE BANNER */}
      <div className="bg-[#022B1E] text-white border border-emerald-900 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>حاسبة ومؤشرات الأثر البيئي والاقتصادي التراكمية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">قياس الأثر الرقمي المستند للبيانات</h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            التمييز البصري بين البيانات الفعلية، التقديرات النظرية، والحسابية التراكمية
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-950/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل دفعة لزيادة الأثر</span>
        </Link>
      </div>

      {/* ACTUAL DATA METRICS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>بيانات فعلية (Actual Data):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-emerald-100/60 p-5 rounded-3xl shadow-lg shadow-emerald-900/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>إجمالي الكمية المسجلة</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_registered_kg.toLocaleString()} كجم`}
            </div>
            <p className="text-[11px] text-slate-500">مجموع الدفعات ذات الأكواد الفريدة (NW)</p>
          </div>

          <div className="bg-white border border-emerald-100/60 p-5 rounded-3xl shadow-lg shadow-emerald-900/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>عدد الدفعات المسجلة</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : summary.total_batches_count}
            </div>
            <p className="text-[11px] text-slate-500">دفعات محددة بالصنع والمصدر</p>
          </div>

          <div className="bg-white border border-emerald-100/60 p-5 rounded-3xl shadow-lg shadow-emerald-900/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>عدد التجارب الموثقة</span>
              <TestTube2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : summary.total_experiments_count}
            </div>
            <p className="text-[11px] text-slate-500">تجارب مربوطة بأكواد EXP</p>
          </div>

          <div className="bg-white border border-emerald-100/60 p-5 rounded-3xl shadow-lg shadow-emerald-900/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>الكمية المعاد استخدامها</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_reused_kg.toLocaleString()} كجم`}
            </div>
            <p className="text-[11px] text-slate-500">الكمية المستهلكة في التجارب</p>
          </div>
        </div>
      </div>

      {/* ESTIMATED METRICS CARDS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>تقديرات نظرية وحسابية (Estimates):</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-lg space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-900">
              <span className="bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">تقدير نظري (Theoretical Estimate)</span>
              <Leaf className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 dir-ltr text-right pt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.landfill_diverted_ton} طن`}
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              كمية النفايات العضوية المحولة عن المدافن البلديّة بناءً على إجمالي الدفعات المسجلة.
            </p>
          </div>

          <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-lg space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-900">
              <span className="bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">تقدير حسابي (Calculated Estimate)</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 dir-ltr text-right pt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.estimated_co2_reduction_ton} طن`}
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              تخفيض غازات الانبعاثات الكربونية المكافئة CO2e (معادلة 0.65 طن CO2e / طن نفايات عضوية).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
