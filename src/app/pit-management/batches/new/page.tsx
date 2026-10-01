"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, Camera, Upload, ArrowRight, Save, 
  MapPin, AlertCircle, Info, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";
import { createBatch, SAUDI_REGIONS, SAUDI_CITIES, VERIFIED_SOURCES } from "@/lib/store";

export default function NewBatchPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [sourceId, setSourceId] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState(SAUDI_REGIONS[0].id);
  const [selectedCityId, setSelectedCityId] = useState(
    SAUDI_CITIES.find(c => c.region_id === SAUDI_REGIONS[0].id)?.id || ""
  );
  const [quantity, setQuantity] = useState<number | "">(100);
  const [dateType, setDateType] = useState("خلاص");
  const [dateCollected, setDateCollected] = useState(new Date().toISOString().split('T')[0]);
  const [cleaningStatus, setCleaningStatus] = useState<'مغسولة' | 'غير مغسولة' | 'مجففة ومفروزة'>("مغسولة");
  const [dryingStatus, setDryingStatus] = useState<'مجففة شمسياً' | 'مجففة برنفر' | 'رطوبة عالية'>("مجففة شمسياً");
  const [moisture, setMoisture] = useState<number | "">(12);
  const [storageMethod, setStorageMethod] = useState("أكياس خيش تهوية محكومة");
  const [notes, setNotes] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pending = localStorage.getItem('nawah_pending_batch_data');
        if (pending) {
          const data = JSON.parse(pending);
          if (data.sourceName) setSourceName(data.sourceName);
          if (data.quantity) setQuantity(data.quantity);
          if (data.dateType) setDateType(data.dateType);
          if (data.cleaningStatus) setCleaningStatus(data.cleaningStatus);
          if (data.dryingStatus) setDryingStatus(data.dryingStatus);
          if (data.moisture) setMoisture(data.moisture);
          if (data.storageMethod) setStorageMethod(data.storageMethod);
          if (data.notes) setNotes(data.notes);
          localStorage.removeItem('nawah_pending_batch_data');
          localStorage.removeItem('nawah_pending_action');
        }
      } catch(e) {}
    }
  }, []);

  const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);

  const handleSelectSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSourceId(sId);
    if (sId) {
      const src = VERIFIED_SOURCES.find(s => s.id === sId);
      if (src) {
        setSourceName(src.name);
        setSelectedRegionId(src.region_id);
        setSelectedCityId(src.city_id);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");

    if (!sourceName.trim()) {
      setErrorMsg("يرجى تحديد أو كتابة اسم مصدر النوى (المصنع/المزرعة/المجمع)");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setErrorMsg("يرجى أدخال كمية نوات صحيحة وأكبر من الصفر");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      console.log('[NAWAH AUTH DEBUG]', {
        isAuthenticated: !!user,
        userId: user?.id || null,
        userError: userError?.message || null,
        sessionExists: !!session,
        sessionUserId: session?.user?.id || null,
        sessionError: sessionError?.message || null,
        emailConfirmed: !!user?.email_confirmed_at
      });

      if (!user) {
        console.warn('[NAWAH AUTH DEBUG] No authenticated user returned by supabase.auth.getUser(). Triggering Auth Modal.');
        setIsSubmitting(false);
        setShowAuthModal(true);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nawah_pending_action', 'new_batch');
          } catch(e) {}
        }
        return;
      }

      let uploadedImageUrl: string | null = null;

      // Handle Image Upload to Supabase Storage if file selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('nawah-storage')
          .upload(fileName, selectedFile, { upsert: true });

        if (storageError) {
          console.warn('Storage upload notice:', storageError.message);
        } else if (storageData) {
          const { data: publicUrlData } = supabase.storage
            .from('nawah-storage')
            .getPublicUrl(fileName);
          uploadedImageUrl = publicUrlData.publicUrl;
        }
      }

      // Get region & city names
      const regionObj = SAUDI_REGIONS.find(r => r.id === selectedRegionId);
      const cityObj = SAUDI_CITIES.find(c => c.id === selectedCityId);

      console.log('[NAWAH BATCH DEBUG] Calling createBatch with payload...');

      const newBatch = await createBatch({
        source_id: sourceId || undefined,
        source_name: sourceName.trim(),
        region_id: selectedRegionId || undefined,
        region_name: regionObj?.name_ar || 'القصيم',
        city_id: selectedCityId || undefined,
        city_name: cityObj?.name_ar || 'بريدة',
        quantity: Number(quantity),
        date_type: dateType,
        date_collected: dateCollected,
        cleaning_status: cleaningStatus,
        drying_status: dryingStatus,
        moisture: moisture ? Number(moisture) : undefined,
        storage_method: storageMethod,
        notes: notes || undefined,
        image_url: uploadedImageUrl || imagePreview || undefined,
      });

      console.log('[NAWAH BATCH DEBUG] Batch created successfully:', newBatch);

      router.push(`/pit-management/batches/${newBatch.id}`);
      router.refresh();
    } catch (err: any) {
      console.error('[NAWAH BATCH DEBUG ERROR]', err);
      setErrorMsg("حدث خطأ أثناء حفظ الدفعة: " + (err.message || err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TOP TITLE */}
      <div className="flex items-center justify-between bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link 
            href="/pit-management/batches" 
            className="p-2.5 rounded-2xl bg-slate-50 text-emerald-700 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              تسجيل الدفعة
            </h2>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              أدخل المعلومات الأساسية المتوفرة عن الدفعة. لا تحتاج إلى إرسال النوى فعليًا إلى نواة.
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

      {/* DEFINITION OF BATCH */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-xs leading-relaxed shadow-sm space-y-2">
        <span className="block text-emerald-950 text-sm font-bold">ما المقصود بالدفعة؟</span>
        <p className="text-emerald-900 font-medium">
          الدفعة هي كمية محددة من نوى التمر جُمعت من مصدر معين أو خلال فترة محددة، ويمكن توثيق معلوماتها ومتابعة مراحلها رقميًا داخل نواة.
        </p>
        <div className="text-emerald-950 bg-emerald-100/60 p-3 rounded-xl font-medium border border-emerald-200/50 space-y-0.5">
          <span className="font-bold block">مثال:</span>
          <span>10 كجم من نوى تمر سكري • المصدر: مزرعة • الموقع: بريدة • الحالة: مجففة</span>
        </div>
        <p className="text-[11px] text-emerald-800 font-semibold">
          ملاحظة: يمكن تسجيل أكثر من دفعة، ولكل دفعة بياناتها ومسارها الخاص.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: SOURCE & LOCATION */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-emerald-950">ما البيانات المطلوبة؟</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">التسجيل رقمي فقط</span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            أدخل المعلومات الأساسية المتوفرة عن الدفعة لإنشاء سجل رقمي يوثق المصدر والكمية والحالة.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-emerald-900">اختيار من المصادر الموثقة في المنصة:</label>
              <select
                value={sourceId}
                onChange={handleSelectSource}
                disabled={isSubmitting}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                <option value="">-- أو ادخل مصدراً جديداً بالأسفل --</option>
                {VERIFIED_SOURCES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-emerald-900">
                مصدر النوى (من أين جاءت هذه الدفعة؟ مثال: مزرعة، مصنع تمور، مركز جمع) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="مثال: مزرعة نخيل في القصيم، أو مصنع تمور..."
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">المنطقة (الموقع الجغرافي):</label>
              <select
                value={selectedRegionId}
                disabled={isSubmitting}
                onChange={(e) => {
                  const regId = e.target.value;
                  setSelectedRegionId(regId);
                  const firstCity = SAUDI_CITIES.find(c => c.region_id === regId);
                  if (firstCity) setSelectedCityId(firstCity.id);
                }}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                {SAUDI_REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name_ar}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">المدينة / المحافظة:</label>
              <select
                value={selectedCityId}
                disabled={isSubmitting}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                {availableCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">
                الكمية (كم تبلغ كمية النوى؟ أدخل الوزن المتاح لديك بالكيلوجرام) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                disabled={isSubmitting}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                placeholder="أدخل الكمية بالكجم"
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 font-extrabold text-amber-600 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">نوع التمر (إن كان معروفاً):</label>
              <select
                value={dateType}
                disabled={isSubmitting}
                onChange={(e) => setDateType(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                <option value="خلاص">خلاص</option>
                <option value="سكري">سكري</option>
                <option value="عجوة">عجوة</option>
                <option value="صقعي">صقعي</option>
                <option value="مكتومي">مكتومي</option>
                <option value="نبوت سيف">نبوت سيف</option>
                <option value="مشكل">مزيج أصناف متنوعة</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-emerald-900">تاريخ التجميع أو الفترة التقريبية:</label>
              <input
                type="date"
                disabled={isSubmitting}
                value={dateCollected}
                onChange={(e) => setDateCollected(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: PIT METADATA */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-emerald-950">حالة النوى عند التسجيل</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">حالة النوى (بحسب ما تعرفه):</label>
              <select
                value={cleaningStatus}
                disabled={isSubmitting}
                onChange={(e) => setCleaningStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                <option value="مغسولة">مغسولة</option>
                <option value="غير مغسولة">غير مغسولة (خام)</option>
                <option value="مجففة ومفروزة">مجففة ومفروزة</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">طريقة التجفيف (إن وجدت):</label>
              <select
                value={dryingStatus}
                disabled={isSubmitting}
                onChange={(e) => setDryingStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              >
                <option value="مجففة شمسياً">مجففة شمسياً</option>
                <option value="مجففة برنفر">مجففة بأفران تفريغ</option>
                <option value="رطوبة عالية">رطوبة عالية تحتاج تجفيف</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">نسبة الرطوبة التقديرية (إن كانت معلومة %):</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                disabled={isSubmitting}
                value={moisture}
                onChange={(e) => setMoisture(e.target.value ? Number(e.target.value) : "")}
                placeholder="مثلاً 10%"
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900">طريقة التخزين الحالية:</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={storageMethod}
                onChange={(e) => setStorageMethod(e.target.value)}
                placeholder="مثلاً: أكياس خيش تهوية محكمة"
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-emerald-900">ملاحظات إضافية عن الدفعة (اختياري):</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات بخصوص الدفعة..."
                className="w-full bg-slate-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

          </div>
        </div>

        {/* SECTION 3: IMAGE UPLOAD / CAMERA */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-emerald-950">الصورة والتحليل البصري</h3>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">اختياري</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 space-y-1 leading-relaxed">
            <p className="font-bold text-slate-800">يمكنك إضافة صورة للدفعة عند توفرها للمساعدة في التحليل البصري الأولي.</p>
            <p className="text-slate-500">التحليل المدعوم بالذكاء الاصطناعي هو تحليل بصري أولي للصورة، ولا يُعد بديلًا عن التحليل المخبري أو الاختبارات المتخصصة.</p>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 py-3 rounded-2xl font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-amber-500" />
                <span>التقاط صورة عبر الكاميرا</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-emerald-200 text-emerald-900 py-3 rounded-2xl font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>رفع صورة من الجهاز</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-center min-h-[140px]">
              {imagePreview ? (
                <div className="relative group w-full text-center">
                  <img
                    src={imagePreview}
                    alt="معاينة صورة النوى"
                    className="max-h-36 mx-auto rounded-xl object-cover border border-emerald-300 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setSelectedFile(null); }}
                    className="mt-2 text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    حذف الصورة
                  </button>
                </div>
              ) : (
                <div className="text-center text-emerald-600/60 space-y-1">
                  <Info className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-xs font-semibold">لم يتم رفع أو التقاط صورة بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WHAT HAPPENS AFTER REGISTRATION */}
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-xs leading-relaxed shadow-sm space-y-2">
          <span className="block text-emerald-950 text-sm font-bold">ماذا يحدث بعد التسجيل؟</span>
          <p className="text-emerald-900 font-medium">
            بعد حفظ البيانات، تنشئ نواة سجلًا رقميًا للدفعة، ويمكن متابعة مراحلها وربط المعلومات بها داخل المنصة:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-950 font-medium">
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">01 — تسجيل الدفعة (حفظ بيانات المصدر والكمية)</div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">02 — التحليل البصري (تحليل بصري أولي للصورة)</div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">03 — الاستخدامات المحتملة (استكشاف مسارات الاستفادة)</div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">04 — الأدلة والتجارب (ربط المراجع وتوثيق النتائج)</div>
          </div>
          <span className="inline-block font-bold text-amber-800 bg-amber-100/70 border border-amber-200/60 px-3 py-1 rounded-lg mt-2 text-[11px]">
            التسجيل يتم رقميًا داخل نواة، ولا يعني إرسال النوى أو تسليمها للمنصة.
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/pit-management/batches"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black px-8 py-3 rounded-2xl text-xs transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدفعة...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>تسجيل الدفعة</span>
              </>
            )}
          </button>
        </div>

      </form>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        returnUrl={typeof window !== 'undefined' ? window.location.pathname : ""}
      />
    </div>
  );
}