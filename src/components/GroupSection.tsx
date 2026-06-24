'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '@/services/api';
import { GroupSkeleton } from './Skeleton';

export default function GroupSection() {
  const { data: groups, isLoading, isError } = useQuery({
    queryKey: ['wc-2026-standings'],
    queryFn: fetchStandings,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <GroupSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !groups || groups.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
        <p className="font-bold text-slate-300 text-lg mb-2">A API está sendo atualizada com a classificação de 2026.</p>
        <p className="text-sm text-slate-500">Exibiremos a tabela oficial em tempo real assim que as partidas iniciarem.</p>
      </div>
    );
  }

  const fallbackCrest = 'https://www.thesportsdb.com/images/media/team/badge/small/unknown.png';

  // Mostra apenas os 3 primeiros grupos na Home para preview
  const homeGroups = groups.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {homeGroups.map((group: any, idx: number) => (
        <div
          key={idx}
          className="glass rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 shadow-xl animate-slide-up"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Header do Grupo */}
          <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-black text-slate-100 tracking-tight uppercase text-base">
              {group.name}
            </h3>
            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full tracking-wider">
              Grupo Oficial
            </span>
          </div>

          {/* Tabela de Times */}
          <div className="p-4 space-y-3">
            {/* Cabeçalho da Minilista */}
            <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              <div className="flex items-center gap-3">
                <span className="w-4 text-center">#</span>
                <span>Seleção</span>
              </div>
              <div className="flex gap-4">
                <span className="w-6 text-center">J</span>
                <span className="w-8 text-center text-emerald-400">PTS</span>
              </div>
            </div>

            {/* Times */}
            {group.teams.slice(0, 4).map((entry: any, tIdx: number) => {
              // Destaque para zona de classificação (Top 2)
              const isQualified = entry.position <= 2;

              return (
                <div
                  key={tIdx}
                  className={`flex items-center justify-between px-2 py-2 rounded-xl transition-colors ${
                    isQualified ? 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* Posição */}
                    <span
                      className={`w-4 text-center text-xs font-black ${
                        isQualified ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {entry.position}
                    </span>

                    {/* Escudo */}
                    <div className="w-7 h-7 bg-slate-800/80 rounded-full flex items-center justify-center p-0.5 border border-white/5 shadow-inner overflow-hidden flex-shrink-0">
                      <img
                        src={entry.logo || fallbackCrest}
                        onError={(e: any) => {
                          e.target.src = fallbackCrest;
                        }}
                        alt={entry.name}
                        className="w-5 h-5 object-contain"
                      />
                    </div>

                    {/* Nome do Time */}
                    <span className="font-bold text-slate-200 text-xs truncate">
                      {entry.shortName || entry.name}
                    </span>
                  </div>

                  {/* Pontos e Jogos */}
                  <div className="flex gap-4 text-xs font-bold">
                    <span className="w-6 text-center text-slate-400">{entry.played}</span>
                    <span
                      className={`w-8 text-center font-black ${
                        isQualified ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {entry.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
