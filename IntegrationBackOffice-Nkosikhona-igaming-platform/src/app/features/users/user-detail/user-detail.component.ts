import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (user) {
        <app-page-header [title]="user.firstName + ' ' + user.lastName" [subtitle]="user.email" actionLabel="Edit User" actionIcon="edit" (actionClick)="router.navigate(['/users/list', user.id, 'edit'])"></app-page-header>
        <mat-card class="app-card" style="max-width:600px">
          <mat-card-content>
            <div class="detail-row"><span>Status</span><app-status-badge [status]="user.status"></app-status-badge></div>
            <mat-divider></mat-divider>
            <div class="detail-row"><span>Role</span><a [routerLink]="['/users/roles', user.roleId]" class="link">{{ user.roleName }}</a></div>
            <mat-divider></mat-divider>
            <div class="detail-row"><span>Email</span><span>{{ user.email }}</span></div>
            <mat-divider></mat-divider>
            <div class="detail-row"><span>Last Login</span><span>{{ user.lastLogin ? (user.lastLogin | date:'medium') : 'Never' }}</span></div>
            <mat-divider></mat-divider>
            <div class="detail-row"><span>Created</span><span>{{ user.createdAt | date:'medium' }}</span></div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`.detail-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; font-size: 14px; } .link { color: #1a237e; text-decoration: none; &:hover { text-decoration: underline; } }`]
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  user: User | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id).subscribe(u => { this.user = u; });
  }
}
