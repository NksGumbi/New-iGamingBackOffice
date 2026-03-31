import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethod } from '../../../core/models/payment.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, CurrencyPipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Payment Methods" subtitle="All available payment methods across providers"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:280px">
            <mat-label>Search methods...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name"><mat-header-cell *matHeaderCellDef mat-sort-header>Method</mat-header-cell><mat-cell *matCellDef="let row">{{ row.name }}</mat-cell></ng-container>
          <ng-container matColumnDef="type"><mat-header-cell *matHeaderCellDef mat-sort-header>Type</mat-header-cell><mat-cell *matCellDef="let row">{{ row.type.replace('_', ' ') }}</mat-cell></ng-container>
          <ng-container matColumnDef="providerName"><mat-header-cell *matHeaderCellDef mat-sort-header>Provider</mat-header-cell><mat-cell *matCellDef="let row">{{ row.providerName }}</mat-cell></ng-container>
          <ng-container matColumnDef="minAmount"><mat-header-cell *matHeaderCellDef>Min</mat-header-cell><mat-cell *matCellDef="let row">{{ row.minAmount | currency }}</mat-cell></ng-container>
          <ng-container matColumnDef="maxAmount"><mat-header-cell *matHeaderCellDef>Max</mat-header-cell><mat-cell *matCellDef="let row">{{ row.maxAmount | currency }}</mat-cell></ng-container>
          <ng-container matColumnDef="processingTime"><mat-header-cell *matHeaderCellDef>Processing</mat-header-cell><mat-cell *matCellDef="let row">{{ row.processingTime }}</mat-cell></ng-container>
          <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell></ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `
})
export class PaymentMethodsComponent implements OnInit, AfterViewInit {
  private paymentService = inject(PaymentService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<PaymentMethod>();
  displayedColumns = ['name', 'type', 'providerName', 'minAmount', 'maxAmount', 'processingTime', 'status'];

  ngOnInit(): void { this.paymentService.getMethods().subscribe(m => { this.dataSource.data = m; }); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }
}
