"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Leaf, Package, TestTube2, 
  AlertCircle, PlusCircle, Database, Loader2, Info, ShieldAlert, ChevronLeft
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
        realSummary = await getImpactSummary();
      }

      setSummary(realSummary);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      
      {/* TITLE BANNER */}
      <div className="bg-emerald-950 text-white border border-emerald-900 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>المرحلة 06 والأخيرة: قياس الأثر والنتائج</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">شاشة قياس الأثر البيئي والاقتصادي التراكمي</h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            مؤشرات محتسبة بناءً على تسلسل رحلة الدفعات والتجارب المسجلة في المنظومة الرقمية
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>تسجيل دفعة لزيادة الأثر</span>
        </Link>
      </div>

      {/* ACTUAL DATA METRICS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>بيانات فعلية موثقة (Actual Data):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>الكمية الكلية المسجلة</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_registered_kg.toLocaleString()} كجم`}
            </div>
            <p className="text-[11px] text-slate-400">دفعات موثقة برمز NW الفردي</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>الدفعات المسجلة</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : summary.total_batches_count}
            </div>
            <p className="text-[11px] text-slate-400">سجلات مصانع ومراكز تجميع</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>التجارب الموثقة</span>
              <TestTube2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : summary.total_experiments_count}
            </div>
            <p className="text-[11px] text-slate-400">اختبارات معملية وتطبيقية</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>الكمية الموثقة بالتجارب</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 dir-ltr text-right">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.total_reused_kg.toLocaleString()} كجم`}
            </div>
            <p className="text-[11px] text-slate-400">كميات مستخدمة في التجارب</p>
          </div>
        </div>
      </div>

      {/* ESTIMATED MODEL CALCULATIONS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>تقديرات حسابية ونظرية (Model Calculations):</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-900">
              <span className="bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">تقدير تحويلي نظري (Theoretical Calculation)</span>
              <Leaf className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-emerald-950 dir-ltr text-right pt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.landfill_diverted_ton} طن`}
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              تحويل تحويلي مباشر: {summary.total_registered_kg.toLocaleString()} كجم = {summary.landfill_diverted_ton} طن متري من النفايات العضوية المحولة عن المدافن البلديّة.
            </p>
          </div>

          <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-900">
              <span className="bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">تقدير حسابي محتمل للانبعاثات المتجنبة</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-emerald-950 dir-ltr text-right pt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${summary.estimated_co2_reduction_ton} طن CO2e`}
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              تقدير حسابي محتمل للانبعاثات المتجنبة عند تفادي التحلل اللاهوائي (معامل تقديري مستخدم في هذا النموذج: 0.65 طن CO2e / طن مخلفات عضوية).
            </p>
          </div>
        </div>
      </div>

      {/* METHODOLOGY NOTICE */}
      <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-3xl text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>إيضاح المنهجية وحدود النموذج:</span>
        </div>
        <p className="leading-relaxed font-medium text-amber-900/90">
          • <strong>المعامل المستعمل (0.65 طن CO2e / طن):</strong> هو معامل تقديري مستخدم في هذا النموذج لتوضيح العائد البيئي التخميني.<br/>
          • <strong>دراسات تقييم دورة الحياة (LCA):</strong> الحسابات النهائية الصارمة تتطلب إجراء التقييم المعملي المخصص لكل مسار تحويلي (كالتفحيم الحراري أو الاستخلاص).
        </p>
      </div>

    </div>
  );
}
