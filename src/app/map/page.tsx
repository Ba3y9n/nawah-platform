"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Building2, ShieldCheck, 
  AlertCircle, Database, Clock, ShieldAlert, CheckCircle2,
  Search, Filter, Maximize2, RotateCcw, ExternalLink, Navigation, Compass
} from "lucide-react";
import { VERIFIED_SOURCES, SAUDI_REGIONS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] lg:h-[680px] w-full bg-slate-50 rounded-3xl flex flex-col items-center justify-center text-slate-500 text-xs animate-pulse border border-slate-200 gap-2">
      <Compass className="w-8 h-8 text-emerald-700 animate-spin" />
      <span>جاري تحميل الخريطة الذكية لقطاع النخيل...</span>
    </div>
  )
});

export default function SmartMapPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyDistance, setNearbyDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();

      const { data: dbSources } = await supabase
        .from('sources')
        .select('*');

      if (dbSources && dbSources.length > 0) {
        setSources(dbSources);
      } else {
        setSources(VERIFIED_SOURCES);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  // Filter Logic
  const filteredSources = sources.filter(s => {
    const matchesSearch = 
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.city_name || s.location_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.data_source || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || s.source_type === filterType;
    const matchesVerification = filterVerification === "all" || s.verification_status === filterVerification;
    const matchesRegion = filterRegion === "all" || s.region_id === filterRegion;

    let matchesDistance = true;
    if (userLocation && nearbyDistance && s.lat && s.lng) {
      // Calculate Haversine distance in KM
      const R = 6371;
      const dLat = (s.lat - userLocation.lat) * Math.PI / 180;
      const dLng = (s.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(s.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = R * c;
      matchesDistance = dist <= nearbyDistance;
    }

    return matchesSearch && matchesType && matchesVerification && matchesRegion && matchesDistance;
  });

  const verifiedCount = sources.filter(s => s.verification_status === 'verified').length;
  const pendingCount = sources.filter(s => s.verification_status === 'needs_verification').length;

  const handleRequestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearbyDistance(50); // Default to 50km
      }, (err) => {
        console.warn("Location permission denied or unavailable:", err.message);
      });
    }
  };

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-8" dir="rtl">
      
      {/* EDITORIAL HEADER BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-emerald-950 border border-emerald-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-amber-300 tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            البنية التحتية والمصادر الوطنية
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
            الخريطة الذكية <span className="text-emerald-400">لقطاع النخيل</span>
          </h1>
          <p className="text-sm text-emerald-100/80 max-w-2xl font-medium leading-relaxed">
            استكشف مواقع مصانع التمور ومراكز التجميع المعتمدة بالمملكة، وتتبع درجة الموثوقية الرسمية ومصادر البيانات المستندة لجهات حقيقية.
          </p>
        </div>

        {/* METRICS DISCLOSURE */}
        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-xs shrink-0 relative z-10">
          <div>
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">موثق رسمياً</span>
            <span className="text-2xl font-black text-emerald-400">{verifiedCount}</span>
            <span className="text-xs text-emerald-100/50 mr-1">موقع</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">يحتاج تحقق</span>
            <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            <span className="text-xs text-emerald-100/50 mr-1">موقع</span>
          </div>
        </div>
      </motion.div>

      {/* SEARCH AND FILTERS BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* SEARCH INPUT */}
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            <input
              type="text"
              placeholder="ابحث عن جهة، مدينة، أو مصدر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-12 pl-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              <option value="all">جميع أنواع الجهات</option>
              <option value="factory">مصانع تمور</option>
              <option value="collection_center">مراكز تجميع</option>
              <option value="farm">مزارع ومعالجة</option>
            </select>
          </div>

          {/* VERIFICATION FILTER */}
          <div className="md:col-span-2">
            <select
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              <option value="all">كافة درجات التوثيق</option>
              <option value="verified">موثق رسمياً</option>
              <option value="needs_verification">يحتاج تحقق</option>
            </select>
          </div>

          {/* REGION FILTER */}
          <div className="md:col-span-2">
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
            >
              <option value="all">جميع المناطق</option>
              {SAUDI_REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.name_ar}</option>
              ))}
            </select>
          </div>

        </div>

        {/* NEARBY EXPLORER TOOL BAR */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRequestLocation}
              className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl transition-colors text-xs border border-emerald-100"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>استكشاف المواقع حولي</span>
            </button>

            {userLocation && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                <span className="text-slate-500">نطاق البحث:</span>
                {[25, 50, 100].map(dist => (
                  <button
                    key={dist}
                    onClick={() => setNearbyDistance(dist)}
                    className={`px-3 py-1 rounded-lg transition-colors ${nearbyDistance === dist ? 'bg-emerald-950 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {dist} كم
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            تم العثور على <strong className="text-emerald-950 font-black text-sm mx-1">{filteredSources.length}</strong> موقع مطابق
          </div>
        </div>
      </motion.div>

      {/* MAIN MAP AREA & SIDE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[600px]">
        
        {/* HERO MAP CONTAINER (8 Cols Desktop / Full Mobile) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-8 bg-white border border-slate-200/80 rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 relative overflow-hidden h-[600px]"
        >
          <div className="absolute inset-0 bg-slate-50 rounded-[2rem] m-4 overflow-hidden border border-slate-100 z-0">
             {/* Note: MapComponent is rendered inside the rounded container */}
            <MapComponent 
              sources={filteredSources} 
              selectedSourceId={selectedSource?.id}
              onSelectSource={(s) => setSelectedSource(s)} 
            />
          </div>
        </motion.div>

        {/* DETAIL SIDE PANEL / MOBILE BOTTOM SHEET (4 Cols Desktop) */}
        <div className="lg:col-span-4 h-full">
          
          {selectedSource ? (
            /* SELECTED SOURCE DETAIL PANEL */
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 space-y-6"
            >
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm ${
                  selectedSource.verification_status === 'verified'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  {selectedSource.verification_status === 'verified' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>موثق رسمياً (Verified)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>يحتاج تحقق ميداني</span>
                    </>
                  )}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold">
                  {selectedSource.source_type === 'factory' ? 'مصنع تمور' : selectedSource.source_type === 'collection_center' ? 'مركز تجميع' : 'مزرعة/معالجة'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-emerald-950 leading-tight">{selectedSource.name}</h3>
                <p className="text-sm text-slate-500 mt-2 flex items-start gap-1.5 font-medium leading-snug">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {selectedSource.location_address || `${selectedSource.city_name} — ${selectedSource.region_name}`}
                </p>
              </div>

              {/* WHY THIS SOURCE APPEARS DISCLOSURE */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2 text-sm shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">سبب الظهور في الخريطة الوطنية:</span>
                <p className="text-slate-800 font-bold leading-relaxed text-xs">
                  {selectedSource.data_source.includes('المركز الوطني')
                    ? 'منشأة مسجلة لدى المركز الوطني للنخيل والتمور وتملك سبيلاً معتمداً لتوفير الموارد الثانوية.'
                    : 'موقع مرخص رسمياً في سجلاّت وزارة البيئة والمياه والزراعة.'}
                </p>
              </div>

              {/* VERIFICATION METADATA TABLE */}
              <div className="space-y-3 text-xs bg-white p-5 rounded-2xl border border-slate-100 shadow-sm font-medium">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400">مصدر البيانات:</span>
                  <span className="font-bold text-emerald-950 text-left truncate max-w-[160px] bg-slate-50 px-2 py-1 rounded-md">{selectedSource.data_source}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400">درجة الموثوقية:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedSource.verification_status === 'verified' ? 'عالية (سجل رسمي)' : 'متوسطة (قيد التحقق)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">تاريخ التحقق:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedSource.last_verified_at || '2026-01-15'}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3 pt-2">
                {selectedSource.lat && selectedSource.lng && (
                  <a
                    href={getDirectionsUrl(selectedSource.lat, selectedSource.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-950 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:shadow-emerald-900/30 group"
                  >
                    <span>الحصول على الاتجاهات</span>
                    <Navigation className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
                
                {selectedSource.website && (
                  <a
                    href={selectedSource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-emerald-200 text-slate-800 font-bold py-3.5 rounded-2xl text-sm transition-all hover:bg-slate-50 group"
                  >
                    <span>فتح الموقع الإلكتروني للمصدر</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full text-slate-400 hover:text-emerald-700 py-2 rounded-xl text-xs font-bold transition-colors underline underline-offset-4"
              >
                العودة لقائمة جميع الجهات
              </button>

            </motion.div>
          ) : (
            /* DEFAULT SOURCES LIST PANEL */
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6 h-full max-h-[600px] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                  قائمة الجهات والمصادر
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-black px-2 py-1 rounded-lg">{filteredSources.length}</span>
              </div>

              {filteredSources.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">لا توجد مواقع مطابقة للفلاتر الحالية.</p>
                  <button
                    onClick={() => { setSearchTerm(""); setFilterType("all"); setFilterVerification("all"); setFilterRegion("all"); }}
                    className="text-xs text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-xl"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSources.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSource(s)}
                      className="w-full text-right p-4 rounded-2xl bg-white border-2 border-slate-50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-900/5 transition-all space-y-2 block group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-950 leading-tight">{s.name}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold shrink-0 ${
                          s.verification_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.verification_status === 'verified' ? 'موثق' : 'مراجعة'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{s.location_address || s.city_name}</span>
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
