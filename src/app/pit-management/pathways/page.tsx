"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, TestTube2, ArrowRight, ChevronLeft, Droplet, 
  Flame, Leaf, Coffee, Beaker, CheckCircle2
} from "lucide-react";
import { REUSE_PATHWAYS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const pathwayIcons: Record<string, any> = {
  "1": Flame,
  "2": Droplet,
  "3": Coffee,
  "4": Leaf,
  "5": Beaker
};

function PathwaysContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batch_id") || "";

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<any>(REUSE_PATHWAYS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState(batchId);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: bList } = await supabase
          .from('batches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBatches(bList || []);
        if (batchId && !selectedBatchId) {
          setSelectedBatchId(batchId);
        }
      }
    }
    loadData();
  }, [batchId]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto min-h-[80vh] flex flex-col" dir="rtl">
      
      {/* MINIMALIST HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            مستكشف مسارات الاستفادة
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-bold">
            اختر مساراً لاستكشاف متطلباته وتوثيق تجاربك عليه
          </p>
        </div>

        {batchId && selectedBatch && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <span>للدفعة:</span>
            <span className="font-black bg-emerald-200 px-2 py-0.5 rounded-lg dir-ltr">{selectedBatch.batch_number}</span>
          </div>
        )}
      </div>

      {/* INTERACTIVE SPLIT LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* LEFT NAV (INTERACTIVE LIST) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          {REUSE_PATHWAYS.map((path) => {
            const isSelected = selectedPathway.id === path.id;
            const Icon = pathwayIcons[String(path.id)] || Sparkles;
            
            return (
              <motion.button
                key={path.id}
                whileHover={{ scale: 1.02, x: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPathway(path)}
                className={`w-full text-right p-5 rounded-3xl border-2 transition-all flex items-center justify-between group overflow-hidden relative ${
                  isSelected
                    ? "bg-emerald-950 border-emerald-900 shadow-lg text-white"
                    : "bg-white border-slate-100 hover:border-emerald-200 text-slate-700 hover:bg-emerald-50/50"
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-emerald-900 opacity-50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-emerald-800 text-amber-400" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isSelected ? "text-white" : "text-slate-800"}`}>
                      {path.name}
                    </h4>
                    <span className={`text-[10px] font-bold mt-1 block ${isSelected ? "text-emerald-300" : "text-slate-400"}`}>
                      انقر للتفاصيل
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                    <ChevronLeft className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT CONTENT (DYNAMIC INFO) */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedPathway.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm h-full flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative BG */}
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
              
              <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full mb-3">
                      <CheckCircle2 className="w-3 h-3" />
                      موثوقية المسار: {selectedPathway.evidence_level}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight max-w-sm">
                      {selectedPathway.name}
                    </h3>
                  </div>
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                    <TestTube2 className="w-8 h-8" />
                  </div>
                </div>

                {/* Minimalist Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 transition-colors group">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-2">الفكرة ببساطة</span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed group-hover:text-emerald-950 transition-colors">
                      {selectedPathway.description}
                    </p>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 transition-colors group">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-2">المتطلبات</span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed group-hover:text-emerald-950 transition-colors">
                      {selectedPathway.processing_requirements}
                    </p>
                  </div>

                  {/* Card 3 (Full width) */}
                  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 md:col-span-2 flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                      <TestTube2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">الاختبارات اللازمة للتوثيق</span>
                      <p className="text-xs font-bold text-emerald-950">
                        {selectedPathway.required_tests}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <Link
                  href={batchId ? `/pit-management/experiments/new?batch_id=${batchId}` : "/pit-management/experiments/new"}
                  className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <span>بدء تجربة وتوثيق النتائج</span>
                  <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function PathwaysPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 text-emerald-600 text-sm font-bold flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-8 h-8 animate-spin" />
        جاري تحميل الاستكشاف...
      </div>
    }>
      <PathwaysContent />
    </Suspense>
  );
}
