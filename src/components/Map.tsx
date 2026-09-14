"use client";

import { useEffect, useRef } from "react";
import { VerifiedSource } from "@/lib/types";

interface MapProps {
  sources: VerifiedSource[];
  onSelectSource: (source: VerifiedSource) => void;
}

export default function Map({ sources, onSelectSource }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      
      // Inject CSS if missing
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!leafletMapRef.current && mapRef.current) {
        // Center on Saudi Arabia (Riyadh / Qassim)
        const map = L.map(mapRef.current as HTMLElement).setView([25.0, 44.5], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for verified & pending sources
      sources.forEach((src) => {
        if (src.lat && src.lng) {
          const isVerified = src.verification_status === 'verified';
          const markerBg = isVerified ? '#022b1e' : '#f59e0b';
          const markerBorder = isVerified ? '#10b981' : '#d97706';

          const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div style="background-color: ${markerBg}; color: #ffffff; font-weight: bold; width: 30px; height: 30px; border-radius: 50%; display: flex; items-center: center; justify-content: center; border: 2.5px solid ${markerBorder}; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-size: 14px; line-height: 28px; text-align: center;">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });

          const marker = L.marker([src.lat, src.lng], { icon: customIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; text-align: right; direction: rtl; padding: 6px;">
              <strong style="color: #022c22; font-size: 13px; display: block; margin-bottom: 2px;">${src.name}</strong>
              <span style="font-size: 11px; color: ${isVerified ? '#047857' : '#b45309'}; display: inline-block; font-weight: bold;">
                ${isVerified ? '✓ موثق رسمياً' : '⏳ قيد التحقق الميداني'}
              </span>
              <span style="font-size: 10px; color: #6b7280; display: block; margin-top: 4px;">${src.data_source || 'وزارة البيئة والمياه والزراعة'}</span>
            </div>
          `);

          marker.on('click', () => {
            onSelectSource(src);
          });
        }
      });
    };

    loadLeaflet();
  }, [sources, onSelectSource]);

  return (
    <div 
      ref={mapRef} 
      className="h-[480px] w-full rounded-2xl border border-slate-200 z-10 overflow-hidden shadow-inner" 
    />
  );
}
