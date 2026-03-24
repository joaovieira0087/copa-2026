export interface Team {
  id: string;
  name: string;
  flag: string; // Emoji ou URL da imagem
}

export interface Group {
  letter: string;
  teams: Team[];
}

export const groupsData: Group[] = [
  {
    letter: 'A',
    teams: [
      { id: '1', name: 'México', flag: '🇲🇽' },
      { id: '2', name: 'Equador', flag: '🇪🇨' },
      { id: '3', name: 'Suíça', flag: '🇨🇭' },
      { id: '4', name: 'Nigéria', flag: '🇳🇬' },
    ]
  },
  {
    letter: 'B',
    teams: [
      { id: '5', name: 'Canadá', flag: '🇨🇦' },
      { id: '6', name: 'Brasil', flag: '🇧🇷' },
      { id: '7', name: 'Coreia do Sul', flag: '🇰🇷' },
      { id: '8', name: 'Gana', flag: '🇬🇭' },
    ]
  },
  {
    letter: 'C',
    teams: [
      { id: '9', name: 'Estados Unidos', flag: '🇺🇸' },
      { id: '10', name: 'Espanha', flag: '🇪🇸' },
      { id: '11', name: 'Iraque', flag: '🇮🇶' },
      { id: '12', name: 'Camarões', flag: '🇨🇲' },
    ]
  }
];