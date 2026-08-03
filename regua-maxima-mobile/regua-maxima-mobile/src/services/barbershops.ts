export type Barbershop = {
  id: string;
  name: string;
  address: string;
  cidade: string | null;
  imageUrl: string;
  capaUrl: string | null;
  acceptsBookings: boolean;
  latitude: number | null;
  longitude: number | null;
  reviewCount: number;
  averageRating: number | null;
};

export type BarbershopDetails = Barbershop & {
  phones: string[];
  instagram: string | null;
  description: string;
  services: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    duration: number;
  }[];
  barbers: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userName: string;
  }[];
};

type BarbershopResponse = {
  data?: Barbershop[];
  error?: string;
};

type BarbershopDetailsResponse = {
  data?: BarbershopDetails;
  error?: string;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export function getPublicAssetUrl(path: string) {
  if (!apiUrl) return null;
  return `${apiUrl}/${path.replace(/^\//, '')}`;
}

export async function listBarbershops(filters?: { search?: string; service?: string }) {
  if (!apiUrl) {
    throw new Error('Endereço da API não configurado.');
  }

  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set('search', filters.search.trim());
  if (filters?.service?.trim()) params.set('service', filters.service.trim());

  const query = params.toString();
  const response = await fetch(`${apiUrl}/api/barbershops${query ? `?${query}` : ''}`, {
    headers: { Accept: 'application/json' },
  });
  const body = (await response.json()) as BarbershopResponse;

  if (!response.ok) {
    throw new Error(body.error ?? 'Não foi possível carregar as barbearias.');
  }

  return Array.isArray(body.data) ? body.data : [];
}

export async function getBarbershop(id: string) {
  if (!apiUrl) {
    throw new Error('Endereço da API não configurado.');
  }

  const response = await fetch(`${apiUrl}/api/barbershops/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  const body = (await response.json()) as BarbershopDetailsResponse;

  if (!response.ok || !body.data) {
    throw new Error(body.error ?? 'Não foi possível carregar a barbearia.');
  }

  return body.data;
}

type DayAvailabilityResponse = {
  data?: {
    barberIds?: string[];
    firstTimes?: Record<string, string>;
    times?: string[];
  };
  error?: string;
};

async function fetchAvailability(url: string) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  const body = (await response.json()) as DayAvailabilityResponse;

  if (!response.ok) {
    throw new Error(body.error ?? 'Não foi possível consultar os horários.');
  }

  return body.data ?? {};
}

export async function getAvailableBarbers(input: {
  barbershopId: string;
  serviceId: string;
  date: string;
}) {
  if (!apiUrl) throw new Error('Endereço da API não configurado.');

  const params = new URLSearchParams({ serviceId: input.serviceId, date: input.date });
  const data = await fetchAvailability(
    `${apiUrl}/api/barbershops/${encodeURIComponent(input.barbershopId)}/availability?${params}`,
  );

  return {
    barberIds: Array.isArray(data.barberIds) ? data.barberIds : [],
    firstTimes: data.firstTimes ?? {},
  };
}

export async function getAvailableTimes(input: {
  barbershopId: string;
  serviceId: string;
  barberId: string;
  date: string;
}) {
  if (!apiUrl) throw new Error('Endereço da API não configurado.');

  const params = new URLSearchParams({
    serviceId: input.serviceId,
    barberId: input.barberId,
    date: input.date,
  });
  const data = await fetchAvailability(
    `${apiUrl}/api/barbershops/${encodeURIComponent(input.barbershopId)}/availability?${params}`,
  );

  return Array.isArray(data.times) ? data.times : [];
}
