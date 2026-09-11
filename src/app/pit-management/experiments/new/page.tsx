"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  TestTube2, Save, ArrowRight, Package, AlertCircle, Info 
} from "lucide-react";
import { getBatches, createExperiment } from "@/lib/store";
import { Batch } from "@/lib/types";

function NewExperimentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch_id") || "";

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId);
  const [objective, setObjective] = useState("إنتاج الفحم المنشط وتحديد سعة الامتصاص اليودي");
  const [quantityUsed, setQuantityUsed] = useState<number | "">(5);
  const [processingMethod, setProcessingMethod] = useState("تفحيم حراري عند 700°م مع تنشيط بالبخار");
  const [duration, setDuration] = useState("48 ساعة");
  const [observations, setObservations] = useState("نقاء مرتفع، مساحة سطحية واعدة، خلو من الرماد الزائد.");
  const [result, setResult] = useState("نجاح التفحيم والحصول على فحم منشط عالي النقاء برقم يودي يتجاوز 950 ملجم/غم.");
  const [status, setStatus] = useState<'قيد التنفيذ' | 'مكتملة بنجاح' | 'مكتملة بملاحظات' | 'غير ناجحة'>("مكتملة بنجاح");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadBatches() {
      const bList = await getBatches();
      setBatches(bList);
      if (preselectedBatchId && !selectedBatchId) {
        setSelectedBatchId(preselectedBatchId);
      } else if (bList.length > 0 && !selectedBatchId) {
        setSelectedBatchId(bList[0].id);
      }
    }
    loadBatches();
  }, [preselectedBatchId]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedBatchId) {
      setErrorMsg("يرجى اختيار الدفعة المرتبطة بهذه التجربة من القائمة");
      return;
    }

    if (!quantityUsed || Number(quantityUsed) <= 0) {
      setErrorMsg("يرجى إدخال كمية مستهلكة صحيحة في التجربة");
      return;
    }

    if (selectedBatch && Number(quantityUsed) > selectedBatch.quantity) {
      setErrorMsg(`الكمية المستهلكة (${quantityUsed} كجم) أكبر من الكمية الكلية للدفعة (${selectedBatch.quantity} كجم)`);
      return;
    }

    try {
      setIsSubmitting(true);
      await createExperiment({
        batch_id: selectedBatchId,
        objective,
        quantity_used: Number(quantityUsed),
        processing_method: processingMethod,
        duration,
        observations,
        result,
        status
      });

      // Redirect to experiments list or batch detail page
      router.push(`/pit-management/batches/${selectedBatchId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء حفظ التجربة في DB: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TITLE BAR */}
      <div className="flex items-center justify-between bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link 
            href="/pit-management/experiments" 
            className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              تسجيل تجربة جديدة على دفعة النوى
              <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                Auto EXP-2026-xxxx
              </span>
            </h2>
            <p className="text-xs text-emerald-700/80">
              يرتبط الكود والمؤشرات تلقائياً بالدفعة المختارة وقاعدة البيانات
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* SELECT LINKED BATCH */}
        <div className="space-y-2 border-b border-emerald-200/60 pb-4">
          <label className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <Package className="w-4 h-4" />
            اختر الدفعة المرتبطة بهذه التجربة <span className="text-rose-400">*</span>
          </label>
          
          {batches.length === 0 ? (
            <div className="bg-emerald-50 p-4 rounded-2xl text-xs text-emerald-700 space-y-2 border border-emerald-200">
              <p>لا توجد دفعات مسجلة في قاعدة البيانات حالياً لربط التجربة بها.</p>
              <Link
                href="/pit-management/batches/new"
                className="inline-block bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                تسجيل دفعة أولاً
              </Link>
            </div>
          ) : (
            <select
              required
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-white border border-emerald-200/80 rounded-2xl px-4 py-3 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="">-- اختر الدفعة المسجلة من DB --</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.batch_number} — {b.source_name} ({b.quantity} كجم - {b.date_type})
                </option>
              ))}
            </select>
          )}

          {selectedBatch && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>الكمية المتاحة بالدفعة: <strong>{selectedBatch.quantity} كجم</strong></span>
              <span>نوع التمر: <strong>{selectedBatch.date_type}</strong></span>
              <span>المصدر: <strong>{selectedBatch.source_name}</strong></span>
            </div>
          )}
        </div>

        {/* EXPERIMENT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-700">
              هدف وعنوان التجربة <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="مثلاً: إنتاج الفحم المنشط عالي الامتصاص"
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-700">
              الكمية المستهلكة من الدفعة (KG) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              required
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 font-extrabold text-amber-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-700">طريقة المعالجة والتصنيع:</label>
            <input
              type="text"
              required
              value={processingMethod}
              onChange={(e) => setProcessingMethod(e.target.value)}
              placeholder="مثلاً: تفحيم حراري عند 700°م"
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-700">مدة التجربة والمعالجة:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="مثلاً: 24 ساعة"
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-700">حالة التجربة:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
            >
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتملة بنجاح">مكتملة بنجاح</option>
              <option value="مكتملة بملاحظات">مكتملة بملاحظات</option>
              <option value="غير ناجحة">غير ناجحة</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-700">الملاحظات أثناء التجربة:</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="سجل أي ملاحظات أو قياسات أولية..."
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-700">النتيجة النهائية للمخرج التجريبي:</label>
            <textarea
              rows={2}
              required
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="سجل النتيجة النهائية للمنتج المحول..."
              className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/pit-management/experiments"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-800 transition-colors"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || batches.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black px-8 py-3 rounded-2xl text-xs transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "جاري الحفظ..." : "حفظ التجربة في قاعدة البيانات"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

export default function NewExperimentPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-emerald-700 text-xs animate-pulse">جاري تحميل نموذج التجربة...</div>}>
      <NewExperimentForm />
    </Suspense>
  );
}
