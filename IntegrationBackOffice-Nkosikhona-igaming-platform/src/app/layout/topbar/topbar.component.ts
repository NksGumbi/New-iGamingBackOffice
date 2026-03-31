import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  get userInitials(): string {
    if (!this.currentUser) return '?';
    return `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`;
  }

  get userFullName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  logout(): void {
    this.authService.logout();
  }
}
