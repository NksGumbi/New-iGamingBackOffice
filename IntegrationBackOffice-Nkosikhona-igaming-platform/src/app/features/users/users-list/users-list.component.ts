import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Users" subtitle="Manage platform users" actionLabel="New User" (actionClick)="router.navigate(['/users/list/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search users...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <div class="user-cell">
                <div class="avatar">{{ row.firstName[0] }}{{ row.lastName[0] }}</div>
                <div>
                  <a [routerLink]="['/users/list', row.id]" class="link-cell">{{ row.firstName }} {{ row.lastName }}</a>
                  <div class="email">{{ row.email }}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="roleName"><mat-header-cell *matHeaderCellDef mat-sort-header>Role</mat-header-cell><mat-cell *matCellDef="let row">{{ row.roleName }}</mat-cell></ng-container>
          <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell></ng-container>
          <ng-container matColumnDef="lastLogin"><mat-header-cell *matHeaderCellDef mat-sort-header>Last Login</mat-header-cell><mat-cell *matCellDef="let row">{{ row.lastLogin ? (row.lastLogin | date:'short') : 'Never' }}</mat-cell></ng-container>
          <ng-container matColumnDef="createdAt"><mat-header-cell *matHeaderCellDef mat-sort-header>Created</mat-header-cell><mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</mat-cell></ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/users/list', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.user-cell { display: flex; align-items: center; gap: 10px; } .avatar { width: 32px; height: 32px; border-radius: 50%; background: #1a237e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; } .link-cell { color: #1a237e; text-decoration: none; font-weight: 500; font-size: 13px; display: block; &:hover { text-decoration: underline; } } .email { font-size: 12px; color: #90a4ae; }`]
})
export class UsersListComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['name', 'roleName', 'status', 'lastLogin', 'createdAt', 'actions'];

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.userService.getUsers().subscribe(u => { this.dataSource.data = u; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  delete(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete User', message: `Delete "${user.firstName} ${user.lastName}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.userService.deleteUser(user.id).subscribe(() => { this.snackBar.open('User deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
