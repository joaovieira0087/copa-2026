# ⚽ Copa do Mundo 2026 — IA Curiosity Portal (MVP)

> **Plataforma de engajamento esportivo premium que transforma dados estatísticos em insights táticos e narrativas virais utilizando Inteligência Artificial, construída sob o paradigma de Custo Zero (Lean Architecture).**

---

## 📋 Sobre o Projeto

Durante uma transmissão de futebol ao vivo, narradores e comentaristas precisam de dados rápidos, estatísticas curiosas e ganchos de roteiro (cenários "E se...") para enriquecer a narrativa e engajar a audiência. 

O **Copa 2026 IA Curiosity Portal** resolve esse problema ao cruzar dados em tempo real da API de Futebol com um motor cognitivo baseado no **Google Gemini 2.0 Flash**. O sistema analisa o contexto da partida e gera três insights jornalísticos ultra-precisos prontos para uso em TV, rádio ou redes sociais.

Tudo isso rodando em uma infraestrutura com **custo de operação de R$ 0,00/mês**, utilizando faixas gratuitas (*Free Tiers*) de provedores serverless e estratégias avançadas de caching.

---

## 🛠️ Funcionalidades Principais

* 📅 **Central de Partidas**: Listagem completa dos jogos da Copa do Mundo de 2026 filtrável por rodadas (1 a 3) e status (Em Andamento/Ao Vivo, Agendados e Encerrados).
* 📊 **Tabela de Grupos em Tempo Real**: Classificação dos 12 grupos do torneio (A ao L), com dados de jogos jogados, saldo de gols e destaque visual (verde) para a zona de classificação automática.
* 🧠 **Motor de Insights Jornalísticos (IA)**: Geração sob demanda de 3 fatos frios por jogo baseados em dados reais:
  * **A) Recordes e Marcas**: Marcas históricas que jogadores ou seleções podem quebrar.
  * **B) Retrospecto H2H (Head-to-Head)**: Cruzamento de dados de confrontos diretos passados.
  * **C) Cenário de Tabela**: Projeção matemática da classificação com base no resultado de momento.
* ⏱️ **Variável de Tempo Dinâmica**: A IA adapta o tom da narrativa ao status do jogo. No pré-jogo (*Scheduled*), projeta cenários; ao vivo (*Live*), usa tempos de jogo ("Aos 30 minutos..."); e após o apito final (*Finished*), emite o veredito tático ("O que definiu a partida foi...").
* 🔗 **Compartilhamento Viral**: Botão para copiar o insight formatado com emojis diretamente para o clipboard do celular ou computador, pronto para disparar em canais de transmissão ou WhatsApp.
* 🛡️ **Segurança Anti-Crash & Anti-Alucinação**: Tratamento de dados brutos e prompt engineering restrito (temperatura baixa de amostragem) para proibir a IA de inventar fatos ou quebrar a tela em caso de dados nulos da API.

---

## ⚡ Arquitetura de Custo Zero (Lean Design)

Para garantir escala infinita sem custos de servidor, o projeto utiliza uma arquitetura baseada em **três camadas de cache**:

```
[ Usuário acessa ] 
       │
       ▼
 ┌───────────┐      SIM     ┌────────────────────────┐
 │   Cache   ├─────────────►│ Retorna em <50ms (0$)  │
 │  (Redis)  │              └────────────────────────┘
 └─────┬─────┘
       │ NÃO (1ª requisição do jogo)
       ▼
 ┌───────────┐
 │ Fetch API ├─────► Busca dados de H2H, Gols e Tabela do Grupo (0$)
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │ Gemini IA ├─────► Gera Insights estritos baseados no contexto (0$)
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │ Salva no  ├─────► Persiste no Redis para próximas requisições (0$)
 │   Redis   │
 └───────────┘
```

1. **Client-Side Cache (React Query)**: Reduz requisições repetidas mantendo as curiosidades em cache local no navegador por 24 horas.
2. **Server-Side Cache (Upstash Redis / In-Memory Fallback)**: Ao gerar um insight de IA uma vez, ele é persistido em banco de dados de chave-valor. Leituras subsequentes não disparam chamadas ao Gemini nem à API externa.
3. **Edge Fetch Revalidation**: Dados brutos de partidas são cacheados no Edge por 5 minutos (jogos ao vivo de 15 a 45 segundos), minimizando o consumo da cota diária da API de Futebol.

---

## 💻 Tecnologias Utilizadas

* **Framework**: Next.js 16 (App Router, React 19, Turbopack)
* **Estilização**: TailwindCSS v4 + CSS PostCSS (Design Premium Dark e Glassmorphism)
* **Gerenciamento de Estado/Cache**: React Query (@tanstack/react-query)
* **Inteligência Artificial**: Google Gemini API SDK (`gemini-2.0-flash`)
* **Banco de Dados/Cache Server**: Upstash Redis (`@upstash/redis` com fallback local em Map)
* **Provedor de Dados**: Football-Data.org API v4

---

## ⚙️ Variáveis de Ambiente (.env.local)

Crie um arquivo `.env.local` na raiz do projeto e configure as seguintes chaves para rodar:

```env
# Chave da API oficial (Server-side)
FOOTBALL_DATA_KEY=sua_chave_aqui

# Chave do Google Gemini API (Obtenha gratuitamente no Google AI Studio)
GEMINI_API_KEY=sua_chave_do_gemini_aqui

# Configurações do Upstash Redis (Opcional - Se vazias, o sistema usa o Cache em Memória local)
UPSTASH_REDIS_REST_URL=sua_url_do_redis
UPSTASH_REDIS_REST_TOKEN=seu_token_do_redis
```

---

## 🚀 Como Rodar o Projeto

1. Clone o repositório e acesse a pasta:
   ```bash
   git clone https://github.com/joaovieira0087/copa-2026.git
   cd copa-2026
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no seu navegador: `http://localhost:3000`
