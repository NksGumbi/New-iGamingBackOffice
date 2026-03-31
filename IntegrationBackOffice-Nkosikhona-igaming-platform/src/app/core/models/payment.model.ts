export type PaymentMethodType = 'CREDIT_CARD' | 'CRYPTO' | 'E_WALLET' | 'BANK_TRANSFER' | 'VOUCHER';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export interface PaymentProvider {
  id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  supportedCurrencies: string[];
  supportedCountries: string[];
  minTransactionLimit: number;
  maxTransactionLimit: number;
  processingFee: number;
  settlementTime: string;
  apiEndpoint: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  type: PaymentMethodType;
  status: 'ACTIVE' | 'INACTIVE';
  minAmount: number;
  maxAmount: number;
  currencies: string[];
  processingTime: string;
}

export interface Transaction {
  id: string;
  operatorId: string;
  operatorName: string;
  providerId: string;
  providerName: string;
  playerId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}
