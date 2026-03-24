'use client';

import { useQuery } from '@tanstack/react-query';
import { getWorldCupStandings } from '@/services/api';
import Image from 'next/image';

export default function GroupSection() {
  // Hook do React Query para buscar os dados e gerenciar o estado
  const { data: groups, isLoading, isError } = useQuery({
    queryKey: ['wc-standings'],
    queryFn: getWorldCupStandings,
  });

  // Estado de Carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Consultando base de dados da FIFA...</p>
      </div>
    );
  }

  // Estado de Erro (caso a API falhe ou a chave expire)
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center">
        <p className="font-bold text-lg">Erro ao conectar com a API</p>
        <p className="text-sm opacity-80 mt-1">Verifique se sua chave no arquivo .env.local está correta.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {groups?.map((groupArray: any, index: number) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
        >
          {/* Cabeçalho do Grupo */}
          <div className="bg-blue-700 text-white px-5 py-3 flex justify-between items-center">
            <span className="font-bold tracking-wider">
              {groupArray[0]?.group || `GRUPO ${index + 1}`}
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded-md uppercase font-bold">
              Standings
            </span>
          </div>

          {/* Lista de Seleções */}
          <div className="p-4 space-y-4">
            {groupArray.map((item: any) => (
              <div 
                key={item.team.id} 
                className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {/* Escudo Oficial vindo da API */}
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <img 
                      src={item.team.logo} 
                      alt={item.team.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-bold text-slate-800 text-sm md:text-base">
                    {item.team.name}
                  </span>
                </div>

                {/* Estatísticas (Pontos e Jogos) */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Jogos</p>
                    <p className="text-sm font-semibold text-slate-600">{item.all.played}</p>
                  </div>
                  <div className="text-center bg-blue-50 px-3 py-1 rounded-lg">
                    <p className="text-[10px] text-blue-400 uppercase font-bold">Pts</p>
                    <p className="text-sm font-black text-blue-700">{item.points}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}