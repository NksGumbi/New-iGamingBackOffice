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
import { CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentProvider } from '../../../../core/models/payment.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-payment-providers-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, CurrencyPipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Payment Providers" subtitle="Manage payment gateway integrations" actionLabel="New Provider" (actionClick)="router.navigate(['/payments/providers/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Provider</mat-header-cell>
            <mat-cell *matCellDef="let row"><a [routerLink]="['/payments/providers', row.id]" class="link-cell">{{ row.name }}</a></mat-cell>
          </ng-container>
          <ng-container matColumnDef="code">
            <mat-header-cell *matHeaderCellDef>Code</mat-header-cell>
            <mat-cell *matCellDef="let row"><code>{{ row.code }}</code></mat-cell>
          </ng-container>
          <ng-container matColumnDef="processingFee">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Fee %</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.processingFee }}%</mat-cell>
          </ng-container>
          <ng-container matColumnDef="settlementTime">
            <mat-header-cell *matHeaderCellDef>Settlement</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.settlementTime }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="minTransactionLimit">
            <mat-header-cell *matHeaderCellDef>Min</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.minTransactionLimit | currency }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="maxTransactionLimit">
            <mat-header-cell *matHeaderCellDef>Max</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.maxTransactionLimit | currency }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/payments/providers', row.id]" matTooltip="View"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button [routerLink]="['/payments/providers', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
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
  styles: [`.link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } } code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }`]
})
export class PaymentProvidersListComponent implements OnInit, AfterViewInit {
  private paymentService = inject(PaymentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<PaymentProvider>();
  displayedColumns = ['name', 'code', 'processingFee', 'settlementTime', 'minTransactionLimit', 'maxTransactionLimit', 'status', 'actions'];

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.paymentService.getProviders().subscribe(ps => { this.dataSource.data = ps; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  delete(provider: PaymentProvider): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Payment Provider', message: `Delete "${provider.name}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.paymentService.deleteProvider(provider.id).subscribe(() => { this.snackBar.open('Provider deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
