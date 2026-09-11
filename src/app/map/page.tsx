"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Building2, ShieldCheck, CheckCircle2, 
  AlertCircle, Database, Package, RefreshCw 
} from "lucide-react";
import { VERIFIED_SOURCES, getBatches } from "@/lib/store";
import { VerifiedSource, Batch } from "@/lib/types";

// Dynamically import Leaflet Map to prevent SSR hydration errors
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-50 rounded-3xl flex items-center justify-center text-emerald-700 text-xs animate-pulse border border-emerald-200">
      جاري تحميل الخريطة التفاعلية لمصادر نوى التمر...
    </div>
  )
});

export default function SmartMapPage() {
  const [sources, setSources] = useState<VerifiedSource[]>(VERIFIED_SOURCES);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedSource, setSelectedSource] = useState<VerifiedSource | null>(null);
  const [filterRegion, setFilterRegion] = useState("all");

  useEffect(() => {
    async function loadData() {
      const bList = await getBatches();
      setBatches(bList);
    }
    loadData();
  }, []);

  const filteredSources = sources.filter(s => {
    if (filterRegion === "all") return true;
    return s.region_id === filterRegion;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-slate-50/90 border border-emerald-200/70 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <MapPin className="w-4 h-4" />
            <span>الخريطة الوطنية لمصادر ومجمعات نوى التمر</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-emerald-950">الخريطة التفاعلية الذكية للمصادر</h2>
          <p className="text-xs text-emerald-700/80 mt-1">
            تتبع مصانع التمور ومراكز التجميع الموثقة ومراكز المعالجة في المملكة العربية السعودية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-white border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-950 focus:outline-none focus:border-amber-400"
          >
            <option value="all">كافة مناطق المملكة</option>
            <option value="reg-qassim">القصيم</option>
            <option value="reg-riyadh">الرياض</option>
            <option value="reg-madinah">المدينة المنورة</option>
            <option value="reg-eastern">المنطقة الشرقية</option>
            <option value="reg-hail">حائل</option>
          </select>
        </div>
      </div>

      {/* MAP & SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEAFLET MAP CONTAINER (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              المواقع الموثقة في قاعدة البيانات ({filteredSources.length})
            </span>
            <span className="text-[10px] text-emerald-600/80">انقر على أي موقع لإظهار بطاقة التفاصيل</span>
          </div>

          {filteredSources.length === 0 ? (
            <div className="h-[400px] bg-white border border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <p className="text-sm font-bold text-emerald-950">لا توجد مواقع مسجلة حتى الآن في هذه المنطقة</p>
            </div>
          ) : (
            <MapComponent 
              sources={filteredSources} 
              onSelectSource={(s) => setSelectedSource(s)} 
            />
          )}
        </div>

        {/* SELECTED SOURCE DETAILS SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedSource ? (
            <div className="bg-slate-50/90 border border-amber-400/60 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {selectedSource.verification_status === 'verified' ? 'مصدر موثق رسمياً' : 'يحتاج تحقق ميداني'}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                  {selectedSource.source_type === 'factory' ? 'مصنع تمور' : 'مركز تجميع'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-emerald-950">{selectedSource.name}</h3>
                <p className="text-xs text-emerald-700/80 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {selectedSource.location_address}
                </p>
              </div>

              <div className="space-y-2 text-xs bg-white p-4 rounded-2xl border border-emerald-900">
                <div className="flex justify-between">
                  <span className="text-emerald-600/80">مصدر البيانات:</span>
                  <span className="font-bold text-emerald-950 text-[11px]">{selectedSource.data_source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600/80">تاريخ آخر تحقق:</span>
                  <span className="font-bold text-emerald-700">{selectedSource.last_verified_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600/80">الدفعات المرتبطة:</span>
                  <span className="font-bold text-amber-300">
                    {batches.filter(b => b.source_name.includes(selectedSource.name)).length} دفعات
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/90 border border-emerald-200/70 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200/60 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                قائمة المصادر الوطنية الموثقة
              </h3>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredSources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSource(s)}
                    className="w-full text-right p-3 rounded-2xl bg-white border border-emerald-900 hover:border-amber-400/60 transition-all space-y-1 block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">{s.name}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">
                        {s.city_name}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600/70 truncate">{s.data_source}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
