'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useMatch } from '@/hooks/useMatches';
import { useCuriosity } from '@/hooks/useCuriosity';
import CuriosityCard from '@/components/CuriosityCard';
import { MatchDetailSkeleton, CuriositySkeleton } from '@/components/Skeleton';
import { Calendar, MapPin, Sparkles, ChevronLeft, Award, AlertCircle, Database } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JogoDetalhePage({ params }: PageProps) {
  // Desembrulha os parâmetros de rota dinâmicos do Next.js 16
  const { id } = use(params);
  const matchId = parseInt(id, 10);

  // 1. Busca os detalhes da partida com caching reativo
  const { data: match, isLoading: loadingMatch, isError: errorMatch } = useMatch(matchId);

  // 2. Busca as curiosidades geradas pela IA
  const { data: curiositySet, isLoading: loadingCuriosity, isError: errorCuriosity } = useCuriosity(matchId);

  const fallbackCrest = 'https://www.thesportsdb.com/images/media/team/badge/small/unknown.png';

  if (loadingMatch) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <MatchDetailSkeleton />
        </div>
      </div>
    );
  }

  if (errorMatch || !match) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6 flex items-center justify-center">
        <div className="text-center py-16 glass rounded-3xl border border-white/5 max-w-lg mx-auto p-8 space-y-4 animate-fade-in">
          <AlertCircle className="mx-auto text-red-500" size={48} />
          <h1 className="text-2xl font-black">Erro ao carregar partida</h1>
          <p className="text-sm text-slate-400">
            Não foi possível localizar os dados desta partida. O ID pode estar incorreto ou a API externa está indisponível no momento.
          </p>
          <Link
            href="/jogos"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/5 font-bold transition-all text-sm"
          >
            <ChevronLeft size={16} />
            Voltar para Jogos
          </Link>
        </div>
      </div>
    );
  }

  // Desestruturação segura com fallbacks padrão
  const {
    homeTeam,
    awayTeam,
    score,
    status,
    matchday,
    stage,
    group,
    utcDate,
    referees = [],
    goals = []
  } = match;

  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinished = status === 'FINISHED';

  // Formata data e hora com segurança
  let formattedDate = 'A definir';
  let formattedTime = '--:--';
  if (utcDate) {
    try {
      const dateObj = new Date(utcDate);
      formattedDate = dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Erro ao formatar data no detalhe do jogo:', e);
    }
  }

  // Segurança para nomes e escudos dos times
  const homeName = homeTeam?.name || 'A definir';
  const homeTla = homeTeam?.tla || 'TBD';
  const homeCrest = homeTeam?.crest || fallbackCrest;

  const awayName = awayTeam?.name || 'A definir';
  const awayTla = awayTeam?.tla || 'TBD';
  const awayCrest = awayTeam?.crest || fallbackCrest;

  // Segurança para placar
  const hasScore = score && score.fullTime && score.fullTime.home !== null && score.fullTime.away !== null;
  const homeScore = score?.fullTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? 0;

  // Verifica se há gols registrados para decidir se mostra a seção de gols
  const hasGoals = goals && goals.length > 0;

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Link de Retorno */}
        <div>
          <Link
            href="/jogos"
            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Jogos
          </Link>
        </div>

        {/* =========================================================================
            HEADER VISUALMENTE IMPACTANTE (Grande Placar da Copa)
            ========================================================================= */}
        <section className="glass rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden text-center space-y-6 shadow-2xl shadow-black/20">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />

          {/* Badge de Status */}
          <div className="flex justify-center">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider animate-pulse-live shadow-lg shadow-red-950/20">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Partida Ao Vivo
              </span>
            ) : isFinished ? (
              <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Resultado Final
              </span>
            ) : (
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Partida Agendada
              </span>
            )}
          </div>

          {/* Duelo de Gigantes */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4">
            {/* Casa */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center p-3 border border-white/5 shadow-2xl overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={homeCrest}
                  onError={(e: any) => { e.target.src = fallbackCrest; }}
                  alt={homeName}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="font-black text-slate-100 text-lg md:text-xl tracking-tight leading-tight">
                {homeName}
              </h2>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{homeTla}</span>
            </div>

            {/* Placar / VS */}
            <div className="flex flex-col items-center gap-2">
              {hasScore || isLive ? (
                <div className="flex items-center gap-4 font-mono font-black text-5xl md:text-6xl text-white tracking-tighter">
                  <span className={isLive ? 'text-red-400' : 'text-slate-100'}>{homeScore}</span>
                  <span className="text-slate-600 text-3xl">:</span>
                  <span className={isLive ? 'text-red-400' : 'text-slate-100'}>{awayScore}</span>
                </div>
              ) : (
                <div className="font-black text-2xl text-slate-600 uppercase tracking-widest bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5">
                  VS
                </div>
              )}
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {stage === 'GROUP_STAGE' ? `Grupo ${group?.replace('GROUP_', '') || 'A'}` : (stage || 'Fase de Grupos')}
              </span>
            </div>

            {/* Fora */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center p-3 border border-white/5 shadow-2xl overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={awayCrest}
                  onError={(e: any) => { e.target.src = fallbackCrest; }}
                  alt={awayName}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="font-black text-slate-100 text-lg md:text-xl tracking-tight leading-tight">
                {awayName}
              </h2>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{awayTla}</span>
            </div>
          </div>

          {/* Data e Local */}
          <p className="text-xs text-slate-400 font-semibold tracking-wide capitalize flex items-center justify-center gap-1">
            <Calendar size={12} className="text-emerald-400" />
            <span>{formattedDate} às {formattedTime}</span>
          </p>
        </section>

        {/* =========================================================================
            CORPO DO DETALHE (Curiosidades IA + Estatísticas / Gols)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lado Esquerdo: Curiosidades da IA (O Grande Diferencial de TV) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-400 animate-float" size={20} />
              <h2 className="text-2xl font-black tracking-tight text-slate-100">
                Insights de Transmissão (IA)
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Database size={10} />
                Dados em Cache
              </span>
            </div>

            {loadingCuriosity ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <CuriositySkeleton key={i} />
                ))}
              </div>
            ) : errorCuriosity || !curiositySet || !curiositySet.curiosities || curiositySet.curiosities.length === 0 ? (
              <div className="text-center py-12 glass rounded-3xl border border-white/5">
                <AlertCircle className="mx-auto text-slate-600 mb-3" size={32} />
                <p className="font-bold text-slate-300">Não foi possível gerar os insights para este jogo.</p>
                <p className="text-xs text-slate-500">Tente atualizar a página em alguns instantes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curiositySet.curiosities.map((curiosity, index) => (
                  <CuriosityCard
                    key={curiosity.id}
                    curiosity={curiosity}
                    matchId={matchId}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lado Direito: Acontecimentos / Gols e Ficha Técnica */}
          <div className="space-y-6">
            
            {/* Gols da Partida (CRÍTICO: Esconde a seção se não houver gols) */}
            {hasGoals && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-black tracking-tight text-slate-200 flex items-center gap-2">
                  <span>⚽</span> Marcadores de Gols
                </h3>
                
                <div className="glass rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl">
                  <div className="space-y-3">
                    {goals.map((goal, idx) => {
                      const scorerName = goal?.scorer?.name || 'Jogador';
                      const goalMin = goal?.minute ?? '?';
                      const goalTeamTla = goal?.team?.name === homeName ? homeTla : awayTla;

                      return (
                        <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-b-0">
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-black text-emerald-400">{goalMin}'</span>
                            <span className="font-bold text-slate-200 truncate">{scorerName}</span>
                            {goal.type === 'OWN' && <span className="text-[9px] font-black text-red-400 uppercase bg-red-500/10 px-1.5 py-0.5 rounded">Contra</span>}
                            {goal.type === 'PENALTY' && <span className="text-[9px] font-black text-yellow-400 uppercase bg-yellow-500/10 px-1.5 py-0.5 rounded">Pênalti</span>}
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{goalTeamTla}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Ficha Técnica */}
            <div className="space-y-4">
              <h3 className="text-lg font-black tracking-tight text-slate-200 flex items-center gap-2">
                <Award size={16} className="text-blue-400" />
                Ficha Técnica
              </h3>
              
              <div className="glass rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl text-xs font-medium">
                {/* Rodada */}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Fase / Rodada</span>
                  <span className="text-slate-200 font-bold">
                    {stage === 'GROUP_STAGE' ? `Grupo ${group?.replace('GROUP_', '') || 'A'} - Rodada ${matchday || '1'}` : (stage || 'Fase de Grupos')}
                  </span>
                </div>
                
                {/* Estádio / Local */}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Sede</span>
                  <span className="text-slate-200 font-bold flex items-center gap-1">
                    <MapPin size={11} className="text-blue-400" />
                    Estados Unidos / México / Canadá
                  </span>
                </div>

                {/* Árbitro */}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Árbitro</span>
                  <span className="text-slate-200 font-bold truncate max-w-[150px]">
                    {referees && referees.length > 0 && referees[0]?.name ? referees[0].name : 'A definir'}
                  </span>
                </div>

                {/* Status Técnico */}
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Status da API</span>
                  <span className="text-slate-300 font-black tracking-widest uppercase text-[10px]">{status || 'SCHEDULED'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
