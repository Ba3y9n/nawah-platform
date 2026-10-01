"use client";

import { useEffect, useRef } from "react";
import { VerifiedSource } from "@/lib/types";

interface MapProps {
  sources: VerifiedSource[];
  onSelectSource: (source: VerifiedSource) => void;
  selectedSourceId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
}

// Calculate Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

// Color coding based on authentic entity types
function getEntityColor(type: string): { bg: string; border: string; glow: string; label: string } {
  switch (type) {
    case 'government':
      return { bg: '#047857', border: '#065f46', glow: 'rgba(4, 120, 87, 0.45)', label: 'جهة حكومية' };
    case 'research_center':
      return { bg: '#4338ca', border: '#3730a3', glow: 'rgba(67, 56, 202, 0.45)', label: 'مركز أبحاث وجامعة' };
    case 'laboratory':
      return { bg: '#0e7490', border: '#155e75', glow: 'rgba(14, 116, 144, 0.45)', label: 'مختبر وتحاليل' };
    case 'recycling_processing':
      return { bg: '#d97706', border: '#b45309', glow: 'rgba(217, 119, 6, 0.45)', label: 'مصنع تدوير ومعالجة' };
    case 'factory':
      return { bg: '#15803d', border: '#166534', glow: 'rgba(21, 128, 61, 0.45)', label: 'مصنع تمور' };
    case 'collection_center':
      return { bg: '#2563eb', border: '#1d4ed8', glow: 'rgba(37, 99, 235, 0.45)', label: 'مركز تجميع' };
    default:
      return { bg: '#059669', border: '#047857', glow: 'rgba(5, 150, 105, 0.45)', label: 'جهة معتمدة' };
  }
}

