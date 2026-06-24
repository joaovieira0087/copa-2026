'use client';

import Link from 'next/link';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { ApiMatch } from '@/types';

interface MatchCardProps {
  match: ApiMatch;
}

export default function MatchCard({ match }: MatchCardProps) {
  // Fallback caso o objeto match seja nulo
  if (!match) return null;

  const { id, utcDate, status, matchday, homeTeam, awayTeam, score } = match;

  // Formata a data de forma amigável
  let formattedDate = 'A definir';
  let formattedTime = '--:--';
  if (utcDate) {
    try {
      const dateObj = new Date(utcDate);
      formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Erro ao formatar data da partida:', e);
    }
  }

  // Determina as classes e textos de status
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinished = status === 'FINISHED';
  
  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse-live">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          Ao Vivo
        </span>
      );
    }
    if (isFinished) {
      return (
        <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Encerrado
        </span>
      );
    }
    return (
      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        Rodada {matchday || 'A definir'}
      </span>
    );
  };

  const fallbackCrest = 'https://www.thesportsdb.com/images/media/team/badge/small/unknown.png';

  // Tratamento de segurança para dados dos times
  const homeName = homeTeam?.shortName || homeTeam?.name || 'A definir';
  const homeCrest = homeTeam?.crest || fallbackCrest;
  
  const awayName = awayTeam?.shortName || awayTeam?.name || 'A definir';
  const awayCrest = awayTeam?.crest || fallbackCrest;

  // Tratamento de segurança para o placar
  const hasScore = score && score.fullTime && score.fullTime.home !== null && score.fullTime.away !== null;
  const homeScore = score?.fullTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? 0;

  return (
    <Link
      href={`/jogos/${id}`}
      className="block glass glass-hover rounded-2xl border border-white/5 p-5 relative overflow-hidden group animate-slide-up"
    >
      {/* Background glow em hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header do Card */}
      <div className="relative z-10 flex justify-between items-center mb-4 text-xs text-slate-400 font-semibold">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-emerald-400" />
          <span>{formattedDate} às {formattedTime}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Grid de Placar */}
      <div className="relative z-10 flex items-center justify-between py-3">
        {/* Mandante */}
        <div className="flex items-center gap-3 w-5/12 truncate">
          <div className="w-10 h-10 bg-slate-800/60 rounded-full flex items-center justify-center p-1 border border-white/5 shadow-inner flex-shrink-0">
            <img
              src={homeCrest}
              onError={(e: any) => {
                e.target.src = fallbackCrest;
              }}
              alt={homeName}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate text-sm md:text-base">
            {homeName}
          </span>
        </div>

        {/* Score Placar */}
        <div className="flex items-center justify-center gap-1.5 w-2/12">
          {hasScore || isLive ? (
            <div className="flex items-center gap-1 font-black text-xl md:text-2xl text-white font-mono">
              <span className={isLive ? 'text-red-400' : 'text-slate-200'}>
                {homeScore}
              </span>
              <span className="text-slate-500 text-sm">:</span>
              <span className={isLive ? 'text-red-400' : 'text-slate-200'}>
                {awayScore}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
              VS
            </span>
          )}
        </div>

        {/* Visitante */}
        <div className="flex items-center gap-3 w-5/12 justify-end text-right truncate">
          <span className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate text-sm md:text-base order-1 md:order-none">
            {awayName}
          </span>
          <div className="w-10 h-10 bg-slate-800/60 rounded-full flex items-center justify-center p-1 border border-white/5 shadow-inner flex-shrink-0 order-2 md:order-none">
            <img
              src={awayCrest}
              onError={(e: any) => {
                e.target.src = fallbackCrest;
              }}
              alt={awayName}
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer do Card */}
      <div className="relative z-10 flex justify-between items-center pt-3 border-t border-white/5 mt-2 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-blue-400" />
          <span className="truncate max-w-[150px] md:max-w-[200px]">
            {match.stage === 'GROUP_STAGE' ? `Grupo ${match.group?.replace('GROUP_', '') || 'A'}` : (match.stage || 'Fase de Grupos')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold group-hover:underline">
          <Sparkles size={11} className="animate-float" />
          <span>Ver Insights IA →</span>
        </div>
      </div>
    </Link>
  );
}
