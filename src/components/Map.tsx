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

    // Dynamically import leaflet script & CSS if not present
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
        // Initialize Map centered on Saudi Arabia (Riyadh / Qassim)
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

      // Custom Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: #fbbf24; color: #022c22; font-weight: bold; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #022c22; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      // Add markers for verified sources
      sources.forEach((src) => {
        if (src.lat && src.lng) {
          const marker = L.marker([src.lat, src.lng], { icon: customIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; text-align: right; direction: rtl; padding: 4px;">
              <strong style="color: #022c22; font-size: 13px; display: block;">${src.name}</strong>
              <span style="font-size: 11px; color: #047857; display: block;">${src.city_name || ''}</span>
              <span style="font-size: 10px; color: #6b7280; display: block; margin-top: 4px;">${src.data_source}</span>
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
      className="h-[480px] w-full rounded-2xl border border-emerald-200 z-10 overflow-hidden shadow-inner" 
    />
  );
}
