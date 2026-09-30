"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Building2, ShieldCheck, 
  Database, Clock, CheckCircle2,
  Search, Maximize2, Crosshair, ChevronDown, Layers, Map as MapIcon, RotateCcw, Bot
} from "lucide-react";
import { VERIFIED_SOURCES, SAUDI_REGIONS } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-stone-50 flex flex-col items-center justify-center text-slate-400 text-sm font-medium gap-3">
      <MapIcon className="w-8 h-8 text-emerald-600 animate-pulse" strokeWidth={1.5} />
      <span>جاري تحميل الخريطة الذكية...</span>
    </div>
  )
});

export default function SmartMapPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Layer states based on actual data types/statuses
  const [layers, setLayers] = useState({
    verified: true,
    pending: true,
    factory: true,
    collection_center: true,
    farm: true
  });

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

    const isVerified = s.verification_status === 'verified';
    const isPending = s.verification_status === 'needs_verification';
    const isFactory = s.source_type === 'factory';
    const isCollection = s.source_type === 'collection_center';
    const isFarm = s.source_type === 'farm';

    // Layer visibility logic
    const matchesStatus = (isVerified && layers.verified) || (isPending && layers.pending);
    const matchesType = (isFactory && layers.factory) || (isCollection && layers.collection_center) || (isFarm && layers.farm) || (!isFactory && !isCollection && !isFarm);

    return matchesSearch && matchesStatus && matchesType;
  });

  const verifiedCount = sources.filter(s => s.verification_status === 'verified').length;
  const regionsCount = new Set(sources.map(s => s.region_id)).size;

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const mapControls = {
    zoomIn: () => window.dispatchEvent(new CustomEvent('map-zoom-in')),
    zoomOut: () => window.dispatchEvent(new CustomEvent('map-zoom-out')),
    reset: () => window.dispatchEvent(new CustomEvent('map-reset')),
    locate: () => window.dispatchEvent(new CustomEvent('map-locate')),
    fullscreen: () => window.dispatchEvent(new CustomEvent('map-fullscreen')),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 font-sans h-[calc(100vh-80px)] overflow-hidden" dir="rtl">
      
      {/* 1. HERO HEADER */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">الخريطة الذكية لقطاع النخيل</h1>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-100">
              أداة تحليلية وبيانات مكانية
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            منظومة مكانية لتحليل مواقع مصادر التمور ومراكز التجميع والإنتاج، وربط البيانات الجغرافية بمصادر القطاع لدعم التحليل واتخاذ القرار.
          </p>
        </div>

        {/* METRICS DISCLOSURE */}
        <div className="flex items-center gap-6 bg-stone-50 px-6 py-4 rounded-xl border border-stone-200 shrink-0">
          <div className="flex flex-col gap-1 text-center">
            <span className="text-[11px] text-slate-500 font-bold">إجمالي المصادر</span>
            <span className="text-xl font-black text-slate-900">{sources.length}</span>
          </div>
          <div className="w-px h-10 bg-stone-200" />
          <div className="flex flex-col gap-1 text-center">
            <span className="text-[11px] text-slate-500 font-bold">مواقع مرصودة</span>
            <span className="text-xl font-black text-emerald-700">{verifiedCount}</span>
          </div>
          <div className="w-px h-10 bg-stone-200 hidden sm:block" />
          <div className="flex flex-col gap-1 text-center hidden sm:flex">
            <span className="text-[11px] text-slate-500 font-bold">المناطق المغطاة</span>
            <span className="text-xl font-black text-emerald-700">{regionsCount}</span>
          </div>
          <div className="w-px h-10 bg-stone-200 hidden md:block" />
          <div className="flex flex-col gap-1 text-center hidden md:flex">
            <span className="text-[11px] text-slate-500 font-bold">حالة البيانات</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> محدثة
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: LEFT MAP (70%), RIGHT SIDEBAR (30%) */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* RIGHT SIDEBAR (30%) */}
        <aside className="w-full lg:w-[30%] bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden shrink-0">
          <div className="p-5 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-emerald-700" strokeWidth={1.5} />
              لوحة التحكم والطبقات
            </h2>
            <p className="text-xs text-slate-500 mt-1">إدارة عرض البيانات وتحليلها مكانياً</p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar">
            
            {/* SEARCH */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-800">البحث</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن موقع أو منشأة أو منطقة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg pr-9 pl-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={2} />
              </div>
            </div>

            {/* MAP LAYERS */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800">طبقات الخريطة</span>
              <div className="flex flex-col gap-2">
                
                {/* Layer Toggle Items */}
                <label className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-300 bg-white cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={layers.verified} 
                      onChange={() => toggleLayer('verified')}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShieldCheck size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800">مواقع معتمدة</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {sources.filter(s => s.verification_status === 'verified').length}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-300 bg-white cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={layers.pending} 
                      onChange={() => toggleLayer('pending')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer" 
                    />
                    <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800">مواقع قيد التحقق</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    {sources.filter(s => s.verification_status === 'needs_verification').length}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-300 bg-white cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={layers.factory} 
                      onChange={() => toggleLayer('factory')}
                      className="w-4 h-4 rounded text-slate-600 focus:ring-slate-500 cursor-pointer" 
                    />
                    <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800">مصانع تمور</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {sources.filter(s => s.source_type === 'factory').length}
                  </span>
                </label>

              </div>
            </div>

            {/* SELECTED SOURCE DETAILS */}
            {selectedSource && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-stone-200">
                <span className="text-xs font-bold text-slate-800">تفاصيل الموقع المحدد</span>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-600" strokeWidth={2} />
                    <h3 className="font-bold text-slate-900 text-sm">{selectedSource.name}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">المنطقة:</span>
                      <span className="text-slate-800 font-bold">{selectedSource.region_name || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">النوع:</span>
                      <span className="text-slate-800 font-bold">{selectedSource.source_type === 'factory' ? 'مصنع تمور' : 'مركز تجميع'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">الحالة:</span>
                      <span className={selectedSource.verification_status === 'verified' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {selectedSource.verification_status === 'verified' ? 'معتمد' : 'قيد المراجعة'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </aside>

        {/* LEFT MAP AREA (70%) */}
        <main className="w-full lg:w-[70%] bg-white border border-stone-200 rounded-2xl shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
          
          {/* FLOATING MAP CONTROLS */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <button onClick={mapControls.zoomIn} className="w-11 h-11 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors" title="تكبير">
              <span className="text-xl font-bold leading-none mt-1">+</span>
            </button>
            <button onClick={mapControls.zoomOut} className="w-11 h-11 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors" title="تصغير">
              <span className="text-xl font-bold leading-none mt-1">-</span>
            </button>
            <button onClick={mapControls.locate} className="w-11 h-11 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors mt-2" title="موقعي">
              <Crosshair size={18} strokeWidth={1.5} />
            </button>
            <button onClick={mapControls.reset} className="w-11 h-11 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors" title="إعادة الضبط">
              <RotateCcw size={18} strokeWidth={1.5} />
            </button>
            <button onClick={mapControls.fullscreen} className="w-11 h-11 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors" title="ملء الشاشة">
              <Maximize2 size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* MAP LEGEND (Inside Map) */}
          <div className="absolute bottom-6 right-6 z-[400] bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl shadow-sm p-4 w-40 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-500 mb-1">مفتاح الخريطة</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#10b981] border border-white shadow-sm shrink-0"></span>
              موقع معتمد
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#f59e0b] border border-white shadow-sm shrink-0"></span>
              قيد التحقق
            </div>
          </div>

          {/* FLOATING ACTION BUTTON (NAWAH ASSISTANT) */}
          <div className="absolute bottom-6 left-6 z-[400]">
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-lg border border-slate-700 transition-transform hover:-translate-y-1">
              <Bot size={20} strokeWidth={1.5} />
              <span className="font-bold text-sm">مساعد نواة</span>
            </button>
          </div>

          <div className="w-full h-full bg-stone-50 z-0">
            <MapComponent 
              sources={filteredSources} 
              selectedSourceId={selectedSource?.id}
              onSelectSource={(s) => setSelectedSource(s)} 
            />
          </div>
        </main>
      </div>

    </div>
  );
}
