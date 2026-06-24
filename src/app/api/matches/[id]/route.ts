import { NextRequest, NextResponse } from 'next/server';
import { getMatch } from '@/lib/football-api';
import { cacheGet, cacheSet } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const matchId = parseInt(id, 10);

  if (isNaN(matchId)) {
    return NextResponse.json({ error: 'ID da partida inválido' }, { status: 400 });
  }

  const cacheKey = `match:${matchId}`;

  try {
    // 1. Tenta obter do cache
    const cachedData = await cacheGet<any>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // 2. Busca da API externa
    const match = await getMatch(matchId);

    // Determina o tempo de cache com base no status da partida
    let ttl = 300; // 5 minutos padrão
    if (match.status === 'IN_PLAY') {
      ttl = 15; // 15 segundos se estiver rolando em tempo real
    } else if (match.status === 'FINISHED') {
      ttl = 86400; // 24 horas para partidas encerradas
    }

    // 3. Salva no cache
    await cacheSet(cacheKey, match, ttl);

    return NextResponse.json(match, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: any) {
    console.error(`API Match: Erro ao buscar partida ${matchId}:`, error);
    return NextResponse.json(
      { error: `Falha ao buscar detalhes da partida ${matchId}`, message: error.message },
      { status: 500 }
    );
  }
}
