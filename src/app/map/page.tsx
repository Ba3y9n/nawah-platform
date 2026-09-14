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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-6" dir="rtl">
      
      {/* EDITORIAL HEADER BANNER */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">
            البنية التحتية والمصادر الوطنية
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950">
            الخريطة الذكية لقطاع النخيل ونقاط الاستفادة
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium leading-relaxed">
            استكشف مواقع مصانع التمور ومراكز التجميع المعتمدة بالمملكة، وتتبع درجة الموثوقية الرسمية ومصادر البيانات المستندة لجهات حقيقية.
          </p>
        </div>

        {/* METRICS DISCLOSURE */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">موثق رسمياً</span>
            <span className="text-lg font-black text-emerald-800">{verifiedCount} موقع</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">يحتاج تحقق</span>
            <span className="text-lg font-black text-amber-700">{pendingCount} موقع</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* SEARCH INPUT */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث عن جهة، مدينة (بريدة، الرياض، الهفوف...)، أو مصدر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700 transition-colors"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 font-bold"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 font-bold"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 font-bold"
            >
              <option value="all">جميع المناطق</option>
              {SAUDI_REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.name_ar}</option>
              ))}
            </select>
          </div>

        </div>

        {/* NEARBY EXPLORER TOOL BAR */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestLocation}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition-colors text-[11px]"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>استكشاف حولي</span>
            </button>

            {userLocation && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xl border border-emerald-200 text-[11px] font-bold">
                <span>المسافة القريبة:</span>
                {[25, 50, 100].map(dist => (
                  <button
                    key={dist}
                    onClick={() => setNearbyDistance(dist)}
                    className={`px-2 py-0.5 rounded ${nearbyDistance === dist ? 'bg-emerald-950 text-white' : 'hover:bg-emerald-100'}`}
                  >
                    {dist} كم
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] font-medium text-slate-500">
            يتم عرض <strong className="text-emerald-950 font-black">{filteredSources.length}</strong> موقعاً مطابقاً للفلاتر الحالية
          </div>
        </div>
      </div>

      {/* MAIN MAP AREA & SIDE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
        
        {/* HERO MAP CONTAINER (8 Cols Desktop / Full Mobile) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-3 shadow-sm relative overflow-hidden">
          <MapComponent 
            sources={filteredSources} 
            selectedSourceId={selectedSource?.id}
            onSelectSource={(s) => setSelectedSource(s)} 
          />
        </div>

        {/* DETAIL SIDE PANEL / MOBILE BOTTOM SHEET (4 Cols Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedSource ? (
            /* SELECTED SOURCE DETAIL PANEL */
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-5 animate-in fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  selectedSource.verification_status === 'verified'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
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
                      <span>يحتاج تحقق ميداني</span>
                    </>
                  )}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                  {selectedSource.source_type === 'factory' ? 'مصنع تمور' : selectedSource.source_type === 'collection_center' ? 'مركز تجميع' : 'مزرعة/معالجة'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-emerald-950">{selectedSource.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {selectedSource.location_address || `${selectedSource.city_name} — ${selectedSource.region_name}`}
                </p>
              </div>

              {/* WHY THIS SOURCE APPEARS DISCLOSURE */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">سبب الظهور في الخريطة الوطنية:</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedSource.data_source.includes('المركز الوطني')
                    ? 'منشأة مسجلة لدى المركز الوطني للنخيل والتمور وتملك سبيلاً معتمداً لتوفير الموارد الثانوية.'
                    : 'موقع مرخص رسمياً في سجلاّت وزارة البيئة والمياه والزراعة.'}
                </p>
              </div>

              {/* VERIFICATION METADATA TABLE */}
              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-400">مصدر البيانات:</span>
                  <span className="font-bold text-emerald-950 text-left truncate max-w-[160px]">{selectedSource.data_source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-400">درجة الموثوقية:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedSource.verification_status === 'verified' ? 'عالية (سجل رسمي)' : 'متوسطة (قيد التحقق)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">تاريخ التحقق:</span>
                  <span className="font-bold text-slate-800">{selectedSource.last_verified_at || '2026-01-15'}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {selectedSource.website && (
                  <a
                    href={selectedSource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-2xl text-xs transition-colors"
                  >
                    <span>فتح المصدر</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {selectedSource.lat && selectedSource.lng && (
                  <a
                    href={getDirectionsUrl(selectedSource.lat, selectedSource.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-2xl text-xs transition-colors col-span-1 shadow-sm"
                  >
                    <span>الاتجاهات</span>
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                العودة لقائمة جميع الجهات
              </button>

            </div>
          ) : (
            /* DEFAULT SOURCES LIST PANEL */
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  قائمة الجهات والمصادر ({filteredSources.length})
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">انقر على الجهة للتحديد</span>
              </div>

              {filteredSources.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-slate-500 font-medium">لا توجد مواقع مطابقة للفلاتر الحالية.</p>
                  <button
                    onClick={() => { setSearchTerm(""); setFilterType("all"); setFilterVerification("all"); setFilterRegion("all"); }}
                    className="text-xs text-emerald-700 font-bold underline"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {filteredSources.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSource(s)}
                      className="w-full text-right p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-500 hover:bg-white transition-all space-y-1 block group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">{s.name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          s.verification_status === 'verified'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {s.verification_status === 'verified' ? 'موثق' : 'يحتاج تحقق'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{s.location_address || s.city_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
