'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export default function Countdown() {
  // Abertura da Copa: 11 de Junho de 2026
  const startDate = new Date('2026-06-11T15:00:00').getTime();
  // Encerramento da Copa: 19 de Julho de 2026
  const endDate = new Date('2026-07-19T20:00:00').getTime();

  const [tournamentState, setTournamentState] = useState({
    status: 'loading', // loading, upcoming, active, finished
    dayOfTournament: 0,
    daysLeft: 0,
    text: '',
  });

  useEffect(() => {
    const updateState = () => {
      const now = new Date().getTime();

      if (now < startDate) {
        // Antes da Copa
        const diff = startDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTournamentState({
          status: 'upcoming',
          dayOfTournament: 0,
          daysLeft: days,
          text: `Faltam ${days} dias para o espetáculo começar!`,
        });
      } else if (now >= startDate && now <= endDate) {
        // Durante a Copa
        const diffFromStart = now - startDate;
        const dayOfTournament = Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;
        const diffToEnd = endDate - now;
        const daysLeft = Math.ceil(diffToEnd / (1000 * 60 * 60 * 24));

        setTournamentState({
          status: 'active',
          dayOfTournament,
          daysLeft,
          text: `Estamos no Dia ${dayOfTournament} da Copa do Mundo! 🔥`,
        });
      } else {
        // Depois da Copa
        setTournamentState({
          status: 'finished',
          dayOfTournament: 0,
          daysLeft: 0,
          text: 'A Copa do Mundo 2026 chegou ao fim! Parabéns aos campeões! 🏆',
        });
      }
    };

    updateState();
    const interval = setInterval(updateState, 1000 * 60 * 60); // Atualiza a cada hora
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  if (tournamentState.status === 'loading') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-950/20 animate-float mb-4">
        <Sparkles size={16} />
        {tournamentState.status === 'active' ? 'Torneio em Andamento' : 'Prepare-se'}
      </div>

      <p className="text-xl md:text-2xl font-black text-center text-yellow-400 tracking-tight drop-shadow-md">
        {tournamentState.text}
      </p>

      {tournamentState.status === 'active' && (
        <div className="flex gap-4 justify-center mt-6">
          <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 w-28 border border-white/5 shadow-xl shadow-black/20">
            <span className="text-4xl font-extrabold text-emerald-400">{tournamentState.dayOfTournament}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Dia de Copa</span>
          </div>
          <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 w-28 border border-white/5 shadow-xl shadow-black/20">
            <span className="text-4xl font-extrabold text-blue-400">{tournamentState.daysLeft}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Dias Restantes</span>
          </div>
          <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 w-28 border border-white/5 shadow-xl shadow-black/20">
            <span className="text-4xl font-extrabold text-yellow-500">12</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Grupos</span>
          </div>
        </div>
      )}
    </div>
  );
}
