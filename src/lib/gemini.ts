import { GoogleGenerativeAI } from '@google/generative-ai';
import { Curiosity } from '@/types';

let genAI: GoogleGenerativeAI | null = null;

const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('Gemini: GEMINI_API_KEY não encontrada. Usando dados mockados de jornalista.');
}

export async function generateCuriosities(matchData: {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  score: string;
  goals: any[];
  stage: string;
  group: string | null;
  matchday: number;
  status: string;
  head2head?: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: { wins: number; draws: number; losses: number };
    awayTeam: { wins: number; draws: number; losses: number };
  };
  groupTable?: any[];
}): Promise<Curiosity[]> {
  const home = matchData.homeTeam;
  const away = matchData.awayTeam;

  // Curiosidades jornalísticas de fallback de alta qualidade
  const fallbackCuriosities: Curiosity[] = [
    {
      id: `curiosity-fb-1-${Date.now()}`,
      emoji: '📊',
      title: 'RECORDES/MARCAS: Histórico do Confronto',
      narrative: `Se o ${home} marcar hoje, ampliará sua contagem de gols em Copas do Mundo. Ambas as seleções buscam estabelecer novas marcas individuais nesta edição histórica da América do Norte.`,
    },
    {
      id: `curiosity-fb-2-${Date.now()}`,
      emoji: '⚔️',
      title: 'HISTÓRICO (H2H): Duelos Diretos',
      narrative: `No retrospecto geral, as equipes chegam para este confronto equilibrando a posse de bola e eficiência tática. O último encontro oficial entre ${home} e ${away} marcou um embate estratégico de alta intensidade técnica.`,
    },
    {
      id: `curiosity-fb-3-${Date.now()}`,
      emoji: '🏆',
      title: 'CENÁRIO DE TABELA: Pressão por Pontos',
      narrative: `Neste status de partida (${matchData.status === 'FINISHED' ? 'Encerrada' : 'Em andamento'}), cada gol é decisivo. Um resultado positivo aqui altera radicalmente as chances de classificação e chaveamento na próxima rodada do grupo.`,
    },
  ];

  if (!genAI) {
    return fallbackCuriosities;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Baixa temperatura para garantir total precisão dos dados (anti-alucinação)
      },
    });

    // Constrói as instruções de contexto de tempo baseadas no status do jogo
    let timeContextInstruction = '';
    if (matchData.status === 'SCHEDULED') {
      timeContextInstruction = 'Como a partida ainda NÃO começou (status SCHEDULED), o cenário "E se..." deve projetar o pré-jogo (ex: "Se o time iniciar pressionando nos primeiros 15 minutos...").';
    } else if (matchData.status === 'IN_PLAY' || matchData.status === 'PAUSED') {
      timeContextInstruction = 'Como a partida está AO VIVO (status IN_PLAY), o cenário deve usar uma variável de tempo em andamento (ex: "Aos 30 minutos de jogo..." ou "Neste momento do segundo tempo...").';
    } else if (matchData.status === 'FINISHED') {
      timeContextInstruction = 'Como a partida já ACABOU (status FINISHED), o cenário deve analisar o veredito final (ex: "O que definiu a partida foi..." ou "A decisão tática no segundo tempo garantiu...").';
    }

    const prompt = `
Você é um analista de dados esportivos senior e roteirista para transmissões ao vivo de futebol na TV (estilo ESPN/SporTV).
O seu objetivo é fornecer insights jornalísticos de dados rápidos, ultra-precisos, táticos e interessantes para narradores e comentaristas usarem durante a transmissão.

REGRAS CRÍTICAS E ABSOLUTAS:
1. NÃO use frases feitas, clichês ou textos de opinião vazios (ex: "Duelo de gigantes", "Torcida em festa", "Promete ser eletrizante"). Foque 100% em fatos concretos, números e dados táticos.
2. Use ESTRICTAMENTE os dados do JSON fornecido abaixo. NÃO invente nomes de jogadores, placares passados ou recordes históricos que não estejam explícitos no contexto.
3. Se um dado ou estatística não estiver contido no JSON de forma explícita, NÃO o mencione de forma alguma.
4. O tom de voz deve ser informativo, direto, profissional e focado em estatísticas reais.
5. Gere exatamente 3 insights jornalísticos no formato do array JSON exigido abaixo. Cada insight deve focar especificamente em um destes três pilares:
   
   - INSIGHT A (RECORDES E MARCAS): Focado em marcas de jogadores ou estatísticas de gols do torneio (se fornecido) ou retrospecto de gols.
     Exemplo: "Se [Jogador] marcar hoje, ele se torna..." ou "Este é o [X]º gol do atacante no ano..."
   
   - INSIGHT B (HISTÓRICO H2H): Focado estritamente no histórico de confrontos diretos (head2head) fornecido. Use a quantidade de jogos, vitórias de cada um e gols do histórico.
     Exemplo: "Em [X] confrontos diretos na história, o [Time A] venceu [Y] vezes contra [Z] do [Time B]..."
   
   - INSIGHT C (CENÁRIO DE TABELA): Baseado estritamente nas pontuações e posições da tabela do grupo fornecidas. Projete as consequências do resultado na tabela de forma lógica.
     Exemplo: "Com este resultado, o [Time A] alcança [X] pontos e garante a classificação, enquanto o [Time B] dependerá de..."

6. Integre a variável de tempo no texto conforme as seguintes instruções do status atual do jogo:
   ${timeContextInstruction}

7. Responda APENAS com um array JSON válido no formato abaixo, sem qualquer texto adicional explicativo antes ou depois:
[
  { "emoji": "📊", "title": "RECORDES/MARCAS: [Título curto e técnico]", "narrative": "[Texto curto de insight focado em dados]" },
  { "emoji": "⚔️", "title": "HISTÓRICO (H2H): [Título curto e técnico]", "narrative": "[Texto curto de insight focado em dados]" },
  { "emoji": "🏆", "title": "CENÁRIO DE TABELA: [Título curto e técnico]", "narrative": "[Texto curto de insight focado em dados]" }
]

JSON COM DADOS REAIS DO CONFRONTO:
${JSON.stringify(matchData, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Resposta vazia da API do Gemini.');
    }

    const parsed = JSON.parse(responseText);

    if (Array.isArray(parsed) && parsed.length === 3) {
      return parsed.map((item: any, index: number) => ({
        id: `curiosity-${matchData.homeTeam}-${matchData.awayTeam}-${index}-${Date.now()}`.replace(/\s+/g, '-').toLowerCase(),
        emoji: item.emoji || '📊',
        title: item.title || 'Insight de Dados',
        narrative: item.narrative || 'Insight estatístico oficial sobre a partida.',
      }));
    }

    return fallbackCuriosities;
  } catch (error) {
    console.error('Gemini: Erro ao gerar insights jornalísticos. Usando fallback.', error);
    return fallbackCuriosities;
  }
}
