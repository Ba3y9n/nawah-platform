"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, PlusCircle, Search, MapPin, 
  ChevronLeft, QrCode, Filter, Loader2, ArrowRight, CheckCircle2, Sparkles, Scan
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function BatchesListPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cleaningFilter, setCleaningFilter] = useState("all");
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBatches = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('batches')
        .select('*, image_analysis(id), experiments(id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setBatches(data || []);
    } else {
      setBatches([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const filteredBatches = batches.filter(b => {
    const matchesSearch = 
      (b.batch_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.source_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.date_type || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCleaning = cleaningFilter === "all" || b.cleaning_status === cleaningFilter;
    return matchesSearch && matchesCleaning;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>نقطة البداية لرحلة النواة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">دفعات نوى التمر المسجلة</h2>
          <p className="text-xs text-slate-500 mt-1">
            سجل الدفعات الإلكتروني الموثق بحسابك ({batches.length} دفعة). انقر على "فتح الرحلة" لربط الدفعة بكافة المراحل.
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>تسجيل دفعة جديدة</span>
        </Link>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث برقم الدفعة (NW-2026-...)، اسم المصدر، أو نوع التمر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 appearance-none transition-colors"
          >
            <option value="all">كافة حالات التنظيف</option>
            <option value="مغسولة">مغسولة</option>
            <option value="غير مغسولة">غير مغسولة</option>
            <option value="مجففة ومفروزة">مجففة ومفروزة</option>
          </select>
        </div>
      </div>

      {/* BATCHES CARDS WITH JOURNEY PROGRESS */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">جاري تحميل سجل الدفعات...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لا توجد دفعات مسجلة حتى الآن</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ابدأ بتسجيل أول دفعة لفتح رحلتها الرقمية المترابطة بالتحليل والتجارب والأثر.
            </p>
          </div>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs hover:bg-emerald-800 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            تسجيل أول دفعة الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBatches.map((b) => {
            const hasAnalysis = b.image_analysis && b.image_analysis.length > 0;
            const hasExperiments = b.experiments && b.experiments.length > 0;
            
            // Calculate Journey Stage & Progress
            let progressPercent = 33; // Batch Created
            let currentStageName = "تسجيل الدفعة";
            
            if (hasExperiments) {
              progressPercent = 83;
              currentStageName = "التجارب المعملية";
            } else if (hasAnalysis) {
              progressPercent = 60;
              currentStageName = "التحليل البصري";
            }

            return (
              <div 
                key={b.id}
                className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all group space-y-5"
              >
                <div className="space-y-4">
                  
                  {/* BATCH HEADER */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">رقم الدفعة</span>
                      <span className="text-base font-black text-emerald-950 dir-ltr text-right block">{b.batch_number}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBatchForQR(b)}
                        title="رمز QR للتتبع"
                        className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:border-emerald-400 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {b.status || 'مسجلة'}
                      </span>
                    </div>
                  </div>

                  {/* BATCH DETAILS */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">المصدر:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{b.source_name}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">الكمية المسجلة:</span>
                      <span className="font-black text-emerald-700 text-sm">{Number(b.quantity).toLocaleString()} كجم</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">نوع التمر:</span>
                      <span className="font-bold bg-slate-50 px-2 py-0.5 rounded text-slate-800">{b.date_type}</span>
                    </div>
                  </div>

                  {/* DIGITAL JOURNEY PROGRESS BAR */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">حالة الرحلة الرقمية:</span>
                      <span className="font-bold text-emerald-800">{currentStageName}</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* ACTION FOOTER */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">تاريخ الجمع: {b.date_collected}</span>
                  <Link
                    href={`/pit-management/batches/${b.id}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <span>فتح الرحلة</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* QR CODE MODAL */}
      {selectedBatchForQR && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-950">بطاقة تتبع رخصة الدفعة</span>
              <button 
                onClick={() => setSelectedBatchForQR(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-sm px-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl inline-block shadow-inner mx-auto border border-slate-200">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z" fill="#022c22" />
                <path d="M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z" fill="#022c22" />
                <path d="M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z" fill="#022c22" />
                <rect x="45" y="10" width="10" height="30" fill="#022c22" />
                <rect x="10" y="45" width="30" height="10" fill="#022c22" />
                <rect x="50" y="50" width="40" height="40" fill="#022c22" />
                <rect x="60" y="60" width="20" height="20" fill="white" />
              </svg>
            </div>

            <div>
              <p className="text-lg font-black text-emerald-950 dir-ltr">{selectedBatchForQR.batch_number}</p>
              <p className="text-xs text-slate-700 mt-1">{selectedBatchForQR.source_name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                الكمية: {selectedBatchForQR.quantity} كجم — {selectedBatchForQR.date_type}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/pit-management/batches/${selectedBatchForQR.id}`}
                onClick={() => setSelectedBatchForQR(null)}
                className="block bg-emerald-950 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                فتح صفحة الرحلة بالكامل
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
