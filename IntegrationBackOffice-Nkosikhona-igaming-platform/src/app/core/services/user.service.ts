import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, Role, ApiKey, Webhook } from '../models/user.model';

const MODULES = ['Dashboard', 'Operators', 'Providers', 'Games', 'Payments', 'Users', 'Integrations', 'Audit Logs', 'Settings'];

const ROLES: Role[] = [
  {
    id: 'r1', name: 'Super Admin', description: 'Full system access', userCount: 2,
    permissions: MODULES.map(m => ({ module: m, view: true, create: true, edit: true, delete: true })),
    createdAt: new Date('2023-01-01'), updatedAt: new Date('2024-01-15')
  },
  {
    id: 'r2', name: 'Operations Manager', description: 'Manage operators and providers', userCount: 3,
    permissions: MODULES.map(m => ({ module: m, view: true, create: ['Operators', 'Providers', 'Games'].includes(m), edit: ['Operators', 'Providers', 'Games'].includes(m), delete: false })),
    createdAt: new Date('2023-01-10'), updatedAt: new Date('2024-02-01')
  },
  {
    id: 'r3', name: 'Finance Manager', description: 'Manage payment providers and transactions', userCount: 2,
    permissions: MODULES.map(m => ({ module: m, view: true, create: m === 'Payments', edit: m === 'Payments', delete: false })),
    createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-01-20')
  },
  {
    id: 'r4', name: 'Read Only', description: 'View access to all modules', userCount: 4,
    permissions: MODULES.map(m => ({ module: m, view: true, create: false, edit: false, delete: false })),
    createdAt: new Date('2023-03-01'), updatedAt: new Date('2024-01-10')
  },
  {
    id: 'r5', name: 'Support Agent', description: 'View operators and transactions', userCount: 2,
    permissions: MODULES.map(m => ({ module: m, view: ['Operators', 'Payments', 'Audit Logs'].includes(m), create: false, edit: false, delete: false })),
    createdAt: new Date('2023-04-01'), updatedAt: new Date('2024-02-15')
  }
];

const USERS: User[] = [
  { id: 'usr1', firstName: 'Sarah', lastName: 'Connor', email: 'sarah.connor@igaming.com', roleId: 'r1', roleName: 'Super Admin', status: 'ACTIVE', lastLogin: new Date('2024-03-28'), createdAt: new Date('2023-01-05'), updatedAt: new Date('2024-03-28') },
  { id: 'usr2', firstName: 'John', lastName: 'Smith', email: 'john.smith@igaming.com', roleId: 'r1', roleName: 'Super Admin', status: 'ACTIVE', lastLogin: new Date('2024-03-27'), createdAt: new Date('2023-01-05'), updatedAt: new Date('2024-03-27') },
  { id: 'usr3', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@igaming.com', roleId: 'r2', roleName: 'Operations Manager', status: 'ACTIVE', lastLogin: new Date('2024-03-25'), createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-03-25') },
  { id: 'usr4', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@igaming.com', roleId: 'r2', roleName: 'Operations Manager', status: 'ACTIVE', lastLogin: new Date('2024-03-20'), createdAt: new Date('2023-02-15'), updatedAt: new Date('2024-03-20') },
  { id: 'usr5', firstName: 'Emma', lastName: 'Johnson', email: 'emma.johnson@igaming.com', roleId: 'r2', roleName: 'Operations Manager', status: 'INACTIVE', lastLogin: new Date('2024-02-01'), createdAt: new Date('2023-03-01'), updatedAt: new Date('2024-02-01') },
  { id: 'usr6', firstName: 'Robert', lastName: 'Brown', email: 'robert.brown@igaming.com', roleId: 'r3', roleName: 'Finance Manager', status: 'ACTIVE', lastLogin: new Date('2024-03-26'), createdAt: new Date('2023-03-15'), updatedAt: new Date('2024-03-26') },
  { id: 'usr7', firstName: 'Lisa', lastName: 'Davis', email: 'lisa.davis@igaming.com', roleId: 'r3', roleName: 'Finance Manager', status: 'ACTIVE', lastLogin: new Date('2024-03-22'), createdAt: new Date('2023-04-01'), updatedAt: new Date('2024-03-22') },
  { id: 'usr8', firstName: 'Michael', lastName: 'Lee', email: 'michael.lee@igaming.com', roleId: 'r4', roleName: 'Read Only', status: 'ACTIVE', lastLogin: new Date('2024-03-15'), createdAt: new Date('2023-05-01'), updatedAt: new Date('2024-03-15') },
  { id: 'usr9', firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@igaming.com', roleId: 'r4', roleName: 'Read Only', status: 'ACTIVE', lastLogin: new Date('2024-03-10'), createdAt: new Date('2023-05-15'), updatedAt: new Date('2024-03-10') },
  { id: 'usr10', firstName: 'David', lastName: 'Taylor', email: 'david.taylor@igaming.com', roleId: 'r4', roleName: 'Read Only', status: 'SUSPENDED', createdAt: new Date('2023-06-01'), updatedAt: new Date('2024-01-15') },
  { id: 'usr11', firstName: 'Amanda', lastName: 'White', email: 'amanda.white@igaming.com', roleId: 'r4', roleName: 'Read Only', status: 'ACTIVE', lastLogin: new Date('2024-03-05'), createdAt: new Date('2023-07-01'), updatedAt: new Date('2024-03-05') },
  { id: 'usr12', firstName: 'Kevin', lastName: 'Anderson', email: 'kevin.anderson@igaming.com', roleId: 'r5', roleName: 'Support Agent', status: 'ACTIVE', lastLogin: new Date('2024-03-28'), createdAt: new Date('2023-08-01'), updatedAt: new Date('2024-03-28') },
  { id: 'usr13', firstName: 'Nicole', lastName: 'Thomas', email: 'nicole.thomas@igaming.com', roleId: 'r5', roleName: 'Support Agent', status: 'ACTIVE', lastLogin: new Date('2024-03-27'), createdAt: new Date('2023-09-01'), updatedAt: new Date('2024-03-27') }
];

const API_KEYS: ApiKey[] = [
  { id: 'ak1', operatorId: 'op1', operatorName: 'BetKings Europe', name: 'Production API Key', key: 'ibo_live_bke_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', status: 'ACTIVE', lastUsed: new Date('2024-03-28'), createdAt: new Date('2023-03-01'), expiresAt: new Date('2025-03-01') },
  { id: 'ak2', operatorId: 'op1', operatorName: 'BetKings Europe', name: 'Staging API Key', key: 'ibo_test_bke_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2', status: 'ACTIVE', lastUsed: new Date('2024-03-25'), createdAt: new Date('2023-03-01') },
  { id: 'ak3', operatorId: 'op2', operatorName: 'SpinPalace Online', name: 'Production API Key', key: 'ibo_live_spo_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8', status: 'ACTIVE', lastUsed: new Date('2024-03-27'), createdAt: new Date('2023-04-15'), expiresAt: new Date('2025-04-15') },
  { id: 'ak4', operatorId: 'op5', operatorName: 'Asia Grand Casino', name: 'Production API Key', key: 'ibo_live_agc_w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4', status: 'REVOKED', createdAt: new Date('2023-05-01') }
];

const WEBHOOKS: Webhook[] = [
  { id: 'wh1', operatorId: 'op1', operatorName: 'BetKings Europe', url: 'https://betkings.eu/webhooks/igaming', eventType: 'GAME_ROUND_COMPLETE', status: 'ACTIVE', secret: 'whsec_bke_abc123', lastTriggered: new Date('2024-03-28'), createdAt: new Date('2023-03-05') },
  { id: 'wh2', operatorId: 'op1', operatorName: 'BetKings Europe', url: 'https://betkings.eu/webhooks/payment', eventType: 'TRANSACTION_COMPLETE', status: 'ACTIVE', secret: 'whsec_bke_def456', lastTriggered: new Date('2024-03-28'), createdAt: new Date('2023-03-05') },
  { id: 'wh3', operatorId: 'op2', operatorName: 'SpinPalace Online', url: 'https://spinpalace.com/api/webhooks', eventType: 'GAME_ROUND_COMPLETE', status: 'ACTIVE', secret: 'whsec_spo_ghi789', lastTriggered: new Date('2024-03-27'), createdAt: new Date('2023-04-20') },
  { id: 'wh4', operatorId: 'op5', operatorName: 'Asia Grand Casino', url: 'https://asiagrand.com/webhooks', eventType: 'PLAYER_SESSION_START', status: 'INACTIVE', secret: 'whsec_agc_jkl012', createdAt: new Date('2023-05-10') }
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private roles$ = new BehaviorSubject<Role[]>([...ROLES]);
  private users$ = new BehaviorSubject<User[]>([...USERS]);
  private apiKeys$ = new BehaviorSubject<ApiKey[]>([...API_KEYS]);
  private webhooks$ = new BehaviorSubject<Webhook[]>([...WEBHOOKS]);

  getRoles(): Observable<Role[]> {
    return this.roles$.asObservable().pipe(delay(300));
  }

  getRole(id: string): Observable<Role | undefined> {
    return this.roles$.pipe(map(roles => roles.find(r => r.id === id)), delay(200));
  }

  createRole(role: Partial<Role>): Observable<Role> {
    const newRole: Role = { ...role as Role, id: 'r' + Date.now(), userCount: 0, createdAt: new Date(), updatedAt: new Date() };
    this.roles$.next([...this.roles$.value, newRole]);
    return of(newRole).pipe(delay(300));
  }

  updateRole(id: string, updates: Partial<Role>): Observable<Role> {
    const roles = this.roles$.value.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r);
    this.roles$.next(roles);
    return of(roles.find(r => r.id === id)!).pipe(delay(300));
  }

  deleteRole(id: string): Observable<void> {
    this.roles$.next(this.roles$.value.filter(r => r.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable().pipe(delay(300));
  }

  getUser(id: string): Observable<User | undefined> {
    return this.users$.pipe(map(users => users.find(u => u.id === id)), delay(200));
  }

  createUser(user: Partial<User>): Observable<User> {
    const newUser: User = { ...user as User, id: 'usr' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
    this.users$.next([...this.users$.value, newUser]);
    return of(newUser).pipe(delay(300));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const users = this.users$.value.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date() } : u);
    this.users$.next(users);
    return of(users.find(u => u.id === id)!).pipe(delay(300));
  }

  deleteUser(id: string): Observable<void> {
    this.users$.next(this.users$.value.filter(u => u.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getApiKeys(): Observable<ApiKey[]> {
    return this.apiKeys$.asObservable().pipe(delay(300));
  }

  getApiKeysByOperator(operatorId: string): Observable<ApiKey[]> {
    return this.apiKeys$.pipe(map(keys => keys.filter(k => k.operatorId === operatorId)), delay(200));
  }

  generateApiKey(operatorId: string, operatorName: string, name: string): Observable<ApiKey> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomStr = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newKey: ApiKey = {
      id: 'ak' + Date.now(), operatorId, operatorName, name,
      key: `ibo_live_${operatorId}_${randomStr}`,
      status: 'ACTIVE', createdAt: new Date()
    };
    this.apiKeys$.next([...this.apiKeys$.value, newKey]);
    return of(newKey).pipe(delay(500));
  }

  revokeApiKey(id: string): Observable<void> {
    const keys = this.apiKeys$.value.map(k => k.id === id ? { ...k, status: 'REVOKED' as const } : k);
    this.apiKeys$.next(keys);
    return of(undefined).pipe(delay(300));
  }

  getWebhooks(): Observable<Webhook[]> {
    return this.webhooks$.asObservable().pipe(delay(300));
  }

  getWebhooksByOperator(operatorId: string): Observable<Webhook[]> {
    return this.webhooks$.pipe(map(whs => whs.filter(w => w.operatorId === operatorId)), delay(200));
  }

  createWebhook(webhook: Partial<Webhook>): Observable<Webhook> {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const secret = 'whsec_' + Array.from(array, b => chars[b % chars.length]).join('');
    const newWebhook: Webhook = { ...webhook as Webhook, id: 'wh' + Date.now(), secret, createdAt: new Date() };
    this.webhooks$.next([...this.webhooks$.value, newWebhook]);
    return of(newWebhook).pipe(delay(300));
  }

  deleteWebhook(id: string): Observable<void> {
    this.webhooks$.next(this.webhooks$.value.filter(w => w.id !== id));
    return of(undefined).pipe(delay(300));
  }

  testWebhook(id: string): Observable<{ success: boolean; message: string }> {
    return of({ success: true, message: 'Webhook test delivered successfully (200 OK)' }).pipe(delay(1000));
  }
}
