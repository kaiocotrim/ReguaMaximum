'use client';

import Map3D, { MapPoint } from './Map3D';

// ============================================================================
// COLE SEUS ENDEREÇOS AQUI
// Cada item vira um ponto verde lime-400 com destaque no mapa.
// Basta colocar o "address" — o componente já faz o geocoding sozinho
// (gratuito, via OpenStreetMap/Nominatim).
// (Opcional: se já tiver lat/lng, pode informar direto e pula o geocoding)
// ============================================================================
const enderecos: MapPoint[] = [
  {
    id: '1',
    address: 'Av. Paulista, 1578, São Paulo, SP',
    label: 'Av. Paulista, 1578',
  },
  {
    id: '2',
    address: 'Rua Oscar Freire, 379, São Paulo, SP',
    label: 'Rua Oscar Freire, 379',
  },
  {
    id: '3',
    address: 'Parque Ibirapuera, São Paulo, SP',
    label: 'Parque Ibirapuera',
  },
];

export default function ExemploPage() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <Map3D points={enderecos} initialCenter={[-46.6333, -23.5505]} initialZoom={13} />
    </div>
  );
}