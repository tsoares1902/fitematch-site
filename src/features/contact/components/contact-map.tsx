'use client';

import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MdPlace } from 'react-icons/md';
import { CARD_STYLES } from '@/constants/styles';

const OFFICE_COORDINATES = {
  lat: -23.9684,
  lng: -46.3326,
};

export const OFFICE_ADDRESS_QUERY =
  'R. Quintino Bocaiúva, 3, Gonzaga, Santos - SP, 11060-230, Brasil';

export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  OFFICE_ADDRESS_QUERY,
)}`;

export function ContactMap() {
  const t = useTranslations('contact');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderMap() {
      if (!mapRef.current) {
        return;
      }

      const L = await import('leaflet');

      if (!isMounted || !mapRef.current) {
        return;
      }

      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng],
        zoom: 16,
        scrollWheelZoom: true,
      });

      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const icon = L.divIcon({
        html: renderToStaticMarkup(
          <div className="flex items-center gap-2 rounded-full border border-lime-400/60 bg-black px-3 py-2 shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
            <MdPlace className="h-5 w-5 text-lime-400" />
            <span className="text-sm font-semibold tracking-[-0.04em]">
              <span className="text-zinc-50">fite</span>
              <span className="text-lime-400">match</span>
            </span>
          </div>,
        ),
        className: 'bg-transparent border-0',
        iconSize: [124, 40],
        iconAnchor: [62, 40],
        popupAnchor: [0, -34],
      });

      L.marker([OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng], { icon })
        .addTo(map)
        .bindPopup('fitematch');
    }

    void renderMap();

    return () => {
      isMounted = false;

      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`${CARD_STYLES.jobCard} border-slate-700/70 bg-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.26)]`}
    >
      <div className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-100">
        <MdPlace className="h-6 w-6 text-lime-400" />
        <span>{t('location.title')}</span>
      </div>

      <div className="relative">
        <div ref={mapRef} className="h-[260px] w-full rounded-xl border border-gray-500" />
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-10 right-3 z-[400] inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-black/50 px-3 py-3 text-sm font-medium text-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur transition-colors hover:border-slate-500 hover:bg-black/65"
        >
          {t('location.openMaps')}
          <ExternalLink className="h-4 w-4 text-lime-400" />
        </a>
      </div>

      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-start gap-3 rounded-xl border border-slate-700/70 bg-black/50 px-3 py-3 text-sm text-gray-300 transition-colors hover:border-slate-500 hover:bg-black/65"
      >
        <MdPlace className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
        <div className="leading-6">
          <p>{t('location.addressLine1')}</p>
          <p className="text-gray-400">{t('location.addressLine2')}</p>
        </div>
      </a>
    </div>
  );
}
