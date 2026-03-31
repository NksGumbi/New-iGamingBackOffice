export interface OperatorGroup {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  operatorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Operator {
  id: string;
  name: string;
  code: string;
  groupId: string;
  groupName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  email: string;
  website: string;
  jurisdiction: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity?: Date;
}
