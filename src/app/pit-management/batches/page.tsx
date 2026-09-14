"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, PlusCircle, Search, MapPin, 
  ChevronLeft, QrCode, Filter, Loader2, CheckCircle2, Scan
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
      
      {/* EDITORIAL HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">سجل الدفعات الإلكتروني</span>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">دفعات نوى التمر المسجلة</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            جدول البيانات الرقمي الموحد لإدارة وتتبع شحنات نوى التمر ({batches.length} دفعة مسجلة).
          </p>
        </div>

        <Link
          href="/pit-management/batches/new"
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>تسجيل دفعة جديدة</span>
        </Link>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث برقم الدفعة (NW-2026-...)، اسم المصدر، أو نوع التمر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 appearance-none"
          >
            <option value="all">كافة حالات التنظيف</option>
            <option value="مغسولة">مغسولة</option>
            <option value="غير مغسولة">غير مغسولة</option>
            <option value="مجففة ومفروزة">مجففة ومفروزة</option>
          </select>
        </div>
      </div>

      {/* MODERN EDITORIAL DATA TABLE */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">جاري تحميل جدول الدفعات...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-4 shadow-sm">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">لا توجد دفعات مسجلة حالياً</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              قم بتسجيل أول دفعة لتوثيق المصادر والكميات وفتح مسار الرحلة الرقمية.
            </p>
          </div>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs hover:bg-emerald-800 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            تسجيل أول دفعة
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">رقم الدفعة</th>
                  <th className="pb-3">المصدر والموقع</th>
                  <th className="pb-3">الكمية</th>
                  <th className="pb-3">الصنف والتنظيف</th>
                  <th className="pb-3">حالة الرحلة الرقمية</th>
                  <th className="pb-3 text-left">التطبيق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((b) => {
                  const hasAnalysis = b.image_analysis && b.image_analysis.length > 0;
                  const hasExperiments = b.experiments && b.experiments.length > 0;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 font-black text-emerald-950 dir-ltr text-right">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBatchForQR(b)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="عرض QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <span>{b.batch_number}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-slate-900">{b.source_name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.date_collected}</div>
                      </td>
                      <td className="py-4 font-black text-emerald-800 text-sm">
                        {Number(b.quantity).toLocaleString()} كجم
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-slate-800">{b.date_type}</span>
                        <span className="text-[10px] text-slate-400 block">{b.cleaning_status}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${hasExperiments ? "bg-emerald-600" : hasAnalysis ? "bg-amber-500" : "bg-slate-300"}`} />
                          <span className="font-bold text-slate-700">
                            {hasExperiments ? "تجارب معملية" : hasAnalysis ? "تحليل بصري" : "دفعة مسجلة"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-left">
                        <Link
                          href={`/pit-management/batches/${b.id}`}
                          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                        >
                          <span>فتح الرحلة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {selectedBatchForQR && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-950">بطاقة تتبع رخصة الدفعة</span>
              <button onClick={() => setSelectedBatchForQR(null)} className="text-slate-400 hover:text-slate-900 font-bold text-sm px-2">✕</button>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl inline-block mx-auto border border-slate-200">
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
            </div>
            <Link href={`/pit-management/batches/${selectedBatchForQR.id}`} onClick={() => setSelectedBatchForQR(null)} className="block bg-emerald-950 text-white font-bold py-2.5 rounded-xl text-xs">
              فتح صفحة الرحلة بالكامل
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
