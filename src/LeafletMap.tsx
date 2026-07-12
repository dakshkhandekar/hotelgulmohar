import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
  googleMapsUrl?: string;
}

const defaultIcon = L.icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LeafletMap({
  lat,
  lng,
  zoom = 15,
  popupText = '',
  googleMapsUrl = '',
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    L.Marker.prototype.options.icon = defaultIcon;

    const map = L.map(containerRef.current).setView([lat, lng], zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);

    if (popupText) {
      const popupContent = googleMapsUrl
        ? `${popupText}<br><a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color:#b45309;font-weight:600;">Open in Google Maps &rarr;</a>`
        : popupText;
      marker.bindPopup(popupContent);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom, popupText, googleMapsUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px]"
      style={{ background: '#e7e5e4' }}
    />
  );
}
