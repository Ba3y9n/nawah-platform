"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, PlusCircle, Search, MapPin, 
  ChevronLeft, QrCode, ShieldCheck, Filter
} from "lucide-react";
import { getBatches, subscribeToStore } from "@/lib/store";
import { Batch } from "@/lib/types";

export default function BatchesListPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cleaningFilter, setCleaningFilter] = useState("all");
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBatches = async () => {
    setLoading(true);
    const data = await getBatches();
    setBatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBatches();
    const unsubscribe = subscribeToStore(() => {
      loadBatches();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredBatches = batches.filter(b => {
    const matchesSearch = 
      b.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.source_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.date_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.city_name && b.city_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCleaning = cleaningFilter === "all" || b.cleaning_status === cleaningFilter;
    return matchesSearch && matchesCleaning;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Package className="w-4 h-4" />
            <span>سجل الدفعات الإلكتروني</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">دفعات نوى التمر المسجلة</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            إجمالي الدفعات المسجلة فعلياً في قاعدة البيانات ({batches.length} دفعة)
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-amber-400/20"
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
            placeholder="البحث برقم الدفعة (NW-2026-...)، اسم المصدر، المدينة، أو نوع التمر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-emerald-200/70 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-emerald-950 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5" />
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-slate-50 border border-emerald-200/70 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400 appearance-none"
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
        <div className="text-center py-16 bg-slate-50/60 rounded-3xl border border-emerald-200/40">
          <p className="text-xs text-emerald-700 animate-pulse">جاري تحميل بيانات الدفعات من قاعدة البيانات...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/80 border border-dashed border-emerald-200/70 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لم يتم تسجيل أي دفعات حتى الآن</h3>
            <p className="text-xs text-emerald-700/80 max-w-md mx-auto">
              ابدأ بتسجيل أول دفعة من نوى التمر لربطها بالتحليل البصري والتجارب المخبرية وتتبع مسارات الاستفادة.
            </p>
          </div>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-300 transition-all shadow-md"
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
              className="bg-slate-50/90 border border-emerald-200/70 hover:border-emerald-500/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                
                {/* BATCH HEADER */}
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block">رقم الدفعة</span>
                    <span className="text-base font-black text-emerald-950 dir-ltr text-right block">{b.batch_number}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedBatchForQR(b)}
                      title="عرض رمز QR للتتبع"
                      className="p-2 rounded-xl bg-emerald-50 text-amber-400 border border-emerald-200 hover:border-amber-400 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300/60 font-bold">
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* BATCH DETAILS */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-600/80">المصدر:</span>
                    <span className="font-bold text-emerald-950 truncate max-w-[160px]">{b.source_name}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-600/80">الموقع:</span>
                    <span className="font-medium text-emerald-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {b.city_name || b.region_name || 'القصيم'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-600/80">الكمية المسجلة:</span>
                    <span className="font-extrabold text-amber-300 text-sm">{b.quantity.toLocaleString()} كجم</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-600/80">نوع التمر:</span>
                    <span className="font-medium bg-emerald-50/80 px-2 py-0.5 rounded text-emerald-800">{b.date_type}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-emerald-600/80">حالة التنظيف:</span>
                    <span className="font-medium text-emerald-700">{b.cleaning_status}</span>
                  </div>
                </div>

              </div>

              {/* ACTION FOOTER */}
              <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600/70">تاريخ الجمع: {b.date_collected}</span>
                <Link
                  href={`/pit-management/batches/${b.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-50 border border-emerald-300/80 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-200 pb-3">
              <span className="text-xs font-bold text-amber-400">بطاقة تتبع رخصة الدفعة</span>
              <button 
                onClick={() => setSelectedBatchForQR(null)}
                className="text-slate-500 hover:text-emerald-950 font-bold text-sm px-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
              {/* SVG QR Code Illustration */}
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
              <p className="text-lg font-black text-amber-300 dir-ltr">{selectedBatchForQR.batch_number}</p>
              <p className="text-xs text-emerald-800 mt-1">{selectedBatchForQR.source_name}</p>
              <p className="text-[11px] text-emerald-600/80 mt-0.5">
                الكمية: {selectedBatchForQR.quantity} كجم — {selectedBatchForQR.date_type}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/pit-management/batches/${selectedBatchForQR.id}`}
                onClick={() => setSelectedBatchForQR(null)}
                className="block bg-emerald-300 hover:bg-emerald-600 text-emerald-950 font-bold py-2 rounded-xl text-xs transition-colors"
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
