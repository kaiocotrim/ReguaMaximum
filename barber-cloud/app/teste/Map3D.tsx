'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// ============================================================================
// 100% GRATUITO — sem token, sem conta, sem cartão de crédito
// Tiles: OpenFreeMap (https://openfreemap.org) — uso livre e ilimitado
// Engine: MapLibre GL JS (open source, fork do Mapbox GL)
// ============================================================================

const LIME_400 = '#a3e635';
const LIME_400_GLOW = 'rgba(163, 230, 53, 0.55)';

// Estilo "liberty" do OpenFreeMap já vem com camada de prédios em 3D
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// Endpoint de geocoding gratuito (Nominatim/OpenStreetMap, sem chave)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// ============================================================================
// TIPOS
// ============================================================================
export interface MapPoint {
  id: string;
  address: string;
  lat?: number;
  lng?: number;
  label?: string;
}

interface Map3DProps {
  /** Lista de endereços/pontos a destacar no mapa */
  points: MapPoint[];
  /** Centro inicial do mapa [lng, lat]. Padrão: São Paulo */
  initialCenter?: [number, number];
  initialZoom?: number;
}

// ============================================================================
// GEOCODING gratuito via Nominatim (OpenStreetMap) — sem chave de API
// Respeita o limite de uso justo da Nominatim (~1 req/s)
// ============================================================================
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'pt-BR' },
    });
    const data = await res.json();
    const first = data?.[0];
    if (!first) return null;
    return [parseFloat(first.lon), parseFloat(first.lat)];
  } catch (err) {
    console.error('Erro ao geocodificar endereço:', address, err);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function Map3D({
  points,
  initialCenter = [-46.6333, -23.5505], // São Paulo
  initialZoom = 13,
}: Map3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [loading, setLoading] = useState(true);
  const [resolvedPoints, setResolvedPoints] = useState<MapPoint[]>([]);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  // ---- Inicializa o mapa ----
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URL,
      center: initialCenter,
      zoom: initialZoom,
      pitch: 60,
      bearing: -17,
      antialias: true,
    });

    map.current.on('load', () => {
      if (!map.current) return;
      const m = map.current;

      // Céu preto
      try {
        m.setSky({
          'sky-color': '#000000',
          'horizon-color': '#000000',
          'fog-color': '#000000',
        } as any);
      } catch {
        /* sky pode não estar disponível dependendo da versão do style */
      }

      // Recolore o fundo / água / terreno para preto
      const style = m.getStyle();
      style?.layers?.forEach((layer) => {
        const id = layer.id.toLowerCase();
        try {
          if (layer.type === 'background') {
            m.setPaintProperty(layer.id, 'background-color', '#000000');
          }
          if (layer.type === 'fill' && (id.includes('water') || id.includes('land'))) {
            m.setPaintProperty(layer.id, 'fill-color', id.includes('water') ? '#050505' : '#000000');
          }
          if (layer.type === 'line' && id.includes('water')) {
            m.setPaintProperty(layer.id, 'line-color', '#0a0a0a');
          }
          // ruas em cinza bem escuro pra contrastar discretamente com o preto
          if (layer.type === 'line' && (id.includes('road') || id.includes('street') || id.includes('highway'))) {
            m.setPaintProperty(layer.id, 'line-color', '#1a1a1a');
          }
        } catch {
          /* propriedade pode não existir nesse layer, ignora */
        }
      });

      // Adiciona prédios em 3D se a fonte vetorial existir
      try {
        const sourceId = style?.sources && Object.keys(style.sources).find((s) =>
          ['openmaptiles', 'maptiler_planet', 'protomaps'].includes(s)
        );
        if (sourceId && !m.getLayer('3d-buildings-lime')) {
          m.addLayer({
            id: '3d-buildings-lime',
            source: sourceId,
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': '#0d0d0d',
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 8],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
              'fill-extrusion-opacity': 0.92,
            },
          });
        }
      } catch {
        /* fonte de prédios não disponível neste style — segue sem 3D extrudado */
      }

      setLoading(false);
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Resolve endereços -> coordenadas (geocoding gratuito, sequencial p/ respeitar rate limit) ----
  useEffect(() => {
    let cancelled = false;

    async function resolveAll() {
      const resolved: MapPoint[] = [];
      for (const p of points) {
        if (cancelled) return;
        if (p.lat != null && p.lng != null) {
          resolved.push(p);
          continue;
        }
        const coords = await geocodeAddress(p.address);
        if (coords) {
          resolved.push({ ...p, lng: coords[0], lat: coords[1] });
        } else {
          console.warn('Não foi possível geocodificar:', p.address);
        }
        await sleep(1100); // respeita o limite de uso justo da Nominatim
      }
      if (!cancelled) setResolvedPoints(resolved);
    }

    if (points.length > 0) resolveAll();
    else setResolvedPoints([]);

    return () => {
      cancelled = true;
    };
  }, [points]);

  // ---- Cria/atualiza marcadores lime-400 com destaque ----
  useEffect(() => {
    if (!map.current) return;

    const currentIds = new Set(resolvedPoints.map((p) => p.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    resolvedPoints.forEach((point) => {
      if (point.lng == null || point.lat == null) return;

      if (markersRef.current[point.id]) {
        markersRef.current[point.id].setLngLat([point.lng, point.lat]);
        return;
      }

      const el = document.createElement('div');
      el.className = 'map3d-marker';
      el.innerHTML = `
        <div class="map3d-marker-pulse"></div>
        <div class="map3d-marker-dot"></div>
      `;
      el.addEventListener('click', () => setActivePoint(point));

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      markersRef.current[point.id] = marker;
    });
  }, [resolvedPoints]);

  // ---- Voa até um ponto ----
  const flyTo = useCallback((point: MapPoint) => {
    if (!map.current || point.lng == null || point.lat == null) return;
    map.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 16,
      pitch: 65,
      duration: 1400,
    });
    setActivePoint(point);
  }, []);

  return (
    <div className="map3d-root">
      <div ref={mapContainer} className="map3d-container" />

      {loading && (
        <div className="map3d-loading">
          <div className="map3d-loading-dot" />
          <span>Carregando mapa…</span>
        </div>
      )}

      {resolvedPoints.length > 0 && (
        <div className="map3d-panel">
          <div className="map3d-panel-header">
            <span className="map3d-panel-count">{resolvedPoints.length}</span>
            <span className="map3d-panel-title">Pontos marcados</span>
          </div>
          <ul className="map3d-panel-list">
            {resolvedPoints.map((p) => (
              <li
                key={p.id}
                className={`map3d-panel-item ${activePoint?.id === p.id ? 'is-active' : ''}`}
                onClick={() => flyTo(p)}
              >
                <span className="map3d-panel-bullet" />
                <span className="map3d-panel-address">{p.label || p.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx global>{`
        .map3d-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 480px;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        }

        .map3d-container {
          width: 100%;
          height: 100%;
          min-height: 480px;
        }

        /* ---------- Loading ---------- */
        .map3d-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #000;
          color: ${LIME_400};
          font-size: 14px;
          letter-spacing: 0.02em;
          z-index: 5;
        }
        .map3d-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: ${LIME_400};
          animation: map3d-pulse 1s ease-in-out infinite;
        }

        /* ---------- Marker ---------- */
        .map3d-marker {
          position: relative;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .map3d-marker-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: ${LIME_400};
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.85), 0 0 14px 4px ${LIME_400_GLOW};
          z-index: 2;
        }
        .map3d-marker-pulse {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: ${LIME_400_GLOW};
          animation: map3d-marker-pulse 1.8s ease-out infinite;
          z-index: 1;
        }

        @keyframes map3d-marker-pulse {
          0% {
            transform: scale(0.4);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes map3d-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* ---------- Painel lateral ---------- */
        .map3d-panel {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 260px;
          max-height: calc(100% - 32px);
          background: rgba(0, 0, 0, 0.82);
          border: 1px solid rgba(163, 230, 53, 0.25);
          border-radius: 10px;
          backdrop-filter: blur(6px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 4;
        }
        .map3d-panel-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 14px 16px 10px;
          border-bottom: 1px solid rgba(163, 230, 53, 0.15);
        }
        .map3d-panel-count {
          color: ${LIME_400};
          font-weight: 700;
          font-size: 15px;
          font-variant-numeric: tabular-nums;
        }
        .map3d-panel-title {
          color: #d4d4d4;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .map3d-panel-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          overflow-y: auto;
        }
        .map3d-panel-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 9px 10px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .map3d-panel-item:hover,
        .map3d-panel-item.is-active {
          background: rgba(163, 230, 53, 0.1);
        }
        .map3d-panel-bullet {
          margin-top: 5px;
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 999px;
          background: ${LIME_400};
          box-shadow: 0 0 6px 1px ${LIME_400_GLOW};
        }
        .map3d-panel-address {
          color: #e5e5e5;
          font-size: 12.5px;
          line-height: 1.4;
        }

        /* ---------- MapLibre overrides ---------- */
        .maplibregl-ctrl-top-right .maplibregl-ctrl {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(163, 230, 53, 0.25);
        }
        .maplibregl-ctrl-group button {
          filter: invert(1);
        }
        .maplibregl-ctrl-attrib {
          background: rgba(0, 0, 0, 0.6) !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #888 !important;
        }
      `}</style>
    </div>
  );
}