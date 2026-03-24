'use client'; // Como tem cronômetro, precisa rodar no navegador (cliente)

import { useState, useEffect } from 'react';

export default function Countdown() {
  // Data de abertura da Copa: 11 de Junho de 2026
  const targetDate = new Date('2026-06-11T15:00:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center mt-8">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
        { label: 'Segundos', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center bg-white/20 backdrop-blur-md rounded-lg p-4 w-24 border border-white/30">
          <span className="text-3xl font-bold">{item.value}</span>
          <span className="text-xs uppercase opacity-80">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

