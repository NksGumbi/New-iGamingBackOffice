import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { PaymentProvider, PaymentMethod, Transaction } from '../models/payment.model';

const PAYMENT_PROVIDERS: PaymentProvider[] = [
  { id: 'pp1', name: 'Stripe', code: 'STRIPE', status: 'ACTIVE', supportedCurrencies: ['EUR', 'USD', 'GBP', 'CAD', 'AUD'], supportedCountries: ['US', 'UK', 'EU', 'CA', 'AU'], minTransactionLimit: 1, maxTransactionLimit: 50000, processingFee: 1.4, settlementTime: 'T+2', apiEndpoint: 'https://api.stripe.com/v1', createdAt: new Date('2023-02-15'), updatedAt: new Date('2024-03-01') },
  { id: 'pp2', name: 'PaySafe', code: 'PAYSAFE', status: 'ACTIVE', supportedCurrencies: ['EUR', 'USD', 'GBP', 'CAD'], supportedCountries: ['US', 'UK', 'EU', 'CA'], minTransactionLimit: 5, maxTransactionLimit: 10000, processingFee: 2.5, settlementTime: 'T+1', apiEndpoint: 'https://api.paysafe.com/v1', createdAt: new Date('2023-03-01'), updatedAt: new Date('2024-02-15') },
  { id: 'pp3', name: 'Nuvei', code: 'NUVEI', status: 'ACTIVE', supportedCurrencies: ['EUR', 'USD', 'BRL', 'MXN', 'PHP', 'JPY'], supportedCountries: ['US', 'EU', 'BR', 'MX', 'PH', 'JP'], minTransactionLimit: 1, maxTransactionLimit: 100000, processingFee: 1.8, settlementTime: 'T+2', apiEndpoint: 'https://api.nuvei.com/v1', createdAt: new Date('2023-04-15'), updatedAt: new Date('2024-03-10') },
  { id: 'pp4', name: 'BitPay', code: 'BITPAY', status: 'ACTIVE', supportedCurrencies: ['BTC', 'ETH', 'USDT', 'LTC'], supportedCountries: ['Global'], minTransactionLimit: 10, maxTransactionLimit: 1000000, processingFee: 1.0, settlementTime: 'T+1', apiEndpoint: 'https://bitpay.com/api/v2', createdAt: new Date('2023-06-10'), updatedAt: new Date('2024-02-28') },
  { id: 'pp5', name: 'CoinGate', code: 'COINGATE', status: 'ACTIVE', supportedCurrencies: ['BTC', 'ETH', 'USDT', 'BNB', 'XRP'], supportedCountries: ['Global'], minTransactionLimit: 5, maxTransactionLimit: 500000, processingFee: 1.25, settlementTime: 'T+0', apiEndpoint: 'https://api.coingate.com/v2', createdAt: new Date('2023-07-01'), updatedAt: new Date('2024-03-05') },
  { id: 'pp6', name: 'Skrill', code: 'SKRILL', status: 'ACTIVE', supportedCurrencies: ['EUR', 'USD', 'GBP', 'BRL'], supportedCountries: ['EU', 'US', 'BR'], minTransactionLimit: 1, maxTransactionLimit: 25000, processingFee: 1.9, settlementTime: 'T+1', apiEndpoint: 'https://pay.skrill.com/app/api', createdAt: new Date('2023-05-01'), updatedAt: new Date('2024-02-20') },
  { id: 'pp7', name: 'Neteller', code: 'NETELLER', status: 'INACTIVE', supportedCurrencies: ['EUR', 'USD', 'GBP'], supportedCountries: ['EU', 'UK'], minTransactionLimit: 2, maxTransactionLimit: 30000, processingFee: 2.0, settlementTime: 'T+2', apiEndpoint: 'https://api.neteller.com/v1', createdAt: new Date('2023-05-15'), updatedAt: new Date('2024-01-05') }
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', providerId: 'pp1', providerName: 'Stripe', name: 'Visa/Mastercard', type: 'CREDIT_CARD', status: 'ACTIVE', minAmount: 1, maxAmount: 50000, currencies: ['EUR', 'USD', 'GBP'], processingTime: 'Instant' },
  { id: 'pm2', providerId: 'pp1', providerName: 'Stripe', name: 'Apple Pay', type: 'E_WALLET', status: 'ACTIVE', minAmount: 1, maxAmount: 10000, currencies: ['EUR', 'USD', 'GBP'], processingTime: 'Instant' },
  { id: 'pm3', providerId: 'pp2', providerName: 'PaySafe', name: 'Paysafecard', type: 'VOUCHER', status: 'ACTIVE', minAmount: 5, maxAmount: 1000, currencies: ['EUR', 'USD', 'GBP', 'CAD'], processingTime: 'Instant' },
  { id: 'pm4', providerId: 'pp3', providerName: 'Nuvei', name: 'Bank Transfer', type: 'BANK_TRANSFER', status: 'ACTIVE', minAmount: 10, maxAmount: 100000, currencies: ['EUR', 'USD', 'BRL', 'MXN'], processingTime: '1-3 business days' },
  { id: 'pm5', providerId: 'pp4', providerName: 'BitPay', name: 'Bitcoin', type: 'CRYPTO', status: 'ACTIVE', minAmount: 10, maxAmount: 1000000, currencies: ['BTC'], processingTime: '10-30 minutes' },
  { id: 'pm6', providerId: 'pp4', providerName: 'BitPay', name: 'Ethereum', type: 'CRYPTO', status: 'ACTIVE', minAmount: 5, maxAmount: 500000, currencies: ['ETH'], processingTime: '5-15 minutes' },
  { id: 'pm7', providerId: 'pp5', providerName: 'CoinGate', name: 'USDT (TRC20)', type: 'CRYPTO', status: 'ACTIVE', minAmount: 5, maxAmount: 500000, currencies: ['USDT'], processingTime: '1-2 minutes' }
];

