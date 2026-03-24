import Link from "next/link";
import GroupSection from "@/components/GroupSection";

export default function GruposPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-2 mb-2 transition-colors"
            >
              ← Voltar para o Início
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Tabela de Grupos <span className="text-blue-600">Oficial</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Confira as 48 seleções divididas nos 12 grupos da Copa 2026.
            </p>
          </div>

          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200">
            Fase de Grupos
          </div>
        </div>

        {/* Listagem dos Grupos (Reutilizando seu componente) */}
        <GroupSection />

        {/* Rodapé da página de grupos */}
        <div className="mt-20 p-8 bg-blue-900 rounded-3xl text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Critérios de Desempate</h2>
          <p className="opacity-80 max-w-2xl mx-auto text-sm">
            Os dois primeiros de cada grupo e os 8 melhores terceiros colocados avançam para a fase de mata-mata.
          </p>
        </div>
        
      </div>
    </main>
  );
}