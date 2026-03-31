import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuditLog, AuditAction } from '../models/audit-log.model';

const MODULES = ['Operators', 'Providers', 'Games', 'Payments', 'Users', 'Integrations', 'Settings', 'Auth'];
const USERS = [
  { id: 'usr1', name: 'Sarah Connor' },
  { id: 'usr2', name: 'John Smith' },
  { id: 'usr3', name: 'Maria Garcia' },
  { id: 'usr6', name: 'Robert Brown' }
];
const ACTIONS: AuditAction[] = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'REVOKE'];
const IPS = ['192.168.1.101', '10.0.0.50', '172.16.0.25', '203.0.113.45', '198.51.100.12'];

const generateLogs = (): AuditLog[] => {
  const descriptions: Record<string, string[]> = {
    CREATE: ['Created new operator: BetKings Europe', 'Created provider group: Tier 1 Studios', 'Created user: james.wilson@igaming.com', 'Created game assignment for Starburst', 'Generated new API key for SpinPalace'],
    UPDATE: ['Updated operator status to ACTIVE', 'Updated provider API endpoint', 'Updated payment method limits', 'Updated role permissions for Finance Manager', 'Updated platform settings'],
    DELETE: ['Deleted operator: QA Test Operator', 'Removed game assignment', 'Deleted webhook configuration', 'Deleted user account', 'Removed provider from group'],
    LOGIN: ['User logged in successfully', 'Admin login from new IP address'],
    LOGOUT: ['User logged out', 'Session expired - auto logout'],
    VIEW: ['Viewed operator detail: SpinPalace Online', 'Viewed transaction report', 'Viewed audit logs', 'Viewed API keys list'],
    EXPORT: ['Exported transaction report (CSV)', 'Exported operator list', 'Exported audit logs'],
    REVOKE: ['Revoked API key for BetKings Europe', 'Revoked user session', 'Revoked API key (expired)']
  };

  return Array.from({ length: 60 }, (_, i) => {
    const action = ACTIONS[i % ACTIONS.length];
    const user = USERS[i % USERS.length];
    const module = MODULES[i % MODULES.length];
    const descList = descriptions[action];
    return {
      id: `log${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000),
      userId: user.id,
      userName: user.name,
      action,
      module,
      entityId: `${module.toLowerCase()}-${i + 1}`,
      entityName: `${module} Entity ${i + 1}`,
      description: descList[i % descList.length],
      ipAddress: IPS[i % IPS.length]
    };
  });
};

const AUDIT_LOGS = generateLogs();

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  getLogs(): Observable<AuditLog[]> {
    return of(AUDIT_LOGS).pipe(delay(400));
  }
}
