"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Building2, ShieldCheck, 
  AlertCircle, Database, Clock, ShieldAlert, CheckCircle2,
  Search, Filter, Maximize2, RotateCcw, ExternalLink, Navigation, Compass, ChevronLeft
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
        <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-xs shrink-0 relative z-10 mt-6 md:mt-0">
          <div className="text-center px-4">
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">إجمالي المصادر</span>
            <span className="text-2xl font-black text-white">{sources.length}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center px-4">
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">مواقع موثقة</span>
            <span className="text-2xl font-black text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div className="text-center px-4 hidden sm:block">
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">المناطق المغطاة</span>
            <span className="text-2xl font-black text-amber-400">{new Set(sources.map(s => s.region_id)).size}</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div className="text-center px-4 hidden sm:block">
            <span className="text-[10px] text-emerald-200/70 font-bold block uppercase mb-1">حالة الشبكة</span>
            <span className="text-sm font-black text-emerald-300 flex items-center gap-1 mt-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> متصل نشط</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN MAP AREA & SIDE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative lg:min-h-[700px] flex-1">
        
        {/* HERO MAP CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-8 bg-white border border-slate-200/80 rounded-[2.5rem] p-3 shadow-xl shadow-slate-200/50 relative overflow-hidden h-[450px] lg:h-[700px] order-1 lg:order-2"
        >
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
             <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> موثق رسمياً
             </span>
             <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span> يحتاج تحقق
             </span>
          </div>

          <div className="absolute inset-0 bg-slate-50 rounded-[2rem] overflow-hidden z-0">
            <MapComponent 
              sources={filteredSources} 
              selectedSourceId={selectedSource?.id}
              onSelectSource={(s) => setSelectedSource(s)} 
            />
          </div>
        </motion.div>

        {/* DETAIL SIDE PANEL / LIST */}
        <div className="lg:col-span-4 h-[500px] lg:h-[700px] flex flex-col order-2 lg:order-1">
          
          {selectedSource ? (
            /* SELECTED SOURCE DETAIL PANEL */
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 space-y-6 h-full overflow-y-auto custom-scrollbar"
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
                      <span>قيد المراجعة</span>
                    </>
                  )}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold">
                  {selectedSource.source_type === 'factory' ? 'مصنع تمور' : selectedSource.source_type === 'collection_center' ? 'مركز تجميع' : 'مزرعة'}
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
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">الربط بمنظومة نواة:</span>
                <p className="text-slate-800 font-bold leading-relaxed text-xs">
                  {selectedSource.data_source.includes('المركز الوطني')
                    ? 'هذا المصدر مسجل في الشبكة كنقطة توفير نوى معتمدة قابلة للتتبع.'
                    : 'نقطة معالجة مرتبطة بسجلات رسمية.'}
                </p>
              </div>

              {/* VERIFICATION METADATA TABLE */}
              <div className="space-y-3 text-xs bg-white p-5 rounded-2xl border border-slate-100 shadow-sm font-medium">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400">مصدر البيانات:</span>
                  <span className="font-bold text-emerald-950 text-left truncate max-w-[160px] bg-slate-50 px-2 py-1 rounded-md">{selectedSource.data_source}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400">حالة الربط:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط في المنصة
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3 pt-2">
                {selectedSource.lat && selectedSource.lng && (
                  <a
                    href={getDirectionsUrl(selectedSource.lat, selectedSource.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:-translate-y-0.5 group"
                  >
                    <span>استكشاف الموقع جغرافياً</span>
                    <Navigation className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                العودة لشبكة المصادر
              </button>

            </motion.div>
          ) : (
            /* DEFAULT SOURCES LIST PANEL */
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 flex flex-col h-full"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    الشبكة الموثقة
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">اختر موقعاً لاستكشاف نقطة الربط</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Database className="w-5 h-5" />
                </div>
              </div>

              {/* SEARCH */}
              <div className="mb-4 relative shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث سريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-bold focus:border-emerald-400 focus:outline-none transition-colors"
                />
              </div>

              {filteredSources.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">لا توجد مواقع مطابقة.</p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredSources.map((s) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={s.id}
                      onClick={() => setSelectedSource(s)}
                      className="w-full cursor-pointer p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-4 group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${s.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="text-xs font-black text-slate-800 line-clamp-1">{s.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500">
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{s.city_name || "غير محدد"}</span>
                        </div>
                      </div>
                      <div className="shrink-0 pl-1">
                        <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </motion.div>
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
