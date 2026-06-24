'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '@/services/api';
import { GroupSkeleton } from '@/components/Skeleton';
import { Trophy, LayoutGrid, Info, CheckCircle } from 'lucide-react';

export default function GruposPage() {
  // Busca a classificação com React Query (5min cache no server e client)
  const { data: groups, isLoading, isError } = useQuery({
    queryKey: ['wc-standings-page'],
    queryFn: fetchStandings,
  });

  const fallbackCrest = 'https://www.thesportsdb.com/images/media/team/badge/small/unknown.png';

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cabeçalho da Página */}
        <div className="text-center md:text-left space-y-2">
          <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Fase de Grupos</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            Tabela de <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Grupos Oficial</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl font-medium">
            Confira em tempo real a classificação oficial das seleções nos 12 grupos da maior Copa do Mundo de todos os tempos. Os dois primeiros de cada grupo e os 8 melhores terceiros avançam para o mata-mata.
          </p>
        </div>

        {/* Nota explicativa de classificação */}
        <div className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-3 text-xs text-slate-400 max-w-3xl">
          <Info size={16} className="text-emerald-400 flex-shrink-0" />
          <p>
            As linhas destacadas em <span className="text-emerald-400 font-bold">verde</span> representam a zona de classificação automática para os 16-avos de final do torneio.
          </p>
        </div>

        {/* =========================================================================
            EXIBIÇÃO DOS 12 GRUPOS (Grid Responsivo de Tabelas)
            ========================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GroupSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
            <Trophy className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="font-bold text-slate-300 mb-2">Erro ao buscar classificação.</p>
            <p className="text-sm text-slate-500">
              Não conseguimos conectar com o servidor. Tente novamente mais tarde.
            </p>
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: any, idx: number) => (
              <div
                key={idx}
                className="glass rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 shadow-2xl animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Header do Grupo */}
                <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-black text-slate-100 tracking-tight uppercase text-sm md:text-base">
                    {group.name}
                  </h3>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>

                {/* Tabela de Classificação */}
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[280px]">
                    <thead>
                      <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider border-b border-white/5 pb-2">
                        <th className="pb-2 w-6 text-center">#</th>
                        <th className="pb-2">Seleção</th>
                        <th className="pb-2 text-center w-6">J</th>
                        <th className="pb-2 text-center w-6">SG</th>
                        <th className="pb-2 text-center w-8 text-emerald-400">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {group.teams.map((entry: any, tIdx: number) => {
                        const isQualified = entry.position <= 2;
                        
                        return (
                          <tr
                            key={tIdx}
                            className={`text-xs transition-colors ${
                              isQualified ? 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]' : 'hover:bg-white/[0.01]'
                            }`}
                          >
                            {/* Posição */}
                            <td className="py-2.5 text-center font-black">
                              <span className={isQualified ? 'text-emerald-400' : 'text-slate-500'}>
                                {entry.position}
                              </span>
                            </td>

                            {/* Escudo e Nome */}
                            <td className="py-2.5 font-bold text-slate-200">
                              <div className="flex items-center gap-2 truncate max-w-[120px] md:max-w-[150px]">
                                <div className="w-6 h-6 bg-slate-800/80 rounded-full flex items-center justify-center p-0.5 border border-white/5 overflow-hidden flex-shrink-0">
                                  <img
                                    src={entry.logo || fallbackCrest}
                                    onError={(e: any) => {
                                      e.target.src = fallbackCrest;
                                    }}
                                    alt={entry.name}
                                    className="w-4 h-4 object-contain"
                                  />
                                </div>
                                <span className="truncate" title={entry.name}>
                                  {entry.shortName || entry.name}
                                </span>
                              </div>
                            </td>

                            {/* Partidas Jogadas */}
                            <td className="py-2.5 text-center text-slate-400 font-semibold">{entry.played}</td>

                            {/* Saldo de Gols */}
                            <td className="py-2.5 text-center text-slate-400 font-semibold font-mono">
                              {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                            </td>

                            {/* Pontos */}
                            <td className="py-2.5 text-center font-black">
                              <span className={isQualified ? 'text-emerald-400' : 'text-slate-300'}>
                                {entry.points}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
            <LayoutGrid className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="font-black text-slate-200 text-lg mb-1">Nenhum grupo encontrado</p>
            <p className="text-xs text-slate-400">Tabela de grupos indisponível.</p>
          </div>
        )}

      </div>
    </main>
  );
}
