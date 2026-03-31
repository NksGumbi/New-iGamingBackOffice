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
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperatorService } from '../../../../core/services/operator.service';
import { OperatorGroup } from '../../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-operator-groups-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, DatePipe, PageHeaderComponent, StatusBadgeComponent, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Operator Groups" subtitle="Manage operator group configurations" actionLabel="New Group" (actionClick)="router.navigate(['/operators/groups/new'])"></app-page-header>

      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search groups...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or description">
          </mat-form-field>
        </div>

        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <a [routerLink]="['/operators/groups', row.id]" class="link-cell">{{ row.name }}</a>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="description">
            <mat-header-cell *matHeaderCellDef>Description</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.description }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="operatorCount">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Operators</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.operatorCount }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Created</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/operators/groups', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button (click)="toggleStatus(row)" [matTooltip]="row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
                <mat-icon>{{ row.status === 'ACTIVE' ? 'toggle_on' : 'toggle_off' }}</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
          <tr class="mat-row" *matNoDataRow><td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No groups found</td></tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } }
    .no-data { padding: 24px; text-align: center; color: #90a4ae; }
    mat-table { border-radius: 0; }
  `]
})
export class OperatorGroupsListComponent implements OnInit, AfterViewInit {
  private operatorService = inject(OperatorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<OperatorGroup>();
  displayedColumns = ['name', 'description', 'operatorCount', 'status', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadGroups();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGroups(): void {
    this.operatorService.getGroups().subscribe(groups => {
      this.dataSource.data = groups;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleStatus(group: OperatorGroup): void {
    const newStatus = group.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.operatorService.updateGroup(group.id, { status: newStatus }).subscribe(() => {
      this.snackBar.open(`Group ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
      this.loadGroups();
    });
  }

  delete(group: OperatorGroup): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Group', message: `Are you sure you want to delete "${group.name}"?`, confirmText: 'Delete' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.operatorService.deleteGroup(group.id).subscribe(() => {
          this.snackBar.open('Group deleted', 'Close', { duration: 3000 });
          this.loadGroups();
        });
      }
    });
  }
}
