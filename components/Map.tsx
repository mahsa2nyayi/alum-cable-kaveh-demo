"use client";

import { useEffect, useRef } from "react";

interface MapProps {
  lat: number;
  lng: number;
  label: string;
  color?: "orange" | "sky";
}

export default function Map({ lat, lng, label, color = "orange" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstance.current) return;

    // لود داینامیک Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // لود داینامیک Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // تایل OpenStreetMap — از ایران در دسترسه
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // آیکون سفارشی رنگی
      const markerColor = color === "orange" ? "#f97316" : "#38bdf8";
      const icon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
            fill="${markerColor}" stroke="white" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>`,
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -44],
        className: "",
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Vazirmatn,sans-serif;font-size:12px;
            direction:rtl;padding:4px;min-width:120px;text-align:center">
            ${label}
          </div>`
        )
        .openPopup();

      // کمی تاریک کردن نقشه با overlay
      const canvas = mapRef.current.querySelector("canvas");
      if (canvas) canvas.style.filter = "brightness(0.9) saturate(0.85)";

      mapInstance.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng, label, color]);

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10">
      <div ref={mapRef} className="absolute inset-0 z-0" />
    </div>
  );
}
