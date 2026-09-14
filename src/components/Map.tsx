"use client";

import { useEffect, useRef } from "react";
import { VerifiedSource } from "@/lib/types";

interface MapProps {
  sources: VerifiedSource[];
  onSelectSource: (source: VerifiedSource) => void;
  selectedSourceId?: string | null;
}

export default function Map({ sources, onSelectSource, selectedSourceId }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

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
        // Center on Saudi Arabia (Qassim / Riyadh center view) with smooth interaction settings
        const map = L.map(mapRef.current as HTMLElement, {
          center: [25.0, 44.5],
          zoom: 6,
          zoomControl: false,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
        });

        // Minimal / Light tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19
        }).addTo(map);

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker: any) => {
        map.removeLayer(marker);
      });
      markersRef.current = {};

      // Add custom styled NAWAH markers
      sources.forEach((src) => {
        if (src.lat && src.lng) {
          const isSelected = selectedSourceId === src.id;
          const isVerified = src.verification_status === 'verified';
          
          let iconColor = '#022c22'; // Emerald dark
          if (src.source_type === 'factory') iconColor = '#047857';
          else if (src.source_type === 'collection_center') iconColor = '#d97706';
          else if (src.source_type === 'farm') iconColor = '#15803d';

          const markerHtml = `
            <div style="
              position: relative;
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              background: ${iconColor};
              border: 2.5px solid ${isVerified ? '#34d399' : '#fbbf24'};
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(2, 44, 34, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            ">
              <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
            </div>
          `;

          const customIcon = L.divIcon({
            className: 'nawah-custom-marker',
            html: markerHtml,
            iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
            iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
          });

          const marker = L.marker([src.lat, src.lng], { icon: customIcon }).addTo(map);
          
          marker.on('click', () => {
            onSelectSource(src);
            map.flyTo([src.lat!, src.lng!], 11, { duration: 1.2 });
          });

          markersRef.current[src.id] = marker;
        }
      });
    };

    loadLeaflet();
  }, [sources, onSelectSource, selectedSourceId]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[420px] lg:min-h-[640px] rounded-2xl z-10 overflow-hidden shadow-inner touch-pan-x touch-pan-y" 
    />
  );
}
