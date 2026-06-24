import { useQuery } from '@tanstack/react-query';
import { fetchMatches, fetchMatch } from '@/services/api';

export function useMatches(status?: string, matchday?: number) {
  return useQuery({
    queryKey: ['wc-matches', status || 'all', matchday || 'all'],
    queryFn: () => fetchMatches(status, matchday),
    staleTime: status === 'IN_PLAY' ? 15000 : 300000, // 15 segundos se for ao vivo, 5 minutos se não
    refetchInterval: status === 'IN_PLAY' ? 30000 : false, // Autorefresh a cada 30s se for ao vivo
  });
}

export function useMatch(id: number) {
  return useQuery({
    queryKey: ['wc-match', id],
    queryFn: () => fetchMatch(id),
    staleTime: 60000, // 1 minuto
    enabled: !isNaN(id) && id > 0,
  });
}
