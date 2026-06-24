import { useQuery } from '@tanstack/react-query';
import { fetchCuriosities, fetchCuriositiesHistory } from '@/services/api';

export function useCuriosity(matchId: number) {
  return useQuery({
    queryKey: ['wc-curiosities', matchId],
    queryFn: () => fetchCuriosities(matchId),
    staleTime: 1000 * 60 * 60 * 24, // As curiosidades geradas sobre um jogo não mudam (24h de cache local)
    gcTime: 1000 * 60 * 60 * 24 * 7, // Mantém no garbage collector por 7 dias
    enabled: !isNaN(matchId) && matchId > 0,
  });
}

export function useCuriositiesHistory() {
  return useQuery({
    queryKey: ['wc-curiosities-history'],
    queryFn: fetchCuriositiesHistory,
    staleTime: 1000 * 60 * 5, // Histórico atualizado a cada 5 minutos
  });
}