const generateTransactions = (): Transaction[] => {
  const operators = [
    { id: 'op1', name: 'BetKings Europe' },
    { id: 'op2', name: 'SpinPalace Online' },
    { id: 'op5', name: 'Asia Grand Casino' },
    { id: 'op8', name: 'BetBrasil' }
  ];
  const providers = [
    { id: 'pp1', name: 'Stripe' },
    { id: 'pp3', name: 'Nuvei' },
    { id: 'pp4', name: 'BitPay' }
  ];
  const statuses: Transaction['status'][] = ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];
  const types: Transaction['type'][] = ['DEPOSIT', 'WITHDRAWAL'];
  const currencies = ['EUR', 'USD', 'GBP', 'BRL'];

  return Array.from({ length: 50 }, (_, i) => {
    const op = operators[i % operators.length];
    const pv = providers[i % providers.length];
    return {
      id: `txn${i + 1}`,
      operatorId: op.id,
      operatorName: op.name,
      providerId: pv.id,
      providerName: pv.name,
      playerId: `player${Math.floor(Math.random() * 1000) + 1}`,
      type: types[i % 2],
      status: statuses[i % 4],
      amount: Math.round((Math.random() * 5000 + 10) * 100) / 100,
      currency: currencies[i % currencies.length],
      reference: `REF-${Date.now()}-${i}`,
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(Date.now() - i * 86400000 + 3600000)
    };
  });
};

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private providers$ = new BehaviorSubject<PaymentProvider[]>([...PAYMENT_PROVIDERS]);
  private methods$ = new BehaviorSubject<PaymentMethod[]>([...PAYMENT_METHODS]);
  private transactions$ = new BehaviorSubject<Transaction[]>(generateTransactions());

  getProviders(): Observable<PaymentProvider[]> {
    return this.providers$.asObservable().pipe(delay(300));
  }

  getProvider(id: string): Observable<PaymentProvider | undefined> {
    return this.providers$.pipe(map(ps => ps.find(p => p.id === id)), delay(200));
  }

  createProvider(provider: Partial<PaymentProvider>): Observable<PaymentProvider> {
    const newProvider: PaymentProvider = { ...provider as PaymentProvider, id: 'pp' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
    this.providers$.next([...this.providers$.value, newProvider]);
    return of(newProvider).pipe(delay(300));
  }

  updateProvider(id: string, updates: Partial<PaymentProvider>): Observable<PaymentProvider> {
    const providers = this.providers$.value.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p);
    this.providers$.next(providers);
    return of(providers.find(p => p.id === id)!).pipe(delay(300));
  }

  deleteProvider(id: string): Observable<void> {
    this.providers$.next(this.providers$.value.filter(p => p.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getMethods(): Observable<PaymentMethod[]> {
    return this.methods$.asObservable().pipe(delay(300));
  }

  getMethodsByProvider(providerId: string): Observable<PaymentMethod[]> {
    return this.methods$.pipe(map(ms => ms.filter(m => m.providerId === providerId)), delay(200));
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable().pipe(delay(400));
  }
}
