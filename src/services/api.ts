import axios from 'axios';

// 1. Criamos a instância 'api' com as configurações básicas
export const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
});

// 2. Agora a função consegue encontrar o 'api' lá de cima
export const getWorldCupStandings = async () => {
  try {
    const response = await api.get('/standings', {
      params: { 
        league: '1',    // ID da World Cup
        season: '2022'  // Usando 2022 para teste (onde existem dados reais)
      }
    });

    // Log para conferirmos no console do navegador se os dados chegaram
    console.log("RESPOSTA DA API:", response.data);

    // Verificação de segurança: checa se a estrutura de dados existe antes de acessar
    if (response.data.response && response.data.response.length > 0) {
      return response.data.response[0].league.standings;
    }

    return []; 
  } catch (error) {
    console.error("Erro na conexão com a API-Football:", error);
    return [];
  }
};