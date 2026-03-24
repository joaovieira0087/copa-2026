import Image from "next/image";
import Link from "next/link"; // Importação essencial para navegação
import Countdown from "@/components/Countdown";
import GroupSection from "@/components/GroupSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER / HERO */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Padrão decorativo no fundo */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10 text-center px-4">
          <span className="bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-full text-sm uppercase tracking-widest mb-6 inline-block">
            FIFA World Cup 2026
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            Acompanhe a Jornada <br /> 
            <span className="text-yellow-400 underline decoration-white underline-offset-8">Rumo ao Hexa</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-light mb-10">
            Dados em tempo real, tabelas de grupos e estatísticas dos jogadores da Copa na América do Norte.
          </p>

          {/* COMPONENTE DE CONTAGEM REGRESSIVA */}
          <Countdown />
        </div>
      </section>

      {/* SEÇÃO DE DESTAQUES (Cards de Atalho) */}
      <section className="max-w-6xl mx-auto py-16 px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Grupos - AGORA COM LINK PARA A NOVA PÁGINA */}
          <Link href="/grupos" className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:scale-105 transition-transform cursor-pointer block group">
            <div className="text-blue-600 mb-4 text-3xl group-hover:animate-bounce text-center md:text-left">📅</div>
            <h3 className="text-xl font-bold mb-2 text-center md:text-left">Tabela de Grupos</h3>
            <p className="text-slate-500 text-sm text-center md:text-left">Confira a classificação dos 12 grupos desta edição histórica.</p>
          </Link>

          {/* Card 2: Jogos de Hoje */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-green-600 mb-4 text-3xl text-center md:text-left">⚽</div>
            <h3 className="text-xl font-bold mb-2 text-center md:text-left">Jogos ao Vivo</h3>
            <p className="text-slate-500 text-sm text-center md:text-left">Acompanhe placares e estatísticas em tempo real.</p>
          </div>

          {/* Card 3: Estádios */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-yellow-600 mb-4 text-3xl text-center md:text-left">🏟️</div>
            <h3 className="text-xl font-bold mb-2 text-center md:text-left">Sedes e Estádios</h3>
            <p className="text-slate-500 text-sm text-center md:text-left">Explore as cidades-sede nos EUA, México e Canadá.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE GRUPOS (Preview na Home) */}
      <section className="max-w-6xl mx-auto pb-20 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Grupos da Competição</h2>
            <p className="text-slate-500">Confira as seleções que lutarão pelo título.</p>
          </div>
          <Link href="/grupos" className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-wider">
            Ver tudo →
          </Link>
        </div>
        
        <GroupSection />
      </section>

    </main>
  );
}