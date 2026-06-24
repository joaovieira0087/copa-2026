import { NextRequest, NextResponse } from 'next/server';
import { getStandings } from '@/lib/football-api';
import { cacheGet, cacheSet } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const CACHE_KEY = 'standings';
  const CACHE_TTL = 300; // 5 minutos de cache para a tabela

  try {
    // 1. Tenta obter do cache Redis / Memória
    const cachedData = await cacheGet<any[]>(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // 2. Se não estiver no cache, busca da API oficial
    const apiData = await getStandings();
    
    if (!apiData || !apiData.standings) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Formata os dados para o frontend de forma limpa e otimizada
    const formattedGroups = apiData.standings.map((groupEntry) => {
      // Traduz "GROUP_A" -> "Grupo A"
      const groupName = groupEntry.group
        ? groupEntry.group.replace('GROUP_', 'Grupo ')
        : 'Sem Grupo';

      const teams = groupEntry.table.map((entry) => ({
        position: entry.position,
        id: entry.team.id,
        name: entry.team.name,
        shortName: entry.team.shortName || entry.team.name,
        tla: entry.team.tla,
        logo: entry.team.crest,
        played: entry.playedGames,
        won: entry.won,
        draw: entry.draw,
        lost: entry.lost,
        points: entry.points,
        goalsFor: entry.goalsFor,
        goalsAgainst: entry.goalsAgainst,
        goalDifference: entry.goalDifference,
      }));

      return {
        name: groupName,
        teams,
      };
    });

    // 4. Salva no cache
    await cacheSet(CACHE_KEY, formattedGroups, CACHE_TTL);

    return NextResponse.json(formattedGroups, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: any) {
    console.error('API Standings: Erro ao buscar classificação:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados de classificação', message: error.message },
      { status: 500 }
    );
  }
}
