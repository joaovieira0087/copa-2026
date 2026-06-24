import { NextRequest, NextResponse } from 'next/server';
import { getMatch, getStandings } from '@/lib/football-api';
import { generateCuriosities } from '@/lib/gemini';
import { cacheGet, cacheSet, cacheKeys } from '@/lib/cache';
import { CuriositySet } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchIdStr = searchParams.get('matchId');

  // =========================================================================
  // CASO 1: SEM MATCH_ID -> Retorna o Histórico de todas as curiosidades (Cache)
  // =========================================================================
  if (!matchIdStr) {
    try {
      const keys = await cacheKeys('curiosity:*');
      const history: CuriositySet[] = [];
      
      for (const key of keys) {
        const item = await cacheGet<CuriositySet>(key);
        if (item) {
          history.push(item);
        }
      }

      // Ordena por data de geração (mais recentes primeiro)
      history.sort((a, b) => {
        return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
      });

      return NextResponse.json(history, {
        headers: { 'X-Cache-History-Count': history.length.toString() }
      });
    } catch (error: any) {
      console.error('API Curiosity History: Erro ao listar histórico:', error);
      return NextResponse.json(
        { error: 'Falha ao buscar histórico de curiosidades', message: error.message },
        { status: 500 }
      );
    }
  }

  // =========================================================================
  // CASO 2: COM MATCH_ID -> Busca ou gera a curiosidade específica do jogo
  // =========================================================================
  const matchId = parseInt(matchIdStr, 10);
  if (isNaN(matchId)) {
    return NextResponse.json({ error: 'ID da partida inválido' }, { status: 400 });
  }

  const cacheKey = `curiosity:${matchId}`;

  try {
    // 1. Tenta buscar do Cache (Custo Zero / Instantâneo)
    const cachedCuriositySet = await cacheGet<CuriositySet>(cacheKey);
    if (cachedCuriositySet) {
      return NextResponse.json(cachedCuriositySet, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // 2. Se for Cache Miss, busca os dados da partida na API oficial
    console.log(`API Curiosity: Cache MISS para o jogo ${matchId}. Buscando dados na API...`);
    const match = await getMatch(matchId);

    if (!match) {
      return NextResponse.json({ error: 'Partida não encontrada para gerar curiosidades' }, { status: 404 });
    }

    // 3. Busca a classificação geral para extrair a tabela do grupo específico
    let groupTableContext: any[] = [];
    try {
      if (match.group) {
        const standingsData = await getStandings();
        if (standingsData && standingsData.standings) {
          // Procura o grupo da partida na lista de standings (ex: "GROUP_A")
          const groupStanding = standingsData.standings.find(
            (s) => s.group === match.group
          );
          if (groupStanding && groupStanding.table) {
            groupTableContext = groupStanding.table.map((entry) => ({
              position: entry.position,
              teamName: entry.team.name,
              playedGames: entry.playedGames,
              points: entry.points,
              won: entry.won,
              draw: entry.draw,
              lost: entry.lost,
              goalsFor: entry.goalsFor,
              goalsAgainst: entry.goalsAgainst,
              goalDifference: entry.goalDifference,
            }));
          }
        }
      }
    } catch (e) {
      console.warn(`API Curiosity: Falha não-bloqueante ao buscar standings para o grupo ${match.group}:`, e);
    }

    // Traduz o placar e formata gols de forma compacta para o Gemini
    const homeScore = match.score?.fullTime?.home ?? 0;
    const awayScore = match.score?.fullTime?.away ?? 0;
    const scoreString = `${match.homeTeam?.name || 'A definir'} ${homeScore} x ${awayScore} ${match.awayTeam?.name || 'A definir'}`;

    // Monta o resumo dos gols
    const goalsFormatted = (match.goals || []).map((g) => ({
      minute: g.minute,
      team: g.team?.name || 'Time',
      scorer: g.scorer?.name || 'Jogador',
      type: g.type,
    }));

    // Extrai retrospecto Head-to-Head (H2H) do objeto retornado pela API oficial
    // Na API v4, a requisição individual do match (/matches/{id}) pode incluir head2head na raiz ou como propriedade.
    const rawH2h = (match as any).head2head;
    const h2hContext = rawH2h ? {
      numberOfMatches: rawH2h.numberOfMatches ?? 0,
      totalGoals: rawH2h.totalGoals ?? 0,
      homeTeam: {
        wins: rawH2h.homeTeam?.wins ?? 0,
        draws: rawH2h.homeTeam?.draws ?? 0,
        losses: rawH2h.homeTeam?.losses ?? 0
      },
      awayTeam: {
        wins: rawH2h.awayTeam?.wins ?? 0,
        draws: rawH2h.awayTeam?.draws ?? 0,
        losses: rawH2h.awayTeam?.losses ?? 0
      }
    } : undefined;

    // 4. Cria o payload enriquecido e enxuto para a IA (garante anti-alucinação)
    const aiContext = {
      matchId: match.id,
      homeTeam: match.homeTeam?.name || 'A definir',
      awayTeam: match.awayTeam?.name || 'A definir',
      score: scoreString,
      goals: goalsFormatted,
      stage: match.stage,
      group: match.group,
      matchday: match.matchday,
      status: match.status,
      head2head: h2hContext,
      groupTable: groupTableContext.length > 0 ? groupTableContext : undefined,
    };

    // 5. Invoca o motor Gemini para gerar os insights de dados
    console.log(`API Curiosity: Chamando a API do Gemini com payload enriquecido para o jogo: ${scoreString}`);
    const curiosities = await generateCuriosities(aiContext);

    // 6. Monta o pacote CuriositySet
    const curiositySet: CuriositySet = {
      matchId,
      homeTeam: match.homeTeam?.name || 'A definir',
      awayTeam: match.awayTeam?.name || 'A definir',
      curiosities,
      generatedAt: new Date().toISOString(),
    };

    // 7. Salva permanentemente no Cache (sem tempo de expiração)
    await cacheSet(cacheKey, curiositySet);
    console.log(`API Curiosity: Curiosidade jornalística para o jogo ${matchId} gerada e salva no cache.`);

    return NextResponse.json(curiositySet, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: any) {
    console.error(`API Curiosity: Erro ao buscar/gerar curiosidades do jogo ${matchId}:`, error);
    return NextResponse.json(
      { error: 'Falha ao processar curiosidades da partida', message: error.message },
      { status: 500 }
    );
  }
}
