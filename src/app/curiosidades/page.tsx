'use client';

import Link from 'next/link';
import { useCuriositiesHistory } from '@/hooks/useCuriosity';
import { CuriositySkeleton } from '@/components/Skeleton';
import { Sparkles, Calendar, ArrowRight, Share2, HelpCircle } from 'lucide-react';

export default function CuriosidadesPage() {
  const { data: history, isLoading, isError } = useCuriositiesHistory();

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Cabeçalho da Página */}
        <div className="text-center md:text-left space-y-2">
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Memória do Portal</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            Histórico de <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Insights IA</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl font-medium">
            Explore o arquivo de curiosidades, narrativas táticas e histórias virais que já foram geradas por Inteligência Artificial sobre os confrontos da Copa 2026.
          </p>
        </div>

        {/* =========================================================================
            HISTÓRICO DE CURIOSIDADES (Grid/Layout Tipo Stories/Feed)
            ========================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CuriositySkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 glass rounded-3xl border border-white/5 max-w-lg mx-auto">
            <HelpCircle className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="font-bold text-slate-300 mb-2">Erro ao buscar histórico.</p>
            <p className="text-sm text-slate-500">
              Verifique sua conexão ou a disponibilidade do banco de dados Redis.
            </p>
          </div>
        ) : history && history.length > 0 ? (
          <div className="space-y-12">
            {history.map((set: any) => (
              <div key={set.matchId} className="space-y-4 animate-fade-in">
                
                {/* Contexto do Jogo do Histórico */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3.5 rounded-2xl">
                  <div className="flex items-center gap-3 text-xs md:text-sm">
                    <span className="text-emerald-400">⚽</span>
                    <span className="font-black text-slate-200">
                      {set.homeTeam} vs {set.awayTeam}
                    </span>
                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-slate-500 font-bold">
                      ID #{set.matchId}
                    </span>
                  </div>
                  
                  <Link
                    href={`/jogos/${set.matchId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-wider group"
                  >
                    <span>Ver Ficha Técnica</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Grid das 3 curiosidades daquele jogo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {set.curiosities.map((c: any, cIdx: number) => {
                    // Gradientes temáticos baseados no índice
                    const gradients = [
                      'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20 shadow-emerald-950/5',
                      'from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/20 shadow-blue-950/5',
                      'from-purple-500/10 via-fuchsia-500/5 to-transparent border-purple-500/20 shadow-purple-950/5'
                    ];
                    const curGrad = gradients[cIdx % gradients.length];
                    
                    return (
                      <div
                        key={c.id}
                        className={`glass rounded-2xl border p-6 bg-gradient-to-br ${curGrad} relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 shadow-xl`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl">{c.emoji}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Histórico</span>
                        </div>
                        <h3 className="font-extrabold text-slate-100 text-sm mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-slate-300 text-xs leading-relaxed italic border-l border-white/5 pl-2">
                          {c.narrative}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl border border-white/5 max-w-lg mx-auto p-8 space-y-6 animate-fade-in">
            <Sparkles className="mx-auto text-yellow-400 animate-float" size={48} />
            <h2 className="text-2xl font-black">Nenhum insight gerado ainda</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Visite a página de jogos, clique em qualquer partida e nossa IA criará as curiosidades em tempo real, armazenando-as permanentemente no histórico!
            </p>
            <Link
              href="/jogos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              <Calendar size={14} />
              Ir para Jogos agora
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
