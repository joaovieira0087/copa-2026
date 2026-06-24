import { NextRequest, NextResponse } from 'next/server';
import { getMatches } from '@/lib/football-api';
import { cacheGet, cacheSet } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const matchdayStr = searchParams.get('matchday');
  const matchday = matchdayStr ? parseInt(matchdayStr, 10) : undefined;

  // Define a chave do cache baseada nos filtros aplicados
  const cacheKey = `matches:${status || 'all'}:${matchday || 'all'}`;

  // Determina o tempo de expiração do cache dependendo do status do jogo
  let ttl = 300; // 5 minutos padrão
  if (status === 'IN_PLAY') {
    ttl = 45; // 45 segundos para jogos ao vivo
  } else if (status === 'FINISHED') {
    ttl = 3600; // 1 hora para jogos finalizados
  }

  try {
    // 1. Tenta obter do cache
    const cachedData = await cacheGet<any>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // 2. Busca da API externa
    const data = await getMatches(status, matchday);

    if (!data || !data.matches) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Salva no cache
    await cacheSet(cacheKey, data.matches, ttl);

    return NextResponse.json(data.matches, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: any) {
    console.error(`API Matches: Erro ao buscar partidas para a chave "${cacheKey}":`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados de partidas', message: error.message },
      { status: 500 }
    );
  }
}
