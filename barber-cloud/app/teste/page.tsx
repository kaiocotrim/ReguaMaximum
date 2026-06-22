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
    address: 'Rua Dr. Renato Paes de Barros, 390, São Paulo, SP',
    label: 'Barbearia Corleone - Itaim Bibi',
  },
  {
    id: '2',
    address: 'Rua Augusta, 1371, São Paulo, SP',
    label: 'Barbearia 9 de Julho - Consolação',
  },
  {
    id: '3',
    address: 'Rua Girassol, 394, São Paulo, SP',
    label: 'Barbearia Cavalera - Vila Madalena',
  },
  {
    id: '4',
    address: 'Rua Américo Brasiliense, 1729, São Paulo, SP',
    label: 'Barbearia Tarantino - Chácara Santo Antônio',
  },
  {
    id: '5',
    address: 'Avenida Agami, 183, São Paulo, SP',
    label: 'Garagem Barbearia - Moema',
  },
  {
    id: '6',
    address: 'Rua Pamplona, 1115, São Paulo, SP',
    label: 'Circus Hair - Jardim Paulista',
  },
  {
    id: '7',
    address: 'Rua Augusta, 902, São Paulo, SP',
    label: 'Retrô Hair - Cerqueira César',
  },
  {
    id: '8',
    address: 'Rua João de Sousa Dias, 292, São Paulo, SP',
    label: 'Dom Ladino - Campo Belo',
  },
  {
    id: '9',
    address: 'Praça Vilaboim, 85, São Paulo, SP',
    label: 'Estúdio Becca - Higienópolis',
  },
  {
    id: '10',
    address: 'Rua Madre de Deus, 530, São Paulo, SP',
    label: 'Big Boss - Mooca',
  },
];

export default function ExemploPage() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <Map3D points={enderecos} initialCenter={[-46.6333, -23.5505]} initialZoom={13} />
    </div>
  );
}