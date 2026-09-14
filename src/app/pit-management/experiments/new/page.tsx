"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  TestTube2, Save, ArrowRight, Package, AlertCircle, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";
import { createExperiment, getBatches } from "@/lib/store";

function NewExperimentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch_id") || "";

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId);
  const [objective, setObjective] = useState("إنتاج الفحم المنشط وتحديد سعة الامتصاص اليودي");
  const [quantityUsed, setQuantityUsed] = useState<number | "">(5);
  const [processingMethod, setProcessingMethod] = useState("تفحيم حراري عند 700°م مع تنشيط بالبخار");
  const [duration, setDuration] = useState("48 ساعة");
  const [observations, setObservations] = useState("نقاء مرتفع، مساحة سطحية واعدة، خلو من الرماد الزائد.");
  const [result, setResult] = useState("نجاح التفحيم والحصول على فحم منشط عالي النقاء برقم يودي يتجاوز 950 ملجم/غم.");
  const [status, setStatus] = useState<'قيد التنفيذ' | 'مكتملة بنجاح' | 'مكتملة بملاحظات' | 'غير ناجحة'>("مكتملة بنجاح");
  
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadBatches() {
      setLoadingBatches(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      let bList: any[] = [];
      if (user) {
        try {
          const { data } = await supabase
            .from('batches')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          bList = data || [];
        } catch (e) {}
      }

      if (!bList || bList.length === 0) {
        bList = await getBatches();
      }

      setBatches(bList);
      if (preselectedBatchId && !selectedBatchId) {
        setSelectedBatchId(preselectedBatchId);
      } else if (bList && bList.length > 0 && !selectedBatchId) {
        setSelectedBatchId(bList[0].id);
      }
      setLoadingBatches(false);
    }
    loadBatches();
  }, [preselectedBatchId]);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pending = localStorage.getItem('nawah_pending_experiment_data');
        if (pending) {
          const data = JSON.parse(pending);
          if (data.selectedBatchId) setSelectedBatchId(data.selectedBatchId);
          if (data.objective) setObjective(data.objective);
          if (data.quantityUsed) setQuantityUsed(data.quantityUsed);
          if (data.processingMethod) setProcessingMethod(data.processingMethod);
          if (data.duration) setDuration(data.duration);
          if (data.observations) setObservations(data.observations);
          if (data.result) setResult(data.result);
          if (data.status) setStatus(data.status);
          localStorage.removeItem('nawah_pending_experiment_data');
          localStorage.removeItem('nawah_pending_action');
        }
      } catch(e) {}
    }
  }, []);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");

    if (!selectedBatchId) {
      setErrorMsg("يرجى اختيار الدفعة المرتبطة بهذه التجربة من القائمة");
      return;
    }

    if (!quantityUsed || Number(quantityUsed) <= 0) {
      setErrorMsg("يرجى إدخال كمية مستهلكة صحيحة في التجربة");
      return;
    }

    if (selectedBatch && Number(quantityUsed) > Number(selectedBatch.quantity)) {
      setErrorMsg(`الكمية المستهلكة (${quantityUsed} كجم) أكبر من الكمية الكلية للدفعة (${selectedBatch.quantity} كجم)`);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsSubmitting(false);
        setShowAuthModal(true);
        // Save form state to local storage to persist after login
        if (typeof window !== 'undefined') {
          try {
            // Save basic form fields if needed
            localStorage.setItem('nawah_pending_action', 'new_experiment');
          } catch(e) {}
        }
        return;
      }

      const newExp = await createExperiment({
        batch_id: selectedBatchId,
        objective,
        quantity_used: Number(quantityUsed),
        processing_method: processingMethod,
        duration,
        observations: observations || undefined,
        result,
        status
      });

      router.push(`/pit-management/batches/${selectedBatchId}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء حفظ التجربة: " + (err.message || err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TITLE BAR */}
      <div className="flex items-center justify-between bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link 
            href="/pit-management/experiments" 
            className="p-2.5 rounded-2xl bg-slate-50 text-emerald-700 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              تسجيل تجربة جديدة على دفعة النوى
              <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full">
                Auto EXP-2026-xxxx
              </span>
            </h2>
            <p className="text-xs text-emerald-700">
              يرتبط الكود والمؤشرات تلقائياً بالدفعة المختارة وقاعدة البيانات الحقيقية
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* SELECT LINKED BATCH */}
        <div className="space-y-2 border-b border-emerald-100 pb-4">
          <label className="text-xs font-bold text-emerald-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            اختر الدفعة المرتبطة بهذه التجربة <span className="text-rose-500">*</span>
          </label>
          
          {loadingBatches ? (
            <div className="text-xs text-emerald-700 flex items-center gap-2 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري جلب الدفعات المسجلة بحسابك...
            </div>
          ) : batches.length === 0 ? (
            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-emerald-900 space-y-2 border border-emerald-200">
              <p>لا توجد دفعات مسجلة في قاعدة البيانات حالياً بحسابك لربط التجربة بها.</p>
              <Link
                href="/pit-management/batches/new"
                className="inline-block bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-300 transition-colors"
              >
                تسجيل دفعة أولاً
              </Link>
            </div>
          ) : (
            <select
              required
              disabled={isSubmitting}
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-4 py-3 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 font-bold disabled:opacity-50"
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
            <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <span>الكمية المتاحة بالدفعة: <strong>{selectedBatch.quantity} كجم</strong></span>
              <span>نوع التمر: <strong>{selectedBatch.date_type}</strong></span>
              <span>المصدر: <strong>{selectedBatch.source_name}</strong></span>
            </div>
          )}
        </div>

        {/* EXPERIMENT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-900">
              هدف وعنوان التجربة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="مثلاً: إنتاج الفحم المنشط عالي الامتصاص"
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900">
              الكمية المستهلكة من الدفعة (KG) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              required
              disabled={isSubmitting}
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 font-extrabold text-amber-600 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900">طريقة المعالجة والتصنيع:</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={processingMethod}
              onChange={(e) => setProcessingMethod(e.target.value)}
              placeholder="مثلاً: تفحيم حراري عند 700°م"
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900">مدة التجربة والمعالجة:</label>
            <input
              type="text"
              disabled={isSubmitting}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="مثلاً: 24 ساعة"
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900">حالة التجربة:</label>
            <select
              value={status}
              disabled={isSubmitting}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            >
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتملة بنجاح">مكتملة بنجاح</option>
              <option value="مكتملة بملاحظات">مكتملة بملاحظات</option>
              <option value="غير ناجحة">غير ناجحة</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-900">الملاحظات أثناء التجربة:</label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="سجل أي ملاحظات أو قياسات أولية..."
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 resize-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-emerald-900">النتيجة النهائية للمخرج التجريبي:</label>
            <textarea
              rows={2}
              required
              disabled={isSubmitting}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="سجل النتيجة النهائية للمنتج المحول..."
              className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 resize-none disabled:opacity-50"
            />
          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/pit-management/experiments"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || batches.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black px-8 py-3 rounded-2xl text-xs transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ التجربة في قاعدة البيانات</span>
              </>
            )}
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
