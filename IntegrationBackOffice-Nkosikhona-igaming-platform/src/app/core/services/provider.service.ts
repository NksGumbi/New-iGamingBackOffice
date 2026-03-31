import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ProviderGroup, Provider } from '../models/provider.model';

const PROVIDER_GROUPS: ProviderGroup[] = [
  { id: 'pg1', name: 'Tier 1 Game Studios', description: 'Premium game content providers', type: 'GAME_PROVIDER', status: 'ACTIVE', providerCount: 3, createdAt: new Date('2023-01-01'), updatedAt: new Date('2024-01-15') },
  { id: 'pg2', name: 'Emerging Game Studios', description: 'New and growing game studios', type: 'GAME_PROVIDER', status: 'ACTIVE', providerCount: 2, createdAt: new Date('2023-04-01'), updatedAt: new Date('2024-02-01') },
  { id: 'pg3', name: 'Global Payment Networks', description: 'International payment processors', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', providerCount: 3, createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-01-20') },
  { id: 'pg4', name: 'Crypto Payment Gateways', description: 'Cryptocurrency payment solutions', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', providerCount: 2, createdAt: new Date('2023-06-01'), updatedAt: new Date('2024-03-01') }
];

const PROVIDERS: Provider[] = [
  { id: 'pv1', name: 'NetEnt', code: 'NETENT', groupId: 'pg1', groupName: 'Tier 1 Game Studios', type: 'GAME_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.netent.com/v2', secretKey: 'sk_live_netent_abc123', webhookUrl: 'https://platform.com/webhooks/netent', supportedCurrencies: ['EUR', 'USD', 'GBP', 'SEK'], supportedJurisdictions: ['Malta', 'UK', 'Sweden'], createdAt: new Date('2023-01-10'), updatedAt: new Date('2024-01-20') },
  { id: 'pv2', name: 'Playtech', code: 'PLAYTECH', groupId: 'pg1', groupName: 'Tier 1 Game Studios', type: 'GAME_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.playtech.com/v3', secretKey: 'sk_live_playtech_xyz789', supportedCurrencies: ['EUR', 'USD', 'GBP', 'BRL'], supportedJurisdictions: ['Malta', 'UK', 'Gibraltar', 'Philippines'], createdAt: new Date('2023-01-15'), updatedAt: new Date('2024-02-10') },
  { id: 'pv3', name: 'Evolution Gaming', code: 'EVOLUTION', groupId: 'pg1', groupName: 'Tier 1 Game Studios', type: 'GAME_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.evolution.com/v1', secretKey: 'sk_live_evolution_def456', webhookUrl: 'https://platform.com/webhooks/evolution', supportedCurrencies: ['EUR', 'USD', 'GBP', 'SEK', 'CAD'], supportedJurisdictions: ['Malta', 'UK', 'Sweden', 'Canada'], createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-01-25') },
  { id: 'pv4', name: 'Pragmatic Play', code: 'PRAGMATIC', groupId: 'pg2', groupName: 'Emerging Game Studios', type: 'GAME_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.pragmaticplay.com/v2', secretKey: 'sk_live_pragmatic_ghi012', supportedCurrencies: ['EUR', 'USD', 'BRL', 'MXN', 'PHP'], supportedJurisdictions: ['Malta', 'UK', 'Brazil', 'Mexico', 'Philippines'], createdAt: new Date('2023-05-01'), updatedAt: new Date('2024-02-20') },
  { id: 'pv5', name: 'Hacksaw Gaming', code: 'HACKSAW', groupId: 'pg2', groupName: 'Emerging Game Studios', type: 'GAME_PROVIDER', status: 'INACTIVE', environment: 'STAGING', apiEndpoint: 'https://staging.hacksaw.com/api', secretKey: 'sk_test_hacksaw_jkl345', supportedCurrencies: ['EUR', 'USD'], supportedJurisdictions: ['Malta', 'Sweden'], createdAt: new Date('2023-09-01'), updatedAt: new Date('2024-01-05') },
  { id: 'pv6', name: 'Stripe Payments', code: 'STRIPE', groupId: 'pg3', groupName: 'Global Payment Networks', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.stripe.com/v1', secretKey: 'sk_live_stripe_mno678', webhookUrl: 'https://platform.com/webhooks/stripe', supportedCurrencies: ['EUR', 'USD', 'GBP', 'CAD', 'AUD'], supportedJurisdictions: ['Global'], createdAt: new Date('2023-02-15'), updatedAt: new Date('2024-03-01') },
  { id: 'pv7', name: 'Paysafe Group', code: 'PAYSAFE', groupId: 'pg3', groupName: 'Global Payment Networks', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.paysafe.com/v1', secretKey: 'sk_live_paysafe_pqr901', supportedCurrencies: ['EUR', 'USD', 'GBP', 'CAD'], supportedJurisdictions: ['EU', 'North America'], createdAt: new Date('2023-03-01'), updatedAt: new Date('2024-02-15') },
  { id: 'pv8', name: 'Nuvei', code: 'NUVEI', groupId: 'pg3', groupName: 'Global Payment Networks', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.nuvei.com/v1', secretKey: 'sk_live_nuvei_stu234', supportedCurrencies: ['EUR', 'USD', 'BRL', 'MXN', 'PHP', 'JPY'], supportedJurisdictions: ['Global'], createdAt: new Date('2023-04-15'), updatedAt: new Date('2024-03-10') },
  { id: 'pv9', name: 'BitPay', code: 'BITPAY', groupId: 'pg4', groupName: 'Crypto Payment Gateways', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://bitpay.com/api/v2', secretKey: 'sk_live_bitpay_vwx567', supportedCurrencies: ['BTC', 'ETH', 'USDT', 'LTC'], supportedJurisdictions: ['Global'], createdAt: new Date('2023-06-10'), updatedAt: new Date('2024-02-28') },
  { id: 'pv10', name: 'CoinGate', code: 'COINGATE', groupId: 'pg4', groupName: 'Crypto Payment Gateways', type: 'PAYMENT_PROVIDER', status: 'ACTIVE', environment: 'PRODUCTION', apiEndpoint: 'https://api.coingate.com/v2', secretKey: 'sk_live_coingate_yz890', supportedCurrencies: ['BTC', 'ETH', 'USDT', 'BNB', 'XRP'], supportedJurisdictions: ['Global'], createdAt: new Date('2023-07-01'), updatedAt: new Date('2024-03-05') }
];

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private groups$ = new BehaviorSubject<ProviderGroup[]>([...PROVIDER_GROUPS]);
  private providers$ = new BehaviorSubject<Provider[]>([...PROVIDERS]);

  getGroups(): Observable<ProviderGroup[]> {
    return this.groups$.asObservable().pipe(delay(300));
  }

  getGroup(id: string): Observable<ProviderGroup | undefined> {
    return this.groups$.pipe(map(groups => groups.find(g => g.id === id)), delay(200));
  }

  createGroup(group: Partial<ProviderGroup>): Observable<ProviderGroup> {
    const newGroup: ProviderGroup = { ...group as ProviderGroup, id: 'pg' + Date.now(), providerCount: 0, createdAt: new Date(), updatedAt: new Date() };
    this.groups$.next([...this.groups$.value, newGroup]);
    return of(newGroup).pipe(delay(300));
  }

  updateGroup(id: string, updates: Partial<ProviderGroup>): Observable<ProviderGroup> {
    const groups = this.groups$.value.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g);
    this.groups$.next(groups);
    return of(groups.find(g => g.id === id)!).pipe(delay(300));
  }

  deleteGroup(id: string): Observable<void> {
    this.groups$.next(this.groups$.value.filter(g => g.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getProviders(): Observable<Provider[]> {
    return this.providers$.asObservable().pipe(delay(300));
  }

  getProvidersByGroup(groupId: string): Observable<Provider[]> {
    return this.providers$.pipe(map(ps => ps.filter(p => p.groupId === groupId)), delay(200));
  }

  getProvider(id: string): Observable<Provider | undefined> {
    return this.providers$.pipe(map(ps => ps.find(p => p.id === id)), delay(200));
  }

  createProvider(provider: Partial<Provider>): Observable<Provider> {
    const newProvider: Provider = { ...provider as Provider, id: 'pv' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
    this.providers$.next([...this.providers$.value, newProvider]);
    return of(newProvider).pipe(delay(300));
  }

  updateProvider(id: string, updates: Partial<Provider>): Observable<Provider> {
    const providers = this.providers$.value.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p);
    this.providers$.next(providers);
    return of(providers.find(p => p.id === id)!).pipe(delay(300));
  }

  deleteProvider(id: string): Observable<void> {
    this.providers$.next(this.providers$.value.filter(p => p.id !== id));
    return of(undefined).pipe(delay(300));
  }
}
