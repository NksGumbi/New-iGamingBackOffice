export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'EXPORT' | 'REVOKE';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: AuditAction;
  module: string;
  entityId: string;
  entityName: string;
  description: string;
  ipAddress: string;
  userAgent?: string;
}
