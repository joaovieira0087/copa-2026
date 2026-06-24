'use client';

import { useState } from 'react';
import { useMatches } from '@/hooks/useMatches';
import MatchCard from '@/components/MatchCard';
import { MatchSkeleton } from '@/components/Skeleton';
import { Calendar, Filter, Zap, Sparkles, Award } from 'lucide-react';

export default function JogosPage() {
  // Filtro de status ativo: 'ALL', 'IN_PLAY', 'FINISHED', 'SCHEDULED'
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  // Filtro de rodada ativo: 'ALL' ou número (1 a 3 para grupos, 4+ para eliminatórias)
  const [matchdayFilter, setMatchdayFilter] = useState<string>('ALL');

  // Ajusta o filtro para passar para o custom hook
  const queryStatus = statusFilter === 'ALL' ? undefined : statusFilter;
  const queryMatchday = matchdayFilter === 'ALL' ? undefined : parseInt(matchdayFilter, 10);

  // Busca dados com caching inteligente
  const { data: matches, isLoading, isError } = useMatches(queryStatus, queryMatchday);

  // Filtros de status disponíveis
  const statusOptions = [
    { label: 'Todos os Jogos', value: 'ALL', icon: Calendar },
    { label: 'Ao Vivo', value: 'IN_PLAY', icon: Zap, color: 'text-red-400' },
    { label: 'Encerrados', value: 'FINISHED', icon: Award },
    { label: 'Próximos', value: 'SCHEDULED', icon: Sparkles },
  ];

  // Filtros de rodada disponíveis (Copa 2026 tem 3 rodadas na fase de grupos)
  const matchdayOptions = [
    { label: 'Todas as Rodadas', value: 'ALL' },
    { label: 'Rodada 1', value: '1' },
    { label: 'Rodada 2', value: '2' },
    { label: 'Rodada 3', value: '3' },
  ];

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cabeçalho da Página */}
        <div className="text-center md:text-left space-y-2">
          <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Calendário de Partidas</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            Jogos da <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Copa 2026</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl font-medium">
            Selecione uma partida em andamento ou encerrada para ver análises, ganchos e curiosidades da nossa Inteligência Artificial baseada em dados oficiais.
          </p>
        </div>

        {/* =========================================================================
            BARRA DE FILTROS (Glassmorphism e Altamente Responsivo)
            ========================================================================= */}
        <div className="glass rounded-3xl p-5 border border-white/5 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 shadow-xl shadow-black/10">
          
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((opt) => {
              const Active = statusFilter === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    Active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-950/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  <Icon size={12} className={opt.color} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Matchday Filters */}
          <div className="flex items-center gap-3 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-black uppercase tracking-widest">
              <Filter size={12} />
              <span>Filtro:</span>
            </div>
            <div className="flex gap-1.5 flex-grow">
              {matchdayOptions.map((opt) => {
                const Active = matchdayFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setMatchdayFilter(opt.value)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                      Active
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            GRID DE JOGOS (Loading / Data / Error / Empty States)
            ========================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <MatchSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
            <p className="font-bold text-slate-300 mb-2">Erro ao buscar calendário.</p>
            <p className="text-sm text-slate-500">
              Verifique sua conexão e chave de API do Football Data.
            </p>
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-white/5 max-w-lg mx-auto animate-fade-in">
            <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="font-black text-slate-200 text-lg mb-1">Nenhum jogo encontrado</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Nenhuma partida corresponde aos filtros selecionados. Tente mudar o status ou a rodada acima.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
