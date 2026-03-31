export type GameCategory = 'SLOTS' | 'LIVE_CASINO' | 'TABLE_GAMES' | 'SPORTS' | 'POKER' | 'CRASH';
export type GameStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Game {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
  category: GameCategory;
  subCategory?: string;
  status: GameStatus;
  rtp: number;
  minBet: number;
  maxBet: number;
  currencies: string[];
  jurisdictions: string[];
  thumbnailUrl?: string;
  gameCode: string;
  hasDemo: boolean;
  isMobile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameAssignment {
  id: string;
  gameId: string;
  gameName: string;
  operatorId: string;
  operatorName: string;
  minBetOverride?: number;
  maxBetOverride?: number;
  rtpOverride?: number;
  status: 'ACTIVE' | 'INACTIVE';
  assignedAt: Date;
}
