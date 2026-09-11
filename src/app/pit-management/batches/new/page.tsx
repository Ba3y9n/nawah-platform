"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, Camera, Upload, ArrowRight, Save, 
  MapPin, CheckCircle2, AlertCircle, Info, Sparkles
} from "lucide-react";
import { SAUDI_REGIONS, SAUDI_CITIES, VERIFIED_SOURCES, createBatch } from "@/lib/store";

export default function NewBatchPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [sourceId, setSourceId] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("reg-qassim");
  const [selectedCityId, setSelectedCityId] = useState("city-buraidah");
  const [quantity, setQuantity] = useState<number | "">(100);
  const [dateType, setDateType] = useState("خلاص");
  const [dateCollected, setDateCollected] = useState(new Date().toISOString().split('T')[0]);
  const [cleaningStatus, setCleaningStatus] = useState<'مغسولة' | 'غير مغسولة' | 'مجففة ومفروزة'>("مغسولة");
  const [dryingStatus, setDryingStatus] = useState<'مجففة شمسياً' | 'مجففة برنفر' | 'رطوبة عالية'>("مجففة شمسياً");
  const [moisture, setMoisture] = useState<number | "">(12);
  const [storageMethod, setStorageMethod] = useState("أكياس خيش تهوية محكومة");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cities filtered dynamically by selected region
  const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);
  const currentRegion = SAUDI_REGIONS.find(r => r.id === selectedRegionId);
  const currentCity = SAUDI_CITIES.find(c => c.id === selectedCityId);

  // Update source when picking from verified sources
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!sourceName.trim()) {
      setErrorMsg("يرجى تحديد أو كتابة اسم مصدر النوى (المصنع/المزرعة/المجمع)");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setErrorMsg("يرجى أدخال كمية نوات صحيحة وأكبر من الصفر");
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createBatch({
        source_id: sourceId || undefined,
        source_name: sourceName,
        region_id: selectedRegionId,
        region_name: currentRegion?.name_ar || "القصيم",
        city_id: selectedCityId,
        city_name: currentCity?.name_ar || "بريدة",
        quantity: Number(quantity),
        date_type: dateType,
        date_collected: dateCollected,
        cleaning_status: cleaningStatus,
        drying_status: dryingStatus,
        moisture: moisture ? Number(moisture) : undefined,
        storage_method: storageMethod,
        notes: notes,
        image_url: imagePreview || undefined
      });

      // Redirect to batch detail page
      router.push(`/pit-management/batches/${created.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء حفظ الدفعة في قاعدة البيانات: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* TOP TITLE */}
      <div className="flex items-center justify-between bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link 
            href="/pit-management/batches" 
            className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:text-emerald-950 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              تسجيل دفعة جديدة من نوى التمر
              <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                Auto NW-2026-xxxx
              </span>
            </h2>
            <p className="text-xs text-emerald-700/80">
              سيتم توليد رقم الدفعة تلقائياً وحفظ البيانات فورياً في قاعدة بيانات Supabase
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
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: SOURCE & LOCATION */}
        <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-200/60 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-emerald-950">أولاً: معلومات المصدر والموقع الجغرافي</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pick Verified Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">اختيار من المصادر الموثقة في المنصة:</label>
              <select
                value={sourceId}
                onChange={handleSelectSource}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- أو ادخل مصدراً جديداً بالأسفل --</option>
                {VERIFIED_SOURCES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city_name} - {s.data_source})
                  </option>
                ))}
              </select>
            </div>

            {/* Source Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">
                اسم المصدر / المنشأة <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثلاً: مصنع تمور المملكة - بريدة"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 placeholder-emerald-500/50 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Region Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">المنطقة:</label>
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  const regId = e.target.value;
                  setSelectedRegionId(regId);
                  const firstCity = SAUDI_CITIES.find(c => c.region_id === regId);
                  if (firstCity) setSelectedCityId(firstCity.id);
                }}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                {SAUDI_REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name_ar}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown (Filtered dynamically based on Region) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">المدينة (فلترة تلقائية):</label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                {availableCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 2: PIT METADATA */}
        <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-200/60 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-emerald-950">ثانياً: مواصفات وكمية النوى</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">
                الكمية بالكيلوجرام (KG) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                placeholder="أدخل الكمية بالكجم"
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 placeholder-emerald-500/50 focus:outline-none focus:border-amber-400 font-extrabold text-amber-300"
              />
            </div>

            {/* Date Variety */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">نوع التمر الأصلي:</label>
              <select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
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

            {/* Date Collected */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">تاريخ الجمع والفرز:</label>
              <input
                type="date"
                value={dateCollected}
                onChange={(e) => setDateCollected(e.target.value)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Cleaning Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">حالة التنظيف:</label>
              <select
                value={cleaningStatus}
                onChange={(e) => setCleaningStatus(e.target.value as any)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                <option value="مغسولة">مغسولة وخالية من العوالق</option>
                <option value="غير مغسولة">غير مغسولة (بقايا ثمرة)</option>
                <option value="مجففة ومفروزة">مجففة ومفروزة آلیاً</option>
              </select>
            </div>

            {/* Drying Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">حالة التجفيف:</label>
              <select
                value={dryingStatus}
                onChange={(e) => setDryingStatus(e.target.value as any)}
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              >
                <option value="مجففة شمسياً">مجففة شمسياً</option>
                <option value="مجففة برنفر">مجففة بأفران تفريغ</option>
                <option value="رطوبة عالية">رطوبة عالية تحتاج تجفيف</option>
              </select>
            </div>

            {/* Moisture % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">نسبة الرطوبة (إن وجدت %):</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value ? Number(e.target.value) : "")}
                placeholder="مثلاً 10%"
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">طريقة التخزين والحفظ:</label>
              <input
                type="text"
                value={storageMethod}
                onChange={(e) => setStorageMethod(e.target.value)}
                placeholder="مثلاً: أكياس خيش تهوية محكومة"
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700">ملاحظات إضافية:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات بخصوص شحنة النوى..."
                className="w-full bg-white border border-emerald-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: IMAGE UPLOAD / CAMERA */}
        <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-emerald-200/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-emerald-950">ثالثاً: صورة الدفعة (Supabase Storage)</h3>
            </div>
            <span className="text-[10px] text-emerald-600">مستحسن للتحليل البصري</span>
          </div>

          {/* Hidden inputs */}
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
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-3 rounded-2xl font-bold text-xs transition-colors shadow"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                📷 فتح الكاميرا والتقاط صورة
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-800 border border-emerald-200 text-emerald-800 py-3 rounded-2xl font-bold text-xs transition-colors shadow"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                🖼️ رفع صورة من الجهاز
              </button>
            </div>

            <div className="bg-white border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-center min-h-[140px]">
              {imagePreview ? (
                <div className="relative group w-full text-center">
                  <img
                    src={imagePreview}
                    alt="معاينة صورة النوى"
                    className="max-h-36 mx-auto rounded-xl object-cover border border-emerald-300 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="mt-2 text-[10px] font-bold text-rose-400 hover:underline"
                  >
                    حذف الصورة
                  </button>
                </div>
              ) : (
                <div className="text-center text-emerald-500/60 space-y-1">
                  <Info className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-xs font-semibold">لم يتم رفع أو التقاط صورة بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/pit-management/batches"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-800 transition-colors"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black px-8 py-3 rounded-2xl text-xs transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "جاري الحفظ..." : "حفظ الدفعة في قاعدة البيانات"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
