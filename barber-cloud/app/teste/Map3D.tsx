"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const LIME_400 = "#a3e635"
const LIME_400_GLOW = "rgba(163, 230, 53, 0.6)"
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty"
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

export interface MapPoint {
  id: string
  address: string
  lat?: number
  lng?: number
  label?: string
}

interface Map3DProps {
  points: MapPoint[]
  initialCenter?: [number, number]
  initialZoom?: number
}

async function geocodeAddress(
  address: string,
): Promise<[number, number] | null> {
  try {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`
    const res = await fetch(url, { headers: { "Accept-Language": "pt-BR" } })
    if (!res.ok) return null

    const data = await res.json()
    const first = data?.[0]
    return first ? [parseFloat(first.lon), parseFloat(first.lat)] : null
  } catch (err) {
    console.error("Erro ao geocodificar endereço:", address, err)
    return null
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function Map3D({
  points,
  initialCenter = [-46.6333, -23.5505],
  initialZoom = 13,
}: Map3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})
  const [loading, setLoading] = useState(true)
  const [resolvedPoints, setResolvedPoints] = useState<MapPoint[]>([])
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null)

  // ---- Inicializa o mapa ----
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URL,
      center: initialCenter,
      zoom: initialZoom,
      pitch: 60,
      bearing: -17,
      antialias: true,
    })

    map.current = m

    m.on("load", () => {
      // Céu e neblina claros
      try {
        m.setSky({
          "sky-color": "#f0f4f8",
          "horizon-color": "#ffffff",
          "fog-color": "#ffffff",
        } as any)
      } catch (e) {
        /* Suprimido */
      }

      const style = m.getStyle()
      style?.layers?.forEach((layer) => {
        const id = layer.id.toLowerCase()
        try {
          // Oculta pontos de interesse (POIs) e transporte
          if (
            id.includes("poi") ||
            id.includes("amenity") ||
            id.includes("shop") ||
            id.includes("station") ||
            id.includes("transit") ||
            id.includes("transport")
          ) {
            m.setLayoutProperty(layer.id, "visibility", "none")
            return
          }

          // CUSTOMIZAÇÃO DO TEMA CLARO
          if (layer.type === "background") {
            m.setPaintProperty(layer.id, "background-color", "#ffffff")
          } else if (
            layer.type === "fill" &&
            (id.includes("water") || id.includes("land"))
          ) {
            // Água em tom azul-cinza claro, terra em branco/cinza suave
            m.setPaintProperty(
              layer.id,
              "fill-color",
              id.includes("water") ? "#e0e6ed" : "#f8f9fa",
            )
          } else if (layer.type === "line") {
            if (id.includes("water")) {
              m.setPaintProperty(layer.id, "line-color", "#cbd5e1")
            } else if (
              id.includes("road") ||
              id.includes("street") ||
              id.includes("highway")
            ) {
              // Ruas em cinza claro para contraste sutil
              m.setPaintProperty(layer.id, "line-color", "#e2e8f0")
            }
          }
        } catch (e) {
          /* Suprimido */
        }
      })

      // Camada de prédios 3D em tom claro
      try {
        const sourceId =
          style?.sources &&
          Object.keys(style.sources).find((s) =>
            ["openmaptiles", "maptiler_planet", "protomaps"].includes(s),
          )
        if (sourceId && !m.getLayer("3d-buildings-lime")) {
          m.addLayer({
            id: "3d-buildings-lime",
            source: sourceId,
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": "#f1f5f9", // Prédios brancos/cinza-claro
              "fill-extrusion-height": [
                "coalesce",
                ["get", "render_height"],
                ["get", "height"],
                8,
              ],
              "fill-extrusion-base": [
                "coalesce",
                ["get", "render_min_height"],
                ["get", "min_height"],
                0,
              ],
              "fill-extrusion-opacity": 0.85,
            },
          })
        }
      } catch (e) {
        /* Suprimido */
      }

      setLoading(false)
    })

    m.addControl(new maplibregl.NavigationControl(), "top-right")

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove())
      markersRef.current = {}
      m.remove()
      map.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Geocoding ----
  useEffect(() => {
    let cancelled = false

    async function resolveAll() {
      const resolved: MapPoint[] = []
      for (const p of points) {
        if (cancelled) return
        if (p.lat != null && p.lng != null) {
          resolved.push(p)
          continue
        }
        const coords = await geocodeAddress(p.address)
        if (coords) {
          resolved.push({ ...p, lng: coords[0], lat: coords[1] })
        }
        await sleep(1100)
      }
      if (!cancelled) setResolvedPoints(resolved)
    }

    if (points.length > 0) resolveAll()
    else setResolvedPoints([])

    return () => {
      cancelled = true
    }
  }, [points])

  // ---- Marcadores ----
  useEffect(() => {
    const currentMap = map.current
    if (!currentMap) return

    const currentIds = new Set(resolvedPoints.map((p) => p.id))

    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    resolvedPoints.forEach((point) => {
      if (point.lng == null || point.lat == null) return

      if (markersRef.current[point.id]) {
        markersRef.current[point.id].setLngLat([point.lng, point.lat])
        return
      }

      const el = document.createElement("div")
      el.className = "map3d-marker"
      el.innerHTML =
        '<div class="map3d-marker-pulse"></div><div class="map3d-marker-dot"></div>'

      el.addEventListener("click", () => setActivePoint(point))

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([point.lng, point.lat])
        .addTo(currentMap)

      markersRef.current[point.id] = marker
    })
  }, [resolvedPoints])

  const flyTo = useCallback((point: MapPoint) => {
    if (!map.current || point.lng == null || point.lat == null) return
    map.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 16,
      pitch: 65,
      bearing: -17,
      duration: 1200,
    })
    setActivePoint(point)
  }, [])

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
                className={`map3d-panel-item ${activePoint?.id === p.id ? "is-active" : ""}`}
                onClick={() => flyTo(p)}
              >
                <span className="map3d-panel-bullet" />
                <span className="map3d-panel-address">
                  {p.label || p.address}
                </span>
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
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            sans-serif;
        }
        .map3d-container {
          width: 100%;
          height: 100%;
          min-height: 480px;
        }

        /* ---------- Loading Claro ---------- */
        .map3d-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #ffffff;
          color: #1e293b;
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

        /* ---------- Marcador (Alto contraste no fundo claro) ---------- */
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
          /* Borda escura fina para o marcador "saltar" no fundo branco */
          box-shadow:
            0 0 0 2px rgba(15, 23, 42, 0.9),
            0 0 14px 4px ${LIME_400_GLOW};
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
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes map3d-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        /* ---------- Painel Lateral Claro ---------- */
        .map3d-panel {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 260px;
          max-height: calc(100% - 32px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(163, 230, 53, 0.5);
          border-radius: 10px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
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
          border-bottom: 1px solid rgba(163, 230, 53, 0.2);
        }
        .map3d-panel-count {
          color: #4d7c0f; /* Tom de verde levemente mais escuro para leitura no branco */
          font-weight: 700;
          font-size: 15px;
          font-variant-numeric: tabular-nums;
        }
        .map3d-panel-title {
          color: #64748b;
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
          background: rgba(163, 230, 53, 0.18);
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
          color: #334155;
          font-size: 12.5px;
          line-height: 1.4;
        }

        /* ---------- Controles do MapLibre Atualizados ---------- */
        .maplibregl-ctrl-top-right .maplibregl-ctrl {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(163, 230, 53, 0.3);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .maplibregl-ctrl-group button {
          filter: none; /* Mantém os ícones escuros padrão para fundo claro */
        }
        .maplibregl-ctrl-attrib {
          background: rgba(255, 255, 255, 0.7) !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #64748b !important;
        }
      `}</style>
    </div>
  )
}
