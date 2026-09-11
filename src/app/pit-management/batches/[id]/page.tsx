"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, MapPin, TestTube2, Sparkles, Scan, ArrowRight, 
  PlusCircle, AlertCircle, TrendingUp, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { REUSE_PATHWAYS } from "@/lib/store";

export default function BatchDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [batch, setBatch] = useState<any | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch batch
      const { data: b } = await supabase
        .from('batches')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (b) {
        setBatch(b);
        // Fetch linked experiments for this batch
        const { data: exps } = await supabase
          .from('experiments')
          .select('*')
          .eq('batch_id', b.id)
          .order('created_at', { ascending: false });

        setExperiments(exps || []);
      }

      setLoading(false);
    }

    loadData();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-emerald-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs text-emerald-700">جاري جلب تفاصيل الدفعة من قاعدة البيانات...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20 bg-white border border-emerald-200 rounded-3xl p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-950">الدفعة غير موجودة أو لا تملك صلاحية الوصول إليها</h3>
        <Link
          href="/pit-management/batches"
          className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          العودة لسجل الدفعات
        </Link>
      </div>
    );
  }

  const batchDivertedTon = (Number(batch.quantity) / 1000).toFixed(3);
  const batchCo2Ton = (Number(batchDivertedTon) * 0.65).toFixed(3);

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/pit-management/batches"
            className="p-2.5 rounded-2xl bg-slate-50 text-emerald-700 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-600 dir-ltr">{batch.batch_number}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold">
                {batch.status || 'مسجلة'}
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-2">
              <span>{batch.source_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                تاريخ الجمع: {batch.date_collected}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-400/20"
          >
            <TestTube2 className="w-4 h-4" />
            <span>إجراء تجربة على هذه الدفعة</span>
          </Link>
        </div>
      </div>

      {/* METADATA GRID & IMAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* METADATA (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-100 pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            تفاصيل شحنة ومواصفات النوى
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">الكمية الإجمالية</span>
              <span className="text-lg font-black text-amber-600">{Number(batch.quantity).toLocaleString()} كجم</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">نوع التمر</span>
              <span className="text-sm font-bold text-emerald-950">{batch.date_type}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">تاريخ الجمع</span>
              <span className="text-sm font-bold text-emerald-950">{batch.date_collected}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">حالة التنظيف</span>
              <span className="text-xs font-semibold text-emerald-900">{batch.cleaning_status}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">حالة التجفيف</span>
              <span className="text-xs font-semibold text-emerald-900">{batch.drying_status}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">نسبة الرطوبة</span>
              <span className="text-xs font-semibold text-amber-600">
                {batch.moisture ? `${batch.moisture}%` : 'غير مقاسة'}
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold">طريقة التخزين:</span>
              <span className="text-slate-800">{batch.storage_method || 'أكياس تهوية محكومة'}</span>
            </div>
            {batch.notes && (
              <div className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">ملاحظات:</span>
                <span className="text-slate-700">{batch.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* IMAGE & VISUAL SUMMARY (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-100 pb-3 flex items-center gap-2">
            <Scan className="w-4 h-4 text-amber-500" />
            صورة الدفعة والتحليل البصري
          </h3>

          <div className="bg-slate-50 border border-emerald-100 rounded-2xl p-2 text-center">
            {batch.image_url ? (
              <img
                src={batch.image_url}
                alt={batch.batch_number}
                className="max-h-48 mx-auto rounded-xl object-cover border border-emerald-200 shadow-sm"
              />
            ) : (
              <div className="py-8 text-emerald-600 text-xs font-semibold">
                لا تتوفر صورة مرفوعة لهذه الدفعة
              </div>
            )}
          </div>

          <Link
            href={`/pit-management/scanner?batch_id=${batch.id}`}
            className="block text-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            تشغيل التحليل البصري للدفعة
          </Link>
        </div>

      </div>

      {/* RE-USE PATHWAYS MATCHING THIS BATCH */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-100 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          المسارات التحويلية المقترحة لهذه الدفعة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REUSE_PATHWAYS.slice(0, 3).map((path) => (
            <div key={path.id} className="bg-slate-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {path.evidence_level}
              </span>
              <h4 className="text-xs font-bold text-emerald-950">{path.name}</h4>
              <p className="text-[11px] text-emerald-700 leading-relaxed line-clamp-2">
                {path.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIMENTS PERFORMED ON THIS BATCH */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-amber-500" />
              التجارب المختبرية والتطبيقية على هذه الدفعة ({experiments.length})
            </h3>
            <p className="text-xs text-emerald-700">كل تجربة ترتبط بالدفعة لتحديث الكميات والأثر</p>
          </div>

          <Link
            href={`/pit-management/experiments/new?batch_id=${batch.id}`}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة تجربة جديدة</span>
          </Link>
        </div>

        {experiments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-emerald-200 space-y-2">
            <TestTube2 className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-emerald-950">لم يتم تنفيذ أي تجربة على هذه الدفعة بعد</p>
            <p className="text-[11px] text-emerald-700">
              يمكنك إنشاء تجربة (مثل تحضير الفحم المنشط أو استخلاص الزيت أو التحميص) لربط نتائجها بهذه الدفعة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((e) => (
              <div key={e.id} className="bg-slate-50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dir-ltr">{e.experiment_number}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                    {e.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-emerald-950">{e.objective}</h4>
                <div className="text-[11px] text-emerald-800 space-y-1">
                  <p>الكمية المستهلكة: <strong className="text-amber-600">{e.quantity_used} كجم</strong></p>
                  <p>طريقة المعالجة: {e.processing_method}</p>
                  <p className="text-emerald-900 bg-white p-2 rounded-xl border border-emerald-100">النتيجة: {e.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ENVIRONMENTAL IMPACT OF THIS BATCH */}
      <div className="bg-emerald-950 border border-emerald-800 p-6 rounded-3xl shadow-xl flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-400 text-emerald-950 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">الأثر البيئي المحسوب لهذه الدفعة</h4>
            <p className="text-xs text-emerald-300">
              تحويل {batchDivertedTon} طن من النفايات العضوية عن المدافن ← خفض {batchCo2Ton} طن مكافئ CO2
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
