import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperatorService } from '../../../core/services/operator.service';
import { Operator } from '../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-operators-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatTooltipModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Operators" subtitle="Manage all platform operators" actionLabel="New Operator" (actionClick)="router.navigate(['/operators/list/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search operators...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by name, code, jurisdiction">
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:160px">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="statusFilter" (selectionChange)="applyStatusFilter()">
              <mat-option value="">All</mat-option>
              <mat-option value="ACTIVE">Active</mat-option>
              <mat-option value="INACTIVE">Inactive</mat-option>
              <mat-option value="PENDING">Pending</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let row"><a [routerLink]="['/operators', row.id]" class="link-cell">{{ row.name }}</a></mat-cell>
          </ng-container>
          <ng-container matColumnDef="code">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Code</mat-header-cell>
            <mat-cell *matCellDef="let row"><code>{{ row.code }}</code></mat-cell>
          </ng-container>
          <ng-container matColumnDef="groupName">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Group</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.groupName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="jurisdiction">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Jurisdiction</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.jurisdiction }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="currency">
            <mat-header-cell *matHeaderCellDef>Currency</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.currency }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/operators', row.id]" matTooltip="View"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button [routerLink]="['/operators', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
          <tr class="mat-row" *matNoDataRow><td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No operators found</td></tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } }
    .no-data { padding: 24px; text-align: center; color: #90a4ae; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  `]
})
export class OperatorsListComponent implements OnInit, AfterViewInit {
  private operatorService = inject(OperatorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Operator>();
  displayedColumns = ['name', 'code', 'groupName', 'jurisdiction', 'currency', 'status', 'actions'];
  statusFilter = '';

  ngOnInit(): void { this.loadOperators(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOperators(): void {
    this.operatorService.getOperators().subscribe(ops => { this.dataSource.data = ops; });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  applyStatusFilter(): void {
    this.dataSource.filterPredicate = (data, filter) => !this.statusFilter || data.status === this.statusFilter;
    this.dataSource.filter = this.statusFilter || ' ';
    if (!this.statusFilter) { this.dataSource.filter = ''; this.dataSource.filterPredicate = (data, f) => JSON.stringify(data).toLowerCase().includes(f); }
  }

  delete(operator: Operator): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Operator', message: `Delete "${operator.name}"?`, confirmText: 'Delete' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.operatorService.deleteOperator(operator.id).subscribe(() => {
          this.snackBar.open('Operator deleted', 'Close', { duration: 3000 });
          this.loadOperators();
        });
      }
    });
  }
}
