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
import { UserService } from '../../../../core/services/user.service';
import { Role } from '../../../../core/models/user.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, DatePipe, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Roles" subtitle="Manage user roles and permissions" actionLabel="New Role" (actionClick)="router.navigate(['/users/roles/new'])"></app-page-header>
      <div class="app-card">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name"><mat-header-cell *matHeaderCellDef mat-sort-header>Role Name</mat-header-cell><mat-cell *matCellDef="let row"><a [routerLink]="['/users/roles', row.id]" class="link-cell">{{ row.name }}</a></mat-cell></ng-container>
          <ng-container matColumnDef="description"><mat-header-cell *matHeaderCellDef>Description</mat-header-cell><mat-cell *matCellDef="let row">{{ row.description }}</mat-cell></ng-container>
          <ng-container matColumnDef="userCount"><mat-header-cell *matHeaderCellDef mat-sort-header>Users</mat-header-cell><mat-cell *matCellDef="let row">{{ row.userCount }}</mat-cell></ng-container>
          <ng-container matColumnDef="createdAt"><mat-header-cell *matHeaderCellDef>Created</mat-header-cell><mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</mat-cell></ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/users/roles', row.id]" matTooltip="View"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button [routerLink]="['/users/roles', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } }`]
})
export class RolesListComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Role>();
  displayedColumns = ['name', 'description', 'userCount', 'createdAt', 'actions'];

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.userService.getRoles().subscribe(r => { this.dataSource.data = r; }); }

  delete(role: Role): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Role', message: `Delete "${role.name}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.userService.deleteRole(role.id).subscribe(() => { this.snackBar.open('Role deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
