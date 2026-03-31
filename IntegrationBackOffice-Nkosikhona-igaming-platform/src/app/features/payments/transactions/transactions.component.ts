import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaymentService } from '../../../core/services/payment.service';
import { Transaction } from '../../../core/models/payment.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, CurrencyPipe, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Transactions" subtitle="Transaction history across all operators and payment providers">
      </app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:250px">
            <mat-label>Search transactions...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:140px">
            <mat-label>Type</mat-label>
            <mat-select [(value)]="typeFilter" (selectionChange)="applyFilters()">
              <mat-option value="">All</mat-option>
              <mat-option value="DEPOSIT">Deposit</mat-option>
              <mat-option value="WITHDRAWAL">Withdrawal</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:140px">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="statusFilter" (selectionChange)="applyFilters()">
              <mat-option value="">All</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
              <mat-option value="PENDING">Pending</mat-option>
              <mat-option value="FAILED">Failed</mat-option>
              <mat-option value="REFUNDED">Refunded</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="exportMock()" matTooltip="Export CSV">
            <mat-icon>download</mat-icon> Export
          </button>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="reference"><mat-header-cell *matHeaderCellDef mat-sort-header>Reference</mat-header-cell><mat-cell *matCellDef="let row"><code style="font-size:11px">{{ row.reference }}</code></mat-cell></ng-container>
          <ng-container matColumnDef="type"><mat-header-cell *matHeaderCellDef mat-sort-header>Type</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.type === 'DEPOSIT' ? 'ACTIVE' : 'PENDING'"></app-status-badge></mat-cell></ng-container>
          <ng-container matColumnDef="amount"><mat-header-cell *matHeaderCellDef mat-sort-header>Amount</mat-header-cell><mat-cell *matCellDef="let row"><strong>{{ row.amount | currency:row.currency }}</strong></mat-cell></ng-container>
          <ng-container matColumnDef="operatorName"><mat-header-cell *matHeaderCellDef mat-sort-header>Operator</mat-header-cell><mat-cell *matCellDef="let row">{{ row.operatorName }}</mat-cell></ng-container>
          <ng-container matColumnDef="providerName"><mat-header-cell *matHeaderCellDef>Provider</mat-header-cell><mat-cell *matCellDef="let row">{{ row.providerName }}</mat-cell></ng-container>
          <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell></ng-container>
          <ng-container matColumnDef="createdAt"><mat-header-cell *matHeaderCellDef mat-sort-header>Date</mat-header-cell><mat-cell *matCellDef="let row">{{ row.createdAt | date:'short' }}</mat-cell></ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  private paymentService = inject(PaymentService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Transaction>();
  displayedColumns = ['reference', 'type', 'amount', 'operatorName', 'providerName', 'status', 'createdAt'];
  typeFilter = '';
  statusFilter = '';
  allTransactions: Transaction[] = [];

  ngOnInit(): void { this.paymentService.getTransactions().subscribe(t => { this.allTransactions = t; this.dataSource.data = t; }); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  applyFilters(): void {
    this.dataSource.filterPredicate = (d, _) => (!this.typeFilter || d.type === this.typeFilter) && (!this.statusFilter || d.status === this.statusFilter);
    this.dataSource.filter = Date.now().toString();
    if (!this.typeFilter && !this.statusFilter) { this.dataSource.filterPredicate = (d, f) => JSON.stringify(d).toLowerCase().includes(f); this.dataSource.filter = ''; }
  }

  exportMock(): void { this.snackBar.open('Transaction export queued (mock) — CSV will be emailed', 'Close', { duration: 3000 }); }
}
