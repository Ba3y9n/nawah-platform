"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Building2, ShieldCheck, 
  AlertCircle, Database, Clock, ShieldAlert, CheckCircle2
} from "lucide-react";
import { VERIFIED_SOURCES } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-50 rounded-3xl flex items-center justify-center text-emerald-700 text-xs animate-pulse border border-emerald-200">
      جاري تحميل الخريطة التفاعلية لمصادر نوى التمر...
    </div>
  )
});

export default function SmartMapPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [filterRegion, setFilterRegion] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();

      // Query database sources table
      const { data: dbSources } = await supabase
        .from('sources')
        .select('*');

      if (dbSources && dbSources.length > 0) {
        setSources(dbSources);
      } else {
        // Fallback to verified real sources list
        setSources(VERIFIED_SOURCES);
      }

      // Query batches to map user batch counts
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: bList } = await supabase
            .from('batches')
            .select('*')
            .eq('user_id', user.id);

          setBatches(bList || []);
        }
      } catch(e) {}

      setLoading(false);
    }
    loadData();
  }, []);

  const filteredSources = sources.filter(s => {
    if (filterRegion === "all") return true;
    return s.region_id === filterRegion;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* TITLE BANNER */}
      <div className="bg-white border border-emerald-100/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>الخريطة الوطنية لمصادر ومجمعات نوى التمر</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">الخريطة التفاعلية للمصادر الموثقة</h2>
          <p className="text-xs text-slate-500 mt-1">
            تتبع المصانع ومراكز التجميع المعتمدة في المملكة العربية السعودية مع التمييز الواضح لدرجة التحقق
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
          >
            <option value="all">كافة مناطق المملكة</option>
            <option value="reg-qassim">منطقة القصيم</option>
            <option value="reg-riyadh">منطقة الرياض</option>
            <option value="reg-madinah">منطقة المدينة المنورة</option>
            <option value="reg-eastern">المنطقة الشرقية</option>
            <option value="reg-hail">منطقة حائل</option>
          </select>
        </div>
      </div>

      {/* MAP & SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEAFLET MAP CONTAINER (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-emerald-100/60 rounded-3xl p-4 shadow-xl shadow-emerald-900/5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              المواقع الموثقة وقيد التحقق ({filteredSources.length})
            </span>
            <span className="text-[10px] text-slate-500 font-bold">انقر على الموقع لاستعراض سجل التوثيق</span>
          </div>

          {loading ? (
            <div className="h-[480px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-500 animate-pulse">
              جاري جلب إحداثيات وسجلات المصادر...
            </div>
          ) : filteredSources.length === 0 ? (
            <div className="h-[480px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">لا توجد مواقع موثقة متاحة حالياً في هذه المنطقة</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                قاعدة بيانات المواقع ومراكز التجميع قيد التوثيق والتوسع المستمر بالتنسيق مع الجهات المعتمدة.
              </p>
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
            <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  selectedSource.verification_status === 'verified'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  {selectedSource.verification_status === 'verified' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>موثق رسمياً (Verified)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>قيد التحقق (Pending Verification)</span>
                    </>
                  )}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {selectedSource.source_type === 'factory' ? 'مصنع تمور' : 'مركز تجميع'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{selectedSource.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedSource.location_address || selectedSource.city_name}
                </p>
              </div>

              <div className="space-y-2.5 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">مصدر التوثيق:</span>
                  <span className="font-bold text-slate-900 text-[11px]">{selectedSource.data_source || 'بيانات رسمية'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">الإحداثيات الجغرافية:</span>
                  <span className="font-bold text-slate-900 text-[11px] dir-ltr">{selectedSource.lat?.toFixed(4)}, {selectedSource.lng?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">تاريخ التحقق الأخير:</span>
                  <span className="font-bold text-slate-900 text-[11px]">{selectedSource.last_verified_at || '2026-01-15'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl text-xs font-bold transition-colors"
              >
                العودة لقائمة المصادر
              </button>
            </div>
          ) : (
            <div className="bg-white border border-emerald-100/60 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                المصادر الموثقة المعتمدة ({filteredSources.length})
              </h3>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredSources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSource(s)}
                    className="w-full text-right p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/60 hover:border-emerald-500 transition-all space-y-1 block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{s.name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        s.verification_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {s.verification_status === 'verified' ? 'موثق' : 'قيد التحقق'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{s.data_source || 'وزارة البيئة والمياه والزراعة'}</p>
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
