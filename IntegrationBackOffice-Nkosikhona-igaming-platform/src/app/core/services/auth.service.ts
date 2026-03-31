import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

const MOCK_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: 'admin@igaming.com',
    password: 'admin123',
    user: {
      id: 'u1',
      email: 'admin@igaming.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      token: 'mock-jwt-token-admin-12345'
    }
  },
  {
    email: 'operator@igaming.com',
    password: 'op123',
    user: {
      id: 'u2',
      email: 'operator@igaming.com',
      firstName: 'Operator',
      lastName: 'Manager',
      role: 'OPERATOR_MANAGER',
      token: 'mock-jwt-token-operator-67890'
    }
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthUser | null> {
    const match = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (match) {
      return of(match.user).pipe(
        delay(500),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
    }
    return of(null).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.currentUser?.token ?? null;
  }
}
