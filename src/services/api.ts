import { ApiMatch, ApiMatchDetailResponse, CuriositySet } from '@/types';

// O base path é /api para rodar via Route Handlers no Next.js
const API_BASE = '/api';

async function handleFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na chamada da API: ${response.status} - ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchMatches(status?: string, matchday?: number): Promise<ApiMatch[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (matchday) params.append('matchday', matchday.toString());

  const queryString = params.toString();
  const url = `${API_BASE}/matches${queryString ? `?${queryString}` : ''}`;
  
  try {
    return await handleFetch<ApiMatch[]>(url);
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    return [];
  }
}

export async function fetchMatch(id: number): Promise<ApiMatchDetailResponse | null> {
  try {
    return await handleFetch<ApiMatchDetailResponse>(`${API_BASE}/matches/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar detalhes da partida ${id}:`, error);
    return null;
  }
}

export async function fetchStandings(): Promise<any[]> {
  try {
    return await handleFetch<any[]>(`${API_BASE}/standings`);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return [];
  }
}

export async function fetchCuriosities(matchId: number): Promise<CuriositySet | null> {
  try {
    return await handleFetch<CuriositySet>(`${API_BASE}/curiosity?matchId=${matchId}`);
  } catch (error) {
    console.error(`Erro ao buscar curiosidades do jogo ${matchId}:`, error);
    return null;
  }
}

export async function fetchCuriositiesHistory(): Promise<CuriositySet[]> {
  try {
    return await handleFetch<CuriositySet[]>(`${API_BASE}/curiosity`);
  } catch (error) {
    console.error('Erro ao buscar histórico de curiosidades:', error);
    return [];
  }
}
export type { ApiMatch, ApiMatchDetailResponse, CuriositySet };
