import { ApiMatchResponse, ApiStandingsResponse, ApiMatchDetailResponse } from '@/types';

const API_BASE = 'https://api.football-data.org/v4';

// Função para pausar a execução e respeitar os limites de requisição da API gratuita (10 req/min)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFromFootballApi<T>(endpoint: string, tags?: string[]): Promise<T> {
  const apiKey = process.env.FOOTBALL_DATA_KEY;
  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_KEY não configurada no arquivo .env.local');
  }

  // Pequeno delay para evitar colisões rápidas de requests no desenvolvimento local
  await delay(200);

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': apiKey,
    },
    next: {
      revalidate: 300, // Cache de 5 minutos por padrão no Next.js
      tags,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na requisição à API Football (${response.status}): ${errorText}`);
    throw new Error(`Erro na API externa: ${response.status} - ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getMatches(status?: string, matchday?: number): Promise<ApiMatchResponse> {
  let endpoint = '/competitions/WC/matches';
  const queryParams = new URLSearchParams();

  if (status) {
    queryParams.append('status', status);
  }
  if (matchday) {
    queryParams.append('matchday', matchday.toString());
  }

  const queryString = queryParams.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }

  return fetchFromFootballApi<ApiMatchResponse>(endpoint, ['matches']);
}

export async function getMatch(id: number): Promise<ApiMatchDetailResponse> {
  return fetchFromFootballApi<ApiMatchDetailResponse>(`/matches/${id}`, [`match-${id}`]);
}

export async function getStandings(): Promise<ApiStandingsResponse> {
  return fetchFromFootballApi<ApiStandingsResponse>('/competitions/WC/standings', ['standings']);
}
