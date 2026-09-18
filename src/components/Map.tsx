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
      
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
        
        const style = document.createElement("style");
        style.innerHTML = `
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
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

        // Clean Tech Light Basemap
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; CARTO',
          maxZoom: 19
        }).addTo(map);

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;

      // Clear layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
      markersRef.current = {};

      const coordinates: [number, number][] = [];

      sources.forEach((src) => {
        if (src.lat && src.lng) {
          coordinates.push([src.lat, src.lng]);
          const isSelected = selectedSourceId === src.id;
          const isVerified = src.verification_status === 'verified';
          
          const iconColor = isVerified ? '#10b981' : '#f59e0b'; // Emerald or Amber
          const shadowColor = isVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';

          const markerHtml = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
              ${isSelected ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${iconColor}; animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>` : ''}
              <div style="
                position: relative;
                width: ${isSelected ? '24px' : '16px'};
                height: ${isSelected ? '24px' : '16px'};
                background: ${iconColor};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 15px ${shadowColor};
                transition: all 0.3s ease;
                z-index: 2;
              "></div>
            </div>
          `;

          const customIcon = L.divIcon({
            className: 'nawah-tech-marker',
            html: markerHtml,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          const marker = L.marker([src.lat, src.lng], { icon: customIcon }).addTo(map);
          
          marker.on('click', () => {
            onSelectSource(src);
            map.flyTo([src.lat!, src.lng!], 11, { duration: 1.5, easeLinearity: 0.25 });
          });

          markersRef.current[src.id] = marker;
        }
      });

      // Draw dashed connecting lines to represent "Tracking / Digital Bridge"
      if (coordinates.length > 1) {
        L.polyline(coordinates, {
          color: '#34d399',
          weight: 1.5,
          opacity: 0.4,
          dashArray: '5, 10',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }
    };

    loadLeaflet();
  }, [sources, onSelectSource, selectedSourceId]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[500px] lg:min-h-[640px] rounded-[2rem] z-10 overflow-hidden shadow-inner touch-pan-x touch-pan-y" 
    />
  );
}
