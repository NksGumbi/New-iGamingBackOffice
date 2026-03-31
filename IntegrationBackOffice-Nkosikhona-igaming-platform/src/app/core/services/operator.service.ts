import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { OperatorGroup, Operator } from '../models/operator.model';

const OPERATOR_GROUPS: OperatorGroup[] = [
  { id: 'og1', name: 'European Operations', description: 'EU licensed operators', status: 'ACTIVE', operatorCount: 4, createdAt: new Date('2023-01-15'), updatedAt: new Date('2024-01-20') },
  { id: 'og2', name: 'Asian Markets', description: 'Asia-Pacific operators', status: 'ACTIVE', operatorCount: 3, createdAt: new Date('2023-03-10'), updatedAt: new Date('2024-02-15') },
  { id: 'og3', name: 'Latin America', description: 'LATAM operators', status: 'ACTIVE', operatorCount: 2, createdAt: new Date('2023-06-01'), updatedAt: new Date('2024-03-01') },
  { id: 'og4', name: 'Test Group', description: 'Testing & QA operators', status: 'INACTIVE', operatorCount: 1, createdAt: new Date('2023-08-20'), updatedAt: new Date('2024-01-05') },
  { id: 'og5', name: 'North America', description: 'NA regulated markets', status: 'ACTIVE', operatorCount: 2, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-03-10') }
];

const OPERATORS: Operator[] = [
  { id: 'op1', name: 'BetKings Europe', code: 'BKE', groupId: 'og1', groupName: 'European Operations', status: 'ACTIVE', email: 'tech@betkings.eu', website: 'betkings.eu', jurisdiction: 'Malta', currency: 'EUR', createdAt: new Date('2023-02-01'), updatedAt: new Date('2024-01-15'), lastActivity: new Date('2024-03-25') },
  { id: 'op2', name: 'SpinPalace Online', code: 'SPO', groupId: 'og1', groupName: 'European Operations', status: 'ACTIVE', email: 'api@spinpalace.com', website: 'spinpalace.com', jurisdiction: 'Gibraltar', currency: 'EUR', createdAt: new Date('2023-03-15'), updatedAt: new Date('2024-02-01'), lastActivity: new Date('2024-03-28') },
  { id: 'op3', name: 'CasinoRoyal UK', code: 'CRU', groupId: 'og1', groupName: 'European Operations', status: 'ACTIVE', email: 'integration@casinoroyal.co.uk', website: 'casinoroyal.co.uk', jurisdiction: 'UK', currency: 'GBP', createdAt: new Date('2023-04-20'), updatedAt: new Date('2024-01-30') },
  { id: 'op4', name: 'WinZone Sweden', code: 'WZS', groupId: 'og1', groupName: 'European Operations', status: 'INACTIVE', email: 'ops@winzone.se', website: 'winzone.se', jurisdiction: 'Sweden', currency: 'SEK', createdAt: new Date('2023-07-01'), updatedAt: new Date('2024-01-10') },
  { id: 'op5', name: 'Asia Grand Casino', code: 'AGC', groupId: 'og2', groupName: 'Asian Markets', status: 'ACTIVE', email: 'tech@asiagrand.com', website: 'asiagrand.com', jurisdiction: 'Philippines', currency: 'PHP', createdAt: new Date('2023-04-01'), updatedAt: new Date('2024-02-20') },
  { id: 'op6', name: 'Pacific Bets', code: 'PCB', groupId: 'og2', groupName: 'Asian Markets', status: 'ACTIVE', email: 'api@pacificbets.com', website: 'pacificbets.com', jurisdiction: 'Curacao', currency: 'USD', createdAt: new Date('2023-05-15'), updatedAt: new Date('2024-03-05') },
  { id: 'op7', name: 'Tokyo Slots', code: 'TKS', groupId: 'og2', groupName: 'Asian Markets', status: 'PENDING', email: 'integration@tokyoslots.jp', website: 'tokyoslots.jp', jurisdiction: 'Japan', currency: 'JPY', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-03-01') },
  { id: 'op8', name: 'BetBrasil', code: 'BBR', groupId: 'og3', groupName: 'Latin America', status: 'ACTIVE', email: 'tech@betbrasil.com.br', website: 'betbrasil.com.br', jurisdiction: 'Brazil', currency: 'BRL', createdAt: new Date('2023-09-01'), updatedAt: new Date('2024-02-28') },
  { id: 'op9', name: 'PlayMexico', code: 'PMX', groupId: 'og3', groupName: 'Latin America', status: 'ACTIVE', email: 'ops@playmexico.mx', website: 'playmexico.mx', jurisdiction: 'Mexico', currency: 'MXN', createdAt: new Date('2023-10-15'), updatedAt: new Date('2024-03-10') },
  { id: 'op10', name: 'QA Operator Test', code: 'QAT', groupId: 'og4', groupName: 'Test Group', status: 'INACTIVE', email: 'qa@igaming-platform.com', website: 'test.igaming-platform.com', jurisdiction: 'Test', currency: 'USD', createdAt: new Date('2023-08-20'), updatedAt: new Date('2024-01-05') },
  { id: 'op11', name: 'BetUSA Online', code: 'BUS', groupId: 'og5', groupName: 'North America', status: 'ACTIVE', email: 'tech@betusa.com', website: 'betusa.com', jurisdiction: 'New Jersey', currency: 'USD', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-03-20') },
  { id: 'op12', name: 'CanadaBets', code: 'CAB', groupId: 'og5', groupName: 'North America', status: 'PENDING', email: 'api@canadabets.ca', website: 'canadabets.ca', jurisdiction: 'Ontario', currency: 'CAD', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-03-15') }
];

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private groups$ = new BehaviorSubject<OperatorGroup[]>([...OPERATOR_GROUPS]);
  private operators$ = new BehaviorSubject<Operator[]>([...OPERATORS]);

  getGroups(): Observable<OperatorGroup[]> {
    return this.groups$.asObservable().pipe(delay(300));
  }

  getGroup(id: string): Observable<OperatorGroup | undefined> {
    return this.groups$.pipe(map(groups => groups.find(g => g.id === id)), delay(200));
  }

  createGroup(group: Partial<OperatorGroup>): Observable<OperatorGroup> {
    const newGroup: OperatorGroup = {
      ...group as OperatorGroup,
      id: 'og' + Date.now(),
      operatorCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.groups$.next([...this.groups$.value, newGroup]);
    return of(newGroup).pipe(delay(300));
  }

  updateGroup(id: string, updates: Partial<OperatorGroup>): Observable<OperatorGroup> {
    const groups = this.groups$.value.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g);
    this.groups$.next(groups);
    return of(groups.find(g => g.id === id)!).pipe(delay(300));
  }

  deleteGroup(id: string): Observable<void> {
    this.groups$.next(this.groups$.value.filter(g => g.id !== id));
    return of(undefined).pipe(delay(300));
  }

  getOperators(): Observable<Operator[]> {
    return this.operators$.asObservable().pipe(delay(300));
  }

  getOperatorsByGroup(groupId: string): Observable<Operator[]> {
    return this.operators$.pipe(map(ops => ops.filter(o => o.groupId === groupId)), delay(200));
  }

  getOperator(id: string): Observable<Operator | undefined> {
    return this.operators$.pipe(map(ops => ops.find(o => o.id === id)), delay(200));
  }

  createOperator(operator: Partial<Operator>): Observable<Operator> {
    const newOp: Operator = {
      ...operator as Operator,
      id: 'op' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.operators$.next([...this.operators$.value, newOp]);
    return of(newOp).pipe(delay(300));
  }

  updateOperator(id: string, updates: Partial<Operator>): Observable<Operator> {
    const ops = this.operators$.value.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o);
    this.operators$.next(ops);
    return of(ops.find(o => o.id === id)!).pipe(delay(300));
  }

  deleteOperator(id: string): Observable<void> {
    this.operators$.next(this.operators$.value.filter(o => o.id !== id));
    return of(undefined).pipe(delay(300));
  }
}
