'use client';

import { useState } from 'react';
import { Share2, Check, Sparkles, Database } from 'lucide-react';
import { Curiosity } from '@/types';

interface CuriosityCardProps {
  curiosity: Curiosity;
  matchId: number;
  index: number;
}

export default function CuriosityCard({ curiosity, matchId, index }: CuriosityCardProps) {
  const { emoji, title, narrative } = curiosity;
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/jogos/${matchId}?curiosity=${curiosity.id}`;
    
    try {
      await navigator.clipboard.writeText(
        `🏆 Copa 2026 IA Insight: *${title}* \n\n"${narrative}"\n\nConfira mais curiosidades no link: ${shareUrl}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar link de compartilhamento:', err);
    }
  };

  // Define gradientes premium de fundo baseados no tipo de insight (índice)
  // Index 0: Recordes/Marcas (Dourado/Bronze)
  // Index 1: Histórico H2H (Azul/Ciano)
  // Index 2: Tabela/E se (Verde/Esmeralda)
  const gradients = [
    'from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/20 hover:border-amber-500/40 shadow-amber-950/10',
    'from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/20 hover:border-blue-500/40 shadow-blue-950/10',
    'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-950/10',
  ];

  const borderGlows = [
    'group-hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]',
    'group-hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.2)]',
    'group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.2)]',
  ];

  const badges = [
    { text: 'A) RECORDES E MARCAS', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { text: 'B) RETROSPECTO H2H', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { text: 'C) CENÁRIO DE TABELA', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  const selectedGradient = gradients[index % gradients.length];
  const selectedGlow = borderGlows[index % borderGlows.length];
  const currentBadge = badges[index % badges.length] || { text: 'INSIGHT IA', color: 'text-slate-400 bg-white/5 border-white/5' };

  // Adiciona classes de delay baseadas no índice para animação staggered
  const delays = ['delay-100', 'delay-200', 'delay-300'];
  const delayClass = delays[index % delays.length] || '';

  return (
    <div
      className={`glass rounded-3xl border p-6 flex flex-col justify-between bg-gradient-to-br ${selectedGradient} relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-xl ${selectedGlow} animate-slide-up ${delayClass}`}
    >
      {/* Detalhe estético de background */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />

      <div>
        {/* Cabeçalho do Card (Badge Técnico de TV) */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${currentBadge.color}`}>
            {currentBadge.text}
          </span>
        </div>

        {/* Título do Insight (Negrito em Destaque) */}
        <h3 className="font-black text-slate-100 text-base md:text-lg mb-3 tracking-tight leading-snug group-hover:text-white">
          {title.replace(/^[A-C]\)\s*(RECORDES\/MARCAS|HISTÓRICO \(H2H\)|CENÁRIO DE TABELA):\s*/i, '')}
        </h3>

        {/* Narrativa (Fatos Curtos e Focados em Dados) */}
        <p className="text-slate-200 text-sm font-semibold leading-relaxed border-l-2 border-emerald-500/40 pl-3 py-1 mb-6">
          {narrative}
        </p>
      </div>

      {/* Rodapé do Card (Fonte do Dado & Ação) */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        {/* Fonte do Dado */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          <Database size={10} className="text-slate-500" />
          <span>Fonte: Dados Oficiais Copa 2026 / IA Insight</span>
        </div>

        {/* Botão de Compartilhar */}
        <button
          onClick={handleShare}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
            copied
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
          }`}
        >
          {copied ? (
            <>
              <Check size={12} className="animate-bounce" />
              <span>Copiado para o Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 size={12} />
              <span>Compartilhar Fato</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
