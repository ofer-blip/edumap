import React, { useEffect, useRef } from 'react';
import { School } from '../types';
import { COLORS, TYPE_ICONS, TYPE_LABELS } from '../constants';

interface MapComponentProps {
  schools: School[];
  onMarkerClick: (id: string) => void;
  selectedId: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ schools, onMarkerClick, selectedId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    // אתחול המפה עם הגדרות לתיקון תצוגה
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([31.5, 34.9], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;

    // תיקון קריטי: רענון המפה לאחר חצי שנייה כדי לוודא שהיא נצבעת נכון
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // ניקוי סמנים קיימים
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    schools.forEach(school => {
      const colorClass = COLORS[school.type].replace('bg-', '');
      const iconHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-125 bg-${colorClass} ${selectedId === school.id ? 'ring-4 ring-blue-300 scale-125' : ''}">
            <i class="fas ${TYPE_ICONS[school.type]} text-white text-xs"></i>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([school.lat, school.lng], { icon })
        .addTo(mapInstanceRef.current)
        .on('click', () => onMarkerClick(school.id));
      
      const popupContent = `
        <div class="p-3 text-right" dir="rtl">
          <h3 class="font-bold text-blue-900">${school.name}</h3>
          <p class="text-xs text-gray-500 mb-2">${school.city}</p>
          <div class="flex items-center gap-1.5 mb-3">
             <span class="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-${colorClass}">${TYPE_LABELS[school.type]}</span>
             <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">${school.grades}</span>
          </div>
          <div class="flex flex-col gap-2">
            <a href="https://waze.com/ul?q=${encodeURIComponent(school.name + ' ' + school.city)}" target="_blank" class="bg-blue-600 text-white py-2 px-2 rounded text-xs text-center font-bold">ניווט בוויז</a>
            <a href="https://www.google.com/search?q=${encodeURIComponent(school.name + ' ' + school.city)}" target="_blank" class="border border-gray-300 py-2 px-2 rounded text-xs text-center font-bold text-gray-700">חיפוש בגוגל</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'custom-popup' });
      markersRef.current[school.id] = marker;
    });

    if (selectedId && markersRef.current[selectedId]) {
      const school = schools.find(s => s.id === selectedId);
      if (school) {
        mapInstanceRef.current.flyTo([school.lat, school.lng], 14);
        markersRef.current[selectedId].openPopup();
      }
    }
  }, [schools, selectedId, onMarkerClick]);

  // הגדרת סטייל ישיר להבטחת תצוגה - זה התיקון הקריטי למפה הלבנה
return <div ref={mapContainerRef} style={{ height: '600px', width: '100%', position: 'relative' }} />;
};

export default MapComponent;
