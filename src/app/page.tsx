'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Countdown from '@/components/Countdown';
import GroupSection from '@/components/GroupSection';
import MatchCard from '@/components/MatchCard';
import { useMatches } from '@/hooks/useMatches';
import { fetchCuriositiesHistory } from '@/services/api';
import { MatchSkeleton, CuriositySkeleton } from '@/components/Skeleton';
import { Sparkles, Calendar, Trophy, Share2, Award, Zap } from 'lucide-react';
import CuriosityCard from '@/components/CuriosityCard';

export default function Home() {
  // 1. Busca os jogos em andamento ou do dia
  const { data: liveMatches, isLoading: loadingLive } = useMatches('IN_PLAY');
  const { data: finishedMatches, isLoading: loadingFinished } = useMatches('FINISHED');
  const { data: scheduledMatches, isLoading: loadingScheduled } = useMatches('SCHEDULED');

  // 2. Busca o histórico de curiosidades mais recentes geradas
  const { data: curiosityHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['wc-curiosities-home-history'],
    queryFn: fetchCuriositiesHistory,
    staleTime: 60000,
  });

  // Filtra ou une partidas para exibição de destaque na home
  const activeMatches = liveMatches && liveMatches.length > 0 
    ? liveMatches 
    : (scheduledMatches ? scheduledMatches.slice(0, 3) : []);

  const recentCuriosities = curiosityHistory ? curiosityHistory.slice(0, 3) : [];

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 overflow-hidden">
      
      {/* =========================================================================
          HERO SECTION (Super Premium Dark com Gradiente e Floating Particles)
          ========================================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#0a1128] via-[#070a13] to-[#070a13] text-white px-6 overflow-hidden">
        {/* Efeitos estéticos de fundo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Grid decorativo */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-8 shadow-lg shadow-emerald-950/20">
            <Sparkles size={12} className="text-yellow-400" />
            FIFA World Cup 2026 — Inteligência Artificial
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            A COPA COMO VOCÊ <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              NUNCA VIU
            </span>
          </h1>

          <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-400 font-medium mb-10 leading-relaxed">
            Nossa IA analisa estatísticas em tempo real para criar narrativas virais e cenários "E se..." instigantes sobre cada duelo na América do Norte.
          </p>

          {/* Contador de Abertura / Status do Torneio */}
          <Countdown />

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link
              href="/jogos"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-950/30 hover:shadow-emerald-500/20 hover:scale-105"
            >
              <Calendar size={16} />
              Explorar Partidas
            </Link>
            <Link
              href="/curiosidades"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black text-sm uppercase tracking-wider transition-all duration-300 border border-white/5 hover:border-white/10 hover:scale-105"
            >
              <Sparkles size={16} className="text-yellow-400" />
              Histórico de Insights
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PARTIDAS EM DESTAQUE (Cards de Jogos Dinâmicos)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto py-16 px-6 relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Tempo Real</span>
            <h2 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Jogos em Destaque</h2>
          </div>
          <Link
            href="/jogos"
            className="text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-wider flex items-center gap-1 group"
          >
            Ver Calendário Completo
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {loadingLive || loadingScheduled ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <MatchSkeleton key={i} />
            ))}
          </div>
        ) : activeMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
            <Calendar className="mx-auto text-slate-600 mb-4" size={40} />
            <p className="font-bold text-slate-300 mb-1">Nenhuma partida agendada para hoje.</p>
            <p className="text-xs text-slate-500">Confira o calendário completo para ver jogos anteriores.</p>
          </div>
        )}
      </section>

      {/* =========================================================================
          CURIOSIDADES RECENTES (Seção Core da IA)
          ========================================================================= */}
      {recentCuriosities.length > 0 && (
        <section className="max-w-7xl mx-auto py-16 px-6 relative z-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Viralizando 🔥</span>
              <h2 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Últimos Insights da IA</h2>
            </div>
            <Link
              href="/curiosidades"
              className="text-xs font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-wider flex items-center gap-1 group"
            >
              Ver Todas as Curiosidades
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCuriosities.map((item, idx) => (
              <CuriosityCard
                key={item.matchId}
                curiosity={item.curiosities[0]} // Mostra a primeira curiosidade gerada do jogo
                matchId={item.matchId}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          CLASSIFICAÇÃO DE GRUPOS (Preview da Tabela)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto py-16 px-6 pb-28 relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Tabela</span>
            <h2 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Classificação dos Grupos</h2>
          </div>
          <Link
            href="/grupos"
            className="text-xs font-black text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center gap-1 group"
          >
            Ver Tabela Completa
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <GroupSection />
      </section>

    </main>
  );
}
