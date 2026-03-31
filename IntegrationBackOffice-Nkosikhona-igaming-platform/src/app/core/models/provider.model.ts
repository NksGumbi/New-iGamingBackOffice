export type ProviderType = 'GAME_PROVIDER' | 'PAYMENT_PROVIDER';
export type Environment = 'STAGING' | 'PRODUCTION';

export interface ProviderGroup {
  id: string;
  name: string;
  description: string;
  type: ProviderType;
  status: 'ACTIVE' | 'INACTIVE';
  providerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider {
  id: string;
  name: string;
  code: string;
  groupId: string;
  groupName: string;
  type: ProviderType;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  environment: Environment;
  apiEndpoint: string;
  secretKey: string;
  webhookUrl?: string;
  supportedCurrencies: string[];
  supportedJurisdictions: string[];
  createdAt: Date;
  updatedAt: Date;
}