export default function Map({ sources, onSelectSource, selectedSourceId, userLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const style = document.createElement("style");
        style.innerHTML = `
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.85; }
            100% { transform: scale(2.6); opacity: 0; }
          }
          @keyframes user-pulse {
            0% { transform: scale(0.9); opacity: 0.9; }
            50% { transform: scale(1.4); opacity: 0.3; }
            100% { transform: scale(0.9); opacity: 0.9; }
          }
          .leaflet-control-attribution {
            font-size: 10px !important;
            background: rgba(255,255,255,0.85) !important;
            color: #64748b !important;
            border-top-left-radius: 6px;
            padding: 3px 8px !important;
          }
          .leaflet-control-attribution a {
            color: #047857 !important;
            font-weight: 600;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            padding: 0;
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .custom-popup .leaflet-popup-content {
            margin: 0;
            font-family: inherit;
          }
          .custom-popup .leaflet-popup-tip {
            background: #ffffff;
          }
        `;
        document.head.appendChild(style);
      }

      if (!leafletMapRef.current && mapRef.current) {
        const map = L.map(mapRef.current as HTMLElement, {
          center: [25.0, 44.5],
          zoom: 6,
          zoomControl: false,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
        });

        // OpenStreetMap standard tile provider without API Key
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | منصة نواة الوطنية GIS',
          maxZoom: 19,
          className: 'map-tiles'
        }).addTo(map);

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;

      // Handle custom control events from window
      const handleZoomIn = () => map.zoomIn();
      const handleZoomOut = () => map.zoomOut();
      const handleReset = () => map.flyTo([25.0, 44.5], 6, { duration: 1.2 });
      const handleLocate = () => {
        if (userLocation) {
          map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.5 });
        } else if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((pos) => {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1.5 });
          });
        }
      };

      window.addEventListener('map-zoom-in', handleZoomIn);
      window.addEventListener('map-zoom-out', handleZoomOut);
      window.addEventListener('map-reset', handleReset);
      window.addEventListener('map-locate', handleLocate);

      // Clear previous entity markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
          map.removeLayer(layer);
        }
      });
      markersRef.current = {};

      // Draw User Location Marker if available
      if (userLocation) {
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userMarkerHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(37, 99, 235, 0.25); animation: user-pulse 2s infinite ease-in-out;"></div>
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(37, 99, 235, 0.4); animation: pulse-ring 1.8s infinite;"></div>
            <div style="
              position: relative;
              width: 16px;
              height: 16px;
              background: #2563eb;
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 12px rgba(37, 99, 235, 0.8);
              z-index: 5;
            "></div>
          </div>
        `;

        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: userMarkerHtml,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindTooltip("موقعك الحالي (تقديري)", {
            direction: 'top',
            offset: [0, -12],
            className: 'bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded-lg border-0 shadow-md'
          });
      }

      // Draw Authentic Entities
      sources.forEach((src) => {
        if (src.lat && src.lng) {
          const isSelected = selectedSourceId === src.id;
          const colorMeta = getEntityColor(src.source_type);

          const markerHtml = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
              ${isSelected ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${colorMeta.bg}; animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>` : ''}
              <div style="
                position: relative;
                width: ${isSelected ? '26px' : '18px'};
                height: ${isSelected ? '26px' : '18px'};
                background: ${colorMeta.bg};
                border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
                border-radius: 50%;
                box-shadow: 0 0 16px ${colorMeta.glow};
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2;
                cursor: pointer;
              "></div>
            </div>
          `;

          const customIcon = L.divIcon({
            className: `nawah-entity-marker entity-${src.id}`,
            html: markerHtml,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
          });

          const marker = L.marker([src.lat, src.lng], { icon: customIcon }).addTo(map);

          // Calculate distance if user location is known
          const distanceStr = (userLocation && src.lat && src.lng)
            ? formatDistance(calculateDistance(userLocation.lat, userLocation.lng, src.lat, src.lng))
            : null;

          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${src.lat},${src.lng}`;

          // Create rich interactive popup card
          const popupContent = `
            <div style="direction: rtl; text-align: right; width: 260px; font-family: inherit;">
              <div style="background: #047857; color: #ffffff; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 10px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 2px 8px; rounded: 6px; display: inline-block; margin-bottom: 4px;">
                  ${src.type_label || colorMeta.label}
                </span>
                <h4 style="margin: 0; font-size: 13px; font-weight: 800; line-height: 1.4;">${src.name}</h4>
              </div>
              
              <div style="padding: 12px 14px; background: #ffffff;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; color: #64748b;">
                  <span>الموقع:</span>
                  <strong style="color: #0f172a;">${src.city_name || 'السعودية'} (${src.region_name || ''})</strong>
                </div>

                ${distanceStr ? `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; color: #047857; background: #ecfdf5; padding: 4px 8px; border-radius: 6px;">
                  <span>المسافة:</span>
                  <strong>${distanceStr}</strong>
                </div>` : ''}

                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 10px; color: #64748b;">
                  <span>الحالة:</span>
                  <strong style="color: #059669;">✓ ${src.verification_status === 'verified' ? 'جهة موثقة رسمياً' : 'قيد التدقيق'}</strong>
                </div>

                <div style="display: flex; gap: 6px; margin-top: 8px;">
                  <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #047857; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 700; padding: 6px 0; border-radius: 8px;">
                    الاتجاهات ↗
                  </a>
                  ${src.website ? `
                  <a href="${src.website}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #f1f5f9; color: #0f172a; text-decoration: none; font-size: 11px; font-weight: 700; padding: 6px 0; border-radius: 8px; border: 1px solid #e2e8f0;">
                    الموقع الرسمي
                  </a>` : ''}
                </div>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 280,
            offset: [0, -10]
          });

          marker.on('click', () => {
            onSelectSource(src);
            map.flyTo([src.lat!, src.lng!], 12, { duration: 1.2, easeLinearity: 0.25 });
          });

          markersRef.current[src.id] = marker;
        }
      });

      // Cleanup
      return () => {
        window.removeEventListener('map-zoom-in', handleZoomIn);
        window.removeEventListener('map-zoom-out', handleZoomOut);
        window.removeEventListener('map-reset', handleReset);
        window.removeEventListener('map-locate', handleLocate);
      };
    };

    loadLeaflet();
  }, [sources, onSelectSource, selectedSourceId, userLocation]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full z-0 overflow-hidden touch-pan-x touch-pan-y rounded-2xl" 
    />
  );
}
