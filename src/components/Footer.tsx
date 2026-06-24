import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-[#04060c] py-8 text-center text-xs text-slate-500">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p>© {new Date().getFullYear()} Copa do Mundo 2026. Desenvolvido para engajamento e entretenimento.</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/grupos" className="hover:text-slate-300 transition-colors">
            Grupos
          </Link>
          <Link href="/jogos" className="hover:text-slate-300 transition-colors">
            Partidas
          </Link>
          <a
            href="https://www.football-data.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            Dados por <span className="text-emerald-400 font-semibold">football-data.org</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
