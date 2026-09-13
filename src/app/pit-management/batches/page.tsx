"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, PlusCircle, Search, MapPin, 
  ChevronLeft, QrCode, Filter, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function BatchesListPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cleaningFilter, setCleaningFilter] = useState("all");
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const loadBatches = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setIsGuest(false);
      const { data } = await supabase
        .from('batches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setBatches(data || []);
    } else {
      setIsGuest(true);
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
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Package className="w-4 h-4" />
            <span>سجل الدفعات الإلكتروني</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">دفعات نوى التمر المسجلة</h2>
          <p className="text-xs text-emerald-700 mt-1">
            إجمالي الدفعات المسجلة بحسابك من قاعدة البيانات ({batches.length} دفعة)
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-amber-400/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل دفعة جديدة</span>
        </Link>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث برقم الدفعة (NW-2026-...)، اسم المصدر، أو نوع التمر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-emerald-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 placeholder-emerald-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5" />
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-white border border-emerald-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 appearance-none"
          >
            <option value="all">كافة حالات التنظيف</option>
            <option value="مغسولة">مغسولة</option>
            <option value="غير مغسولة">غير مغسولة</option>
            <option value="مجففة ومفروزة">مجففة ومفروزة</option>
          </select>
        </div>
      </div>

      {/* BATCHES LIST OR EMPTY STATE */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-emerald-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-emerald-700">جاري تحميل بيانات الدفعات من قاعدة البيانات...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-emerald-200 rounded-3xl p-8 space-y-4 shadow-xl shadow-emerald-900/5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">لا توجد دفعات مسجلة حتى الآن</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              ابدأ بتسجيل أول دفعة من نوى التمر لحسابك لربطها بالتحليل البصري والتجارب المخبرية وتتبع مسارات الاستفادة.
            </p>
          </div>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-300 transition-all shadow"
          >
            <PlusCircle className="w-4 h-4" />
            تسجيل أول دفعة الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBatches.map((b) => (
            <div 
              key={b.id}
              className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                
                {/* BATCH HEADER */}
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-600 font-bold block">رقم الدفعة</span>
                    <span className="text-base font-black text-slate-900 dir-ltr text-right block">{b.batch_number}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedBatchForQR(b)}
                      title="عرض رمز QR للتتبع"
                      className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-emerald-200 hover:border-amber-400 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {b.status || 'مسجلة'}
                    </span>
                  </div>
                </div>

                {/* BATCH DETAILS */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-700">المصدر:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">{b.source_name}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-700">الكمية المسجلة:</span>
                    <span className="font-extrabold text-amber-600 text-sm">{Number(b.quantity).toLocaleString()} كجم</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-700">نوع التمر:</span>
                    <span className="font-medium bg-emerald-50 px-2 py-0.5 rounded text-emerald-900">{b.date_type}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-700">حالة التنظيف:</span>
                    <span className="font-medium text-emerald-900">{b.cleaning_status}</span>
                  </div>
                </div>

              </div>

              {/* ACTION FOOTER */}
              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700">تاريخ الجمع: {b.date_collected}</span>
                <Link
                  href={`/pit-management/batches/${b.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-slate-500 transition-colors"
                >
                  <span>عرض التفاصيل</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* QR CODE MODAL */}
      {selectedBatchForQR && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <span className="text-xs font-bold text-amber-600">بطاقة تتبع رخصة الدفعة</span>
              <button 
                onClick={() => setSelectedBatchForQR(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-sm px-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl inline-block shadow-inner mx-auto border border-emerald-100">
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
              <p className="text-lg font-black text-amber-600 dir-ltr">{selectedBatchForQR.batch_number}</p>
              <p className="text-xs text-emerald-900 mt-1">{selectedBatchForQR.source_name}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                الكمية: {selectedBatchForQR.quantity} كجم — {selectedBatchForQR.date_type}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/pit-management/batches/${selectedBatchForQR.id}`}
                onClick={() => setSelectedBatchForQR(null)}
                className="block bg-emerald-100 hover:bg-emerald-200 text-slate-900 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                الانتقال لصفحة التفاصيل
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
