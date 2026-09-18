"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, PlusCircle, Search, MapPin, 
  ChevronLeft, QrCode, Filter, Loader2, CheckCircle2, Scan, FileText, ChevronDown, Activity
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchesListPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cleaningFilter, setCleaningFilter] = useState("all");
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const loadBatches = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('batches')
        .select('*, image_analysis(*), experiments(*)')
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* EDITORIAL HEADER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-emerald-950 to-emerald-900 p-8 rounded-3xl shadow-lg border border-emerald-800 text-white"
      >
        <div>
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-2"
          >
            السجلات الرقمية للدفعات
          </motion.span>
          <h2 className="text-2xl md:text-3xl font-black text-white">دفعات النوى المسجلة</h2>
          <p className="text-xs text-emerald-100/70 mt-2 font-medium max-w-lg leading-relaxed">
            تابع السجلات الرقمية لدفعات نوى التمر المسجلة، بدءاً من بيانات المصدر ووصولاً إلى التحليل والأدلة والتجارب.
            يوجد حالياً <strong className="text-white">{batches.length}</strong> سجل رقمي في النظام.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-4 rounded-2xl text-xs transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm">تسجيل دفعة جديدة</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* SEARCH AND FILTER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-12 gap-4"
      >
        <div className="sm:col-span-8 relative group">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-600" />
          <input
            type="text"
            placeholder="البحث برقم الدفعة (NW-2026-...)، اسم المصدر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
          />
        </div>

        <div className="sm:col-span-4 relative group">
          <Filter className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-600" />
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 appearance-none transition-all shadow-sm"
          >
            <option value="all">كافة حالات التنظيف</option>
            <option value="مغسولة">مغسولة</option>
            <option value="غير مغسولة">غير مغسولة</option>
            <option value="مجففة ومفروزة">مجففة ومفروزة</option>
          </select>
        </div>
      </motion.div>

      {/* INTERACTIVE DATA LIST */}
      {loading ? (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">جاري استحضار الرحلات المسجلة...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-6 shadow-sm"
        >
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">لا توجد سجلات مسجلة بعد</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              ابدأ الآن بإنشاء أول سجل رقمي لدفعة من نوى التمر لمتابعة بياناتها وما يرتبط بها من تحليل وأدلة وتجارب ونتائج.
            </p>
          </div>
          <Link
            href="/pit-management/batches/new"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-800 transition-all shadow-md"
          >
            <PlusCircle className="w-5 h-5 text-emerald-300" />
            تسجيل أول دفعة
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredBatches.map((b) => {
              const hasAnalysis = b.image_analysis && b.image_analysis.length > 0;
              const hasExperiments = b.experiments && b.experiments.length > 0;
              const isExpanded = expandedRow === b.id;

              return (
                <motion.div 
                  key={b.id}
                  variants={itemVariants}
                  layout
                  className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all duration-300"
                >
                  <div 
                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedRow(isExpanded ? null : b.id)}
                  >
                    {/* INFO BLOCK */}
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                        <Package className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-emerald-950 dir-ltr text-lg tracking-tight">{b.batch_number}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {b.date_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {b.source_name}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-emerald-700 font-bold">{Number(b.quantity).toLocaleString()} كجم</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS BADGES & ACTIONS */}
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                      
                      <div className="flex items-center gap-2">
                        {hasExperiments ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <Activity className="w-3.5 h-3.5" /> مسار مخبري
                          </span>
                        ) : hasAnalysis ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <Scan className="w-3.5 h-3.5" /> تم الفحص
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> قيد الانتظار
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatchForQR(b);
                          }}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="عرض QR"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/pit-management/batches/${b.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-bold text-white bg-emerald-950 hover:bg-emerald-800 px-4 py-2 rounded-xl text-xs transition-colors"
                        >
                          فتح الرحلة
                        </Link>
                        <button className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDABLE DETAILS AREA */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">معلومات الاستلام</span>
                            <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-500">المنطقة/المدينة:</span>
                                <span className="font-bold text-slate-800">{b.region} - {b.city}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">حالة التنظيف:</span>
                                <span className="font-bold text-emerald-700">{b.cleaning_status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">التحليل البصري (AI)</span>
                            <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs h-full flex flex-col justify-center">
                              {hasAnalysis ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>تم إنجاز الفحص</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 line-clamp-2">درجة الثقة: {b.image_analysis[0]?.confidence || '--'}%</p>
                                </div>
                              ) : (
                                <Link href={`/pit-management/scanner?batch_id=${b.id}`} className="text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1">
                                  <Scan className="w-4 h-4" /> إجراء فحص جديد
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">التجارب المعملية</span>
                            <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs h-full flex flex-col justify-center">
                              {hasExperiments ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-amber-600 font-bold">
                                    <Activity className="w-4 h-4" />
                                    <span>{b.experiments.length} تجارب مسجلة</span>
                                  </div>
                                </div>
                              ) : (
                                <Link href={`/pit-management/experiments/new?batch_id=${b.id}`} className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1">
                                  <FileText className="w-4 h-4" /> تسجيل مسار مخبري
                                </Link>
                              )}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* QR MODAL (Unchanged Logic, enhanced styling) */}
      <AnimatePresence>
        {selectedBatchForQR && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-sm w-full space-y-6 text-center shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-sm font-black text-emerald-950">بطاقة تتبع الرحلة</span>
                <button onClick={() => setSelectedBatchForQR(null)} className="text-slate-400 hover:text-rose-500 font-bold text-lg px-2 transition-colors">✕</button>
              </div>
              <div className="bg-white p-6 rounded-3xl inline-block mx-auto border-2 border-emerald-50 shadow-sm">
                {/* SVG placeholder for QR */}
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
                <p className="text-xl font-black text-emerald-950 dir-ltr tracking-tight">{selectedBatchForQR.batch_number}</p>
                <p className="text-sm text-slate-500 mt-1 font-medium">{selectedBatchForQR.source_name}</p>
              </div>
              <Link 
                href={`/pit-management/batches/${selectedBatchForQR.id}`} 
                onClick={() => setSelectedBatchForQR(null)} 
                className="block bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-4 rounded-2xl text-sm transition-colors shadow-md"
              >
                الدخول إلى لوحة الدفعة بالكامل
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
