export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

export interface ApiKey {
  id: string;
  operatorId: string;
  operatorName: string;
  name: string;
  key: string;
  status: 'ACTIVE' | 'REVOKED';
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Webhook {
  id: string;
  operatorId: string;
  operatorName: string;
  url: string;
  eventType: string;
  status: 'ACTIVE' | 'INACTIVE';
  secret: string;
  lastTriggered?: Date;
  createdAt: Date;
}
