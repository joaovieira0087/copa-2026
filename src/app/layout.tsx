import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Copa 2026 — IA Curiosity Portal | Rumo ao Hexa",
  description: "Descubra narrativas virais e curiosidades geradas por Inteligência Artificial sobre os jogos da Copa do Mundo 2026, baseadas em dados reais.",
  keywords: ["Copa do Mundo 2026", "Futebol", "Estatísticas", "Inteligência Artificial", "Curiosidades", "Gemini", "Hexa"],
  authors: [{ name: "Copa 2026 IA Team" }],
  openGraph: {
    title: "Copa 2026 — IA Curiosity Portal | Rumo ao Hexa",
    description: "Narrativas curtas, análises táticas divertidas e ganchos 'E se...' gerados por IA para cada partida da Copa do Mundo 2026.",
    url: "https://copa2026-curiosity.vercel.app",
    siteName: "Copa 2026 IA Portal",
    images: [
      {
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Copa do Mundo 2026 - IA Curiosity Portal",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copa 2026 — IA Curiosity Portal",
    description: "Narrativas dinâmicas e virais geradas por IA sobre os jogos da Copa do Mundo 2026 baseadas em dados reais.",
    images: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&h=630&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070a13] text-slate-100">
        <Providers>
          <Navbar />
          <div className="flex-grow pt-20">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
