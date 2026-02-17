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

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([31.5, 34.9], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    if (selectedId) {
      const school = schools.find(s => s.id === selectedId);
      if (school) {
        mapInstanceRef.current.flyTo([school.lat, school.lng], 14);
      }
    }
  }, [selectedId, schools]);

  // התיקון הקריטי: גובה מוגדר בפיקסלים ומיקום יחסי
  return <div ref={mapContainerRef} style={{ height: '700px', width: '100%', position: 'relative', zIndex: 0 }} />;
};

export default MapComponent;
