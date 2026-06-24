// =============================================
// Football Data API Types (football-data.org v4)
// =============================================

export interface ApiTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface ApiScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'AWARDED';

export interface ApiMatch {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number;
  stage: string;
  group: string | null;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: ApiScore;
  referees: { id: number; name: string; nationality: string }[];
}

export interface ApiMatchResponse {
  count: number;
  filters: Record<string, unknown>;
  matches: ApiMatch[];
}

export interface ApiStandingEntry {
  position: number;
  team: ApiTeam;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface ApiStandingGroup {
  stage: string;
  type: string;
  group: string;
  table: ApiStandingEntry[];
}

export interface ApiStandingsResponse {
  competition: { id: number; name: string };
  season: { id: number; startDate: string; endDate: string; currentMatchday: number };
  standings: ApiStandingGroup[];
}

export interface ApiMatchDetailResponse {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number;
  stage: string;
  group: string | null;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: ApiScore;
  goals: ApiGoal[];
  referees: { id: number; name: string; nationality: string }[];
}

export interface ApiGoal {
  minute: number;
  injuryTime: number | null;
  type: 'REGULAR' | 'OWN' | 'PENALTY';
  team: { id: number; name: string };
  scorer: { id: number; name: string };
  assist: { id: number; name: string } | null;
}

// =============================================
// Curiosity Types (AI-Generated Content)
// =============================================

export interface Curiosity {
  id: string;
  title: string;
  emoji: string;
  narrative: string;
}

export interface CuriositySet {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  curiosities: Curiosity[];
  generatedAt: string;
}

// =============================================
// UI / Component Types
// =============================================

export interface MatchCardProps {
  match: ApiMatch;
  variant?: 'compact' | 'expanded';
}

export interface CuriosityCardProps {
  curiosity: Curiosity;
  matchId: number;
  index?: number;
}

export type PageStatus = 'loading' | 'error' | 'success' | 'empty';

// =============================================
// Local Data Types (Fallback)
// =============================================

export interface LocalTeam {
  id: string;
  name: string;
  flag: string;
  tla: string;
}

export interface LocalGroup {
  letter: string;
  teams: LocalTeam[];
}
