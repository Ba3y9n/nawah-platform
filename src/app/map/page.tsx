"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  MapPin, Building2, ShieldCheck, 
  Search, Maximize2, Crosshair, Layers, Map as MapIcon, 
  RotateCcw, Bot, ExternalLink, Navigation, CheckCircle2,
  GraduationCap, FlaskConical, Recycle, Factory, Warehouse,
  SlidersHorizontal, ArrowUpDown, Info, AlertCircle, Sparkles
} from "lucide-react";
import { VERIFIED_SOURCES, SAUDI_REGIONS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { VerifiedSource } from "@/lib/types";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-stone-50 flex flex-col items-center justify-center text-slate-400 text-sm font-medium gap-3">
      <MapIcon className="w-8 h-8 text-emerald-600 animate-pulse" strokeWidth={1.5} />
      <span>جاري تحميل المنظومة المكانية والبيانات الموثقة...</span>
    </div>
  )
});

// Haversine formula to calculate accurate geodesic distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} م من موقعك`;
  }
  return `${km.toFixed(1)} كم من موقعك`;
}

export default function SmartMapPage() {
  const [sources, setSources] = useState<VerifiedSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<VerifiedSource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByProximity, setSortByProximity] = useState(false);
  
  // User Location State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [isLocating, setIsLocating] = useState(false);

  // Active Category Layers Filter
  const [layers, setLayers] = useState({
    government: true,
    research_center: true,
    laboratory: true,
    recycling_processing: true,
    factory: true,
    collection_center: true,
    verifiedOnly: false
  });

  const [loading, setLoading] = useState(true);

  // Load authentic entities
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();

      const { data: dbSources } = await supabase
        .from('sources')
        .select('*');

      if (dbSources && dbSources.length > 0) {
        setSources(dbSources as VerifiedSource[]);
      } else {
        setSources(VERIFIED_SOURCES);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  // Request browser location
  const handleRequestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus('unsupported');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationStatus('granted');
        setSortByProximity(true);
        setIsLocating(false);
        window.dispatchEvent(new CustomEvent('map-locate'));
      },
      (err) => {
        console.warn("Geolocation permission notice:", err.message);
        setLocationStatus('denied');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle individual filter layer
  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter & Search Logic
  const filteredSources = useMemo(() => {
    return sources.filter(s => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        (s.name || '').toLowerCase().includes(q) ||
        (s.city_name || s.location_address || '').toLowerCase().includes(q) ||
        (s.region_name || '').toLowerCase().includes(q) ||
        (s.type_label || '').toLowerCase().includes(q) ||
        (s.specialty || '').toLowerCase().includes(q) ||
        (s.data_source || '').toLowerCase().includes(q);

      // Layer Filter Matches
      const typeKey = s.source_type as keyof typeof layers;
      const matchesLayer = layers[typeKey] !== undefined ? layers[typeKey] : true;
      const matchesVerified = !layers.verifiedOnly || s.verification_status === 'verified';

      return matchesSearch && matchesLayer && matchesVerified;
    });
  }, [sources, searchTerm, layers]);

  // Sort by distance if requested and location is known
  const sortedSources = useMemo(() => {
    if (!sortByProximity || !userLocation) {
      return filteredSources;
    }

    return [...filteredSources].sort((a, b) => {
      if (!a.lat || !a.lng) return 1;
      if (!b.lat || !b.lng) return -1;
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [filteredSources, sortByProximity, userLocation]);

  // Statistical counts
  const verifiedCount = sources.filter(s => s.verification_status === 'verified').length;
  const researchAndLabsCount = sources.filter(s => s.source_type === 'research_center' || s.source_type === 'laboratory').length;
  const industryAndRecyclingCount = sources.filter(s => s.source_type === 'recycling_processing' || s.source_type === 'factory').length;
  const regionsCount = new Set(sources.map(s => s.region_id)).size;

  const mapControls = {
    zoomIn: () => window.dispatchEvent(new CustomEvent('map-zoom-in')),
    zoomOut: () => window.dispatchEvent(new CustomEvent('map-zoom-out')),
    reset: () => window.dispatchEvent(new CustomEvent('map-reset')),
    locate: () => handleRequestLocation(),
    fullscreen: () => window.dispatchEvent(new CustomEvent('map-fullscreen')),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 font-sans min-h-[calc(100vh-80px)]" dir="rtl">
      
      {/* 1. HERO HEADER */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">الخريطة الذكية لقطاع النخيل والتمور</h1>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
              بيانات موثقة ومعتمدة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            منظومة مكانية وطنية تجمع الجهات الحكومية، مراكز الأبحاث والجامعات، المختبرات المعتمدة، ومصانع إعادة تدوير وتجهيز نوى التمر لربط سلاسل القيمة الجغرافية.
          </p>
        </div>

        {/* METRICS SUMMARY */}
        <div className="flex items-center gap-4 sm:gap-6 bg-stone-50 px-5 py-3 rounded-xl border border-stone-200 shrink-0 overflow-x-auto">
          <div className="flex flex-col gap-0.5 text-center min-w-[70px]">
            <span className="text-[10px] text-slate-500 font-bold">إجمالي الجهات</span>
            <span className="text-lg font-black text-slate-900">{sources.length}</span>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div className="flex flex-col gap-0.5 text-center min-w-[70px]">
            <span className="text-[10px] text-slate-500 font-bold">جهات موثقة</span>
            <span className="text-lg font-black text-emerald-700">{verifiedCount}</span>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div className="flex flex-col gap-0.5 text-center min-w-[80px]">
            <span className="text-[10px] text-slate-500 font-bold">أبحاث ومختبرات</span>
            <span className="text-lg font-black text-indigo-700">{researchAndLabsCount}</span>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden md:block" />
          <div className="flex flex-col gap-0.5 text-center min-w-[80px] hidden md:flex">
            <span className="text-[10px] text-slate-500 font-bold">تدوير وتصنيع</span>
            <span className="text-lg font-black text-amber-700">{industryAndRecyclingCount}</span>
          </div>
        </div>
      </div>

      {/* 2. GEOLOCATION CALLOUT (If not yet enabled) */}
      {locationStatus !== 'granted' && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-950">
                {locationStatus === 'denied' 
                  ? 'لإظهار المسافة من موقعك، فعّل إذن الوصول إلى الموقع في المتصفح.' 
                  : 'اعثر على الجهات والمختبرات الأقرب إلى موقعك الجغرافي'}
              </h4>
              <p className="text-xs text-emerald-800/80 font-medium mt-0.5">
                نستخدم إحداثيات موقعك التقديرية فقط لحساب المسافة وترتيب الجهات من الأقرب للأبعد، دون تخزين موقعك أو مشاركته.
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Crosshair className="w-4 h-4" />
            <span>{isLocating ? 'جاري تحديد موقعك...' : 'تفعيل الموقع وحساب المسافات'}</span>
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE (70% MAP, 30% SIDEBAR) */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[580px] h-[calc(100vh-250px)]">
        
        {/* RIGHT SIDEBAR (30%) - CONTROLS & NEARBY LIST */}
        <aside className="w-full lg:w-[32%] bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden shrink-0">
          
          {/* Header */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Layers size={17} className="text-emerald-700" strokeWidth={2} />
                الجهات وقواعد البيانات المكانية
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">عرض {sortedSources.length} من أصل {sources.length} جهة</span>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => {
                if (!userLocation) {
                  handleRequestLocation();
                } else {
                  setSortByProximity(!sortByProximity);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                sortByProximity && userLocation
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
              }`}
              title="ترتيب النتائج حسب القرب الجغرافي"
            >
              <ArrowUpDown size={13} />
              <span>{sortByProximity && userLocation ? 'الأقرب إليك' : 'الترتيب الافتراضي'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            
            {/* SEARCH BOX */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن جهة، مختبر، أبحاث، تدوير، مدينة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-3 py-2.5 text-xs sm:text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
            </div>

            {/* FILTER CHIPS / LAYERS */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-700 block">تصنيف الطبقات والجهات:</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                
                <button
                  type="button"
                  onClick={() => toggleLayer('government')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.government ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">جهات حكومية</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'government').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('research_center')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.research_center ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">مراكز أبحاث</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'research_center').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('laboratory')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.laboratory ? 'bg-cyan-50/70 border-cyan-200 text-cyan-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">مختبرات وفحوصات</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'laboratory').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('recycling_processing')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.recycling_processing ? 'bg-amber-50/70 border-amber-200 text-amber-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">معالجة وتدوير</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'recycling_processing').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('factory')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.factory ? 'bg-green-50/70 border-green-200 text-green-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">مصانع تمور</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'factory').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('collection_center')}
                  className={`p-2 rounded-lg border text-right flex items-center justify-between transition-colors ${
                    layers.collection_center ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-bold' : 'bg-white border-stone-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">مراكز تجميع</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold shrink-0">
                    {sources.filter(s => s.source_type === 'collection_center').length}
                  </span>
                </button>

              </div>
            </div>

            {/* SELECTED ENTITY DETAIL DRAWER */}
            {selectedSource && (
              <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-lg flex flex-col gap-3 relative animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700">
                      {selectedSource.type_label || 'جهة معتمدة'}
                    </span>
                    <h3 className="font-black text-sm text-white leading-snug">{selectedSource.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="text-emerald-400 hover:text-white text-xs font-bold p-1 rounded hover:bg-emerald-900 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedSource.description || selectedSource.specialty || selectedSource.location_address}
                </p>

                <div className="bg-emerald-900/60 rounded-xl p-2.5 flex flex-col gap-1.5 text-xs text-emerald-100 border border-emerald-800">
                  <div className="flex justify-between">
                    <span className="text-emerald-400">المدينة / المنطقة:</span>
                    <span className="font-bold">{selectedSource.city_name} ({selectedSource.region_name})</span>
                  </div>

                  {userLocation && selectedSource.lat && selectedSource.lng && (
                    <div className="flex justify-between text-emerald-200 bg-emerald-800/60 px-2 py-1 rounded">
                      <span>المسافة التقديرية:</span>
                      <strong className="font-bold">
                        {formatDistance(calculateDistance(userLocation.lat, userLocation.lng, selectedSource.lat, selectedSource.lng))}
                      </strong>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-emerald-400">المصدر:</span>
                    <span className="text-[11px] truncate max-w-[160px]" title={selectedSource.data_source}>
                      {selectedSource.data_source}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {selectedSource.lat && selectedSource.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSource.lat},${selectedSource.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Navigation size={13} />
                      <span>فتح الاتجاهات</span>
                    </a>
                  )}
                  {selectedSource.website && (
                    <a
                      href={selectedSource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                    >
                      <ExternalLink size={13} />
                      <span>الموقع الرسمي</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* LIST OF NEARBY / SEARCHED ENTITIES */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-black text-slate-800">
                {sortByProximity && userLocation ? 'الجهات مرتبة حسب القرب منك:' : 'قائمة الجهات المطابقة:'}
              </span>

              {sortedSources.length === 0 ? (
                <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200 text-slate-400 text-xs font-medium space-y-1">
                  <p>لا توجد جهات مطابقة لمعايير البحث الحالية.</p>
                  <p className="text-[11px] text-slate-400">جرب توسيع نطاق البحث أو تفعيل كافة الطبقات.</p>
                </div>
              ) : (
                sortedSources.map((entity, index) => {
                  const isSelected = selectedSource?.id === entity.id;
                  const distKm = (userLocation && entity.lat && entity.lng)
                    ? calculateDistance(userLocation.lat, userLocation.lng, entity.lat, entity.lng)
                    : null;

                  return (
                    <div
                      key={entity.id}
                      onClick={() => {
                        setSelectedSource(entity);
                        if (entity.lat && entity.lng) {
                          window.dispatchEvent(new CustomEvent('map-fly-to', {
                            detail: { lat: entity.lat, lng: entity.lng }
                          }));
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' 
                          : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-stone-100 text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 truncate">{entity.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0 border border-emerald-100">
                          {entity.type_label || 'معتمد'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          {entity.city_name}
                        </span>

                        {distKm !== null && (
                          <span className="font-black text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                            {formatDistance(distKm)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </aside>

        {/* LEFT MAP (70%) */}
        <main className="w-full lg:w-[68%] min-h-[550px] bg-white border border-stone-200 rounded-2xl shadow-sm relative overflow-hidden flex flex-col flex-1">
          
          {/* FLOATING MAP CONTROLS OVERLAY */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-stone-200 shadow-lg">
            <button 
              onClick={mapControls.zoomIn}
              title="تكبير الخريطة"
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-stone-100 rounded-lg transition-colors font-bold text-lg cursor-pointer"
            >
              +
            </button>
            <button 
              onClick={mapControls.zoomOut}
              title="تصغير الخريطة"
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-stone-100 rounded-lg transition-colors font-bold text-lg cursor-pointer"
            >
              -
            </button>
            <div className="w-full h-px bg-stone-200" />
            <button 
              onClick={mapControls.locate}
              title="تحديد موقعي"
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                userLocation ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-700 hover:bg-stone-100'
              }`}
            >
              <Crosshair size={16} />
            </button>
            <button 
              onClick={mapControls.reset}
              title="إعادة ضبط نطاق الخريطة"
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* MAP LEGEND BADGE (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200 shadow-lg flex flex-col gap-1.5 text-[11px] font-bold text-slate-700 max-w-[280px]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">دليل الرموز المكانية:</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
                <span>جهات حكومية</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca]" />
                <span>مراكز أبحاث</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0e7490]" />
                <span>مختبرات وفحوصات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
                <span>معالجة وتدوير</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                <span>مصانع تمور</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                <span>مراكز تجميع</span>
              </div>
            </div>
          </div>

          {/* NAWAH ASSISTANT FLOATING CTA (Bottom Left) */}
          <Link
            href="/assistant"
            className="absolute bottom-4 left-4 z-20 bg-[#064E3B] hover:bg-[#047857] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 transition-all group"
          >
            <Bot size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>مساعد نواة للتحليل المكاني</span>
          </Link>

          {/* LEAFLET MAP INNER */}
          <div className="w-full h-full min-h-[550px] relative z-0 flex-1">
            <MapComponent 
              sources={filteredSources}
              selectedSourceId={selectedSource?.id}
              onSelectSource={(source) => setSelectedSource(source)}
              userLocation={userLocation}
            />
          </div>

        </main>

      </div>

    </div>
  );
}
