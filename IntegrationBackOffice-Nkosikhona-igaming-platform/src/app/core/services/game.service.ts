import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Game, GameAssignment } from '../models/game.model';

const GAMES: Game[] = [
  { id: 'g1', name: 'Starburst', providerId: 'pv1', providerName: 'NetEnt', category: 'SLOTS', subCategory: 'Video Slots', status: 'ACTIVE', rtp: 96.1, minBet: 0.1, maxBet: 100, currencies: ['EUR', 'USD', 'GBP'], jurisdictions: ['Malta', 'UK', 'Sweden'], thumbnailUrl: 'assets/games/starburst.jpg', gameCode: 'NE_STARBURST', hasDemo: true, isMobile: true, createdAt: new Date('2023-01-20'), updatedAt: new Date('2024-01-15') },
  { id: 'g2', name: 'Gonzo\'s Quest', providerId: 'pv1', providerName: 'NetEnt', category: 'SLOTS', subCategory: 'Video Slots', status: 'ACTIVE', rtp: 95.97, minBet: 0.2, maxBet: 50, currencies: ['EUR', 'USD', 'GBP', 'SEK'], jurisdictions: ['Malta', 'UK', 'Sweden', 'Gibraltar'], thumbnailUrl: 'assets/games/gonzos-quest.jpg', gameCode: 'NE_GONZOS_QUEST', hasDemo: true, isMobile: true, createdAt: new Date('2023-01-20'), updatedAt: new Date('2024-01-15') },
  { id: 'g3', name: 'Lightning Roulette', providerId: 'pv3', providerName: 'Evolution Gaming', category: 'LIVE_CASINO', subCategory: 'Roulette', status: 'ACTIVE', rtp: 97.3, minBet: 0.2, maxBet: 2000, currencies: ['EUR', 'USD', 'GBP', 'SEK', 'CAD'], jurisdictions: ['Malta', 'UK', 'Sweden', 'Canada'], thumbnailUrl: 'assets/games/lightning-roulette.jpg', gameCode: 'EVO_LIGHTNING_ROULETTE', hasDemo: false, isMobile: true, createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-02-10') },
  { id: 'g4', name: 'Crazy Time', providerId: 'pv3', providerName: 'Evolution Gaming', category: 'LIVE_CASINO', subCategory: 'Game Show', status: 'ACTIVE', rtp: 96.08, minBet: 0.1, maxBet: 5000, currencies: ['EUR', 'USD', 'GBP'], jurisdictions: ['Malta', 'UK'], thumbnailUrl: 'assets/games/crazy-time.jpg', gameCode: 'EVO_CRAZY_TIME', hasDemo: false, isMobile: true, createdAt: new Date('2023-02-10'), updatedAt: new Date('2024-01-20') },
  { id: 'g5', name: 'Buffalo King', providerId: 'pv4', providerName: 'Pragmatic Play', category: 'SLOTS', subCategory: 'Megaways', status: 'ACTIVE', rtp: 96.51, minBet: 0.4, maxBet: 200, currencies: ['EUR', 'USD', 'BRL', 'MXN'], jurisdictions: ['Malta', 'Brazil', 'Mexico'], thumbnailUrl: 'assets/games/buffalo-king.jpg', gameCode: 'PP_BUFFALO_KING', hasDemo: true, isMobile: true, createdAt: new Date('2023-05-10'), updatedAt: new Date('2024-02-15') },
  { id: 'g6', name: 'Gates of Olympus', providerId: 'pv4', providerName: 'Pragmatic Play', category: 'SLOTS', subCategory: 'Video Slots', status: 'ACTIVE', rtp: 96.5, minBet: 0.2, maxBet: 125, currencies: ['EUR', 'USD', 'BRL', 'PHP'], jurisdictions: ['Malta', 'Brazil', 'Philippines'], thumbnailUrl: 'assets/games/gates-of-olympus.jpg', gameCode: 'PP_GATES_OF_OLYMPUS', hasDemo: true, isMobile: true, createdAt: new Date('2023-05-15'), updatedAt: new Date('2024-02-20') },
  { id: 'g7', name: 'Sweet Bonanza', providerId: 'pv4', providerName: 'Pragmatic Play', category: 'SLOTS', subCategory: 'Tumble Slots', status: 'ACTIVE', rtp: 96.48, minBet: 0.2, maxBet: 125, currencies: ['EUR', 'USD', 'BRL', 'MXN', 'PHP'], jurisdictions: ['Malta', 'Brazil', 'Mexico', 'Philippines'], thumbnailUrl: 'assets/games/sweet-bonanza.jpg', gameCode: 'PP_SWEET_BONANZA', hasDemo: true, isMobile: true, createdAt: new Date('2023-05-20'), updatedAt: new Date('2024-02-25') },
  { id: 'g8', name: 'Live Blackjack', providerId: 'pv3', providerName: 'Evolution Gaming', category: 'LIVE_CASINO', subCategory: 'Blackjack', status: 'ACTIVE', rtp: 99.5, minBet: 5, maxBet: 10000, currencies: ['EUR', 'USD', 'GBP', 'CAD'], jurisdictions: ['Malta', 'UK', 'Canada'], thumbnailUrl: 'assets/games/live-blackjack.jpg', gameCode: 'EVO_LIVE_BLACKJACK', hasDemo: false, isMobile: true, createdAt: new Date('2023-02-15'), updatedAt: new Date('2024-01-25') },
  { id: 'g9', name: 'European Roulette', providerId: 'pv1', providerName: 'NetEnt', category: 'TABLE_GAMES', subCategory: 'Roulette', status: 'ACTIVE', rtp: 97.3, minBet: 0.5, maxBet: 500, currencies: ['EUR', 'USD', 'GBP'], jurisdictions: ['Malta', 'UK', 'Gibraltar'], thumbnailUrl: 'assets/games/european-roulette.jpg', gameCode: 'NE_EURO_ROULETTE', hasDemo: true, isMobile: true, createdAt: new Date('2023-01-25'), updatedAt: new Date('2024-01-20') },
  { id: 'g10', name: 'Football Studio', providerId: 'pv3', providerName: 'Evolution Gaming', category: 'SPORTS', subCategory: 'Card Games', status: 'ACTIVE', rtp: 96.27, minBet: 0.1, maxBet: 1000, currencies: ['EUR', 'USD', 'GBP', 'SEK'], jurisdictions: ['Malta', 'UK', 'Sweden'], thumbnailUrl: 'assets/games/football-studio.jpg', gameCode: 'EVO_FOOTBALL_STUDIO', hasDemo: false, isMobile: true, createdAt: new Date('2023-03-01'), updatedAt: new Date('2024-02-01') },
  { id: 'g11', name: 'Dead or Alive 2', providerId: 'pv1', providerName: 'NetEnt', category: 'SLOTS', subCategory: 'Video Slots', status: 'ACTIVE', rtp: 96.8, minBet: 0.09, maxBet: 180, currencies: ['EUR', 'USD', 'GBP', 'SEK'], jurisdictions: ['Malta', 'UK', 'Sweden'], thumbnailUrl: 'assets/games/doa2.jpg', gameCode: 'NE_DOA2', hasDemo: true, isMobile: true, createdAt: new Date('2023-01-30'), updatedAt: new Date('2024-01-15') },
  { id: 'g12', name: 'Age of Gods', providerId: 'pv2', providerName: 'Playtech', category: 'SLOTS', subCategory: 'Jackpot Slots', status: 'ACTIVE', rtp: 95.02, minBet: 0.15, maxBet: 300, currencies: ['EUR', 'USD', 'GBP', 'BRL'], jurisdictions: ['Malta', 'UK', 'Gibraltar', 'Brazil'], thumbnailUrl: 'assets/games/age-of-gods.jpg', gameCode: 'PT_AGE_OF_GODS', hasDemo: true, isMobile: true, createdAt: new Date('2023-02-20'), updatedAt: new Date('2024-02-10') },
  { id: 'g13', name: 'Live Baccarat', providerId: 'pv2', providerName: 'Playtech', category: 'LIVE_CASINO', subCategory: 'Baccarat', status: 'ACTIVE', rtp: 98.76, minBet: 1, maxBet: 5000, currencies: ['EUR', 'USD', 'GBP', 'PHP'], jurisdictions: ['Malta', 'UK', 'Philippines'], thumbnailUrl: 'assets/games/live-baccarat.jpg', gameCode: 'PT_LIVE_BACCARAT', hasDemo: false, isMobile: true, createdAt: new Date('2023-02-25'), updatedAt: new Date('2024-02-15') },
  { id: 'g14', name: 'Texas Hold\'em Poker', providerId: 'pv2', providerName: 'Playtech', category: 'POKER', subCategory: 'Texas Hold\'em', status: 'ACTIVE', rtp: 98.9, minBet: 1, maxBet: 2000, currencies: ['EUR', 'USD', 'GBP'], jurisdictions: ['Malta', 'UK', 'Gibraltar'], thumbnailUrl: 'assets/games/texas-holdem.jpg', gameCode: 'PT_TEXAS_HOLDEM', hasDemo: true, isMobile: false, createdAt: new Date('2023-03-05'), updatedAt: new Date('2024-02-20') },
  { id: 'g15', name: 'Aviator', providerId: 'pv4', providerName: 'Pragmatic Play', category: 'CRASH', subCategory: 'Crash Games', status: 'ACTIVE', rtp: 97.0, minBet: 0.1, maxBet: 100, currencies: ['EUR', 'USD', 'BRL', 'BTC'], jurisdictions: ['Malta', 'Brazil', 'Global'], thumbnailUrl: 'assets/games/aviator.jpg', gameCode: 'PP_AVIATOR', hasDemo: true, isMobile: true, createdAt: new Date('2023-06-01'), updatedAt: new Date('2024-03-01') },
  { id: 'g16', name: 'Mega Fire Blaze', providerId: 'pv2', providerName: 'Playtech', category: 'SLOTS', subCategory: 'Jackpot Slots', status: 'INACTIVE', rtp: 95.5, minBet: 0.2, maxBet: 200, currencies: ['EUR', 'USD'], jurisdictions: ['Malta', 'UK'], thumbnailUrl: 'assets/games/mega-fire-blaze.jpg', gameCode: 'PT_MEGA_FIRE_BLAZE', hasDemo: true, isMobile: true, createdAt: new Date('2023-04-01'), updatedAt: new Date('2024-01-10') }
];

const GAME_ASSIGNMENTS: GameAssignment[] = [
  { id: 'ga1', gameId: 'g1', gameName: 'Starburst', operatorId: 'op1', operatorName: 'BetKings Europe', status: 'ACTIVE', assignedAt: new Date('2023-03-01') },
  { id: 'ga2', gameId: 'g2', gameName: 'Gonzo\'s Quest', operatorId: 'op1', operatorName: 'BetKings Europe', status: 'ACTIVE', assignedAt: new Date('2023-03-01') },
  { id: 'ga3', gameId: 'g3', gameName: 'Lightning Roulette', operatorId: 'op1', operatorName: 'BetKings Europe', minBetOverride: 0.5, maxBetOverride: 1000, status: 'ACTIVE', assignedAt: new Date('2023-03-05') },
  { id: 'ga4', gameId: 'g5', gameName: 'Buffalo King', operatorId: 'op8', operatorName: 'BetBrasil', status: 'ACTIVE', assignedAt: new Date('2023-10-01') },
  { id: 'ga5', gameId: 'g6', gameName: 'Gates of Olympus', operatorId: 'op8', operatorName: 'BetBrasil', minBetOverride: 0.5, status: 'ACTIVE', assignedAt: new Date('2023-10-01') }
];

@Injectable({ providedIn: 'root' })
export class GameService {
  private games$ = new BehaviorSubject<Game[]>([...GAMES]);
  private assignments$ = new BehaviorSubject<GameAssignment[]>([...GAME_ASSIGNMENTS]);

  getGames(): Observable<Game[]> {
    return this.games$.asObservable().pipe(delay(300));
  }

  getGame(id: string): Observable<Game | undefined> {
    return this.games$.pipe(map(games => games.find(g => g.id === id)), delay(200));
  }

  createGame(game: Partial<Game>): Observable<Game> {
    const newGame: Game = { ...game as Game, id: 'g' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
    this.games$.next([...this.games$.value, newGame]);
    return of(newGame).pipe(delay(300));
  }

  updateGame(id: string, updates: Partial<Game>): Observable<Game> {
    const games = this.games$.value.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g);
    this.games$.next(games);
    return of(games.find(g => g.id === id)!).pipe(delay(300));
  }

  deleteGame(id: string): Observable<void> {
    this.games$.next(this.games$.value.filter(g => g.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getAssignments(): Observable<GameAssignment[]> {
    return this.assignments$.asObservable().pipe(delay(300));
  }

  getAssignmentsByOperator(operatorId: string): Observable<GameAssignment[]> {
    return this.assignments$.pipe(map(a => a.filter(item => item.operatorId === operatorId)), delay(200));
  }

  createAssignment(assignment: Partial<GameAssignment>): Observable<GameAssignment> {
    const newAssignment: GameAssignment = { ...assignment as GameAssignment, id: 'ga' + Date.now(), assignedAt: new Date() };
    this.assignments$.next([...this.assignments$.value, newAssignment]);
    return of(newAssignment).pipe(delay(300));
  }

  deleteAssignment(id: string): Observable<void> {
    this.assignments$.next(this.assignments$.value.filter(a => a.id !== id));
    return of(undefined).pipe(delay(300));
  }
}
