import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLog } from '../../../core/models/audit-log.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-audit-logs-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Audit Logs" subtitle="Complete audit trail of all platform actions"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:250px">
            <mat-label>Search logs...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:140px">
            <mat-label>Action</mat-label>
            <mat-select [(value)]="actionFilter" (selectionChange)="applyFilters()">
              <mat-option value="">All</mat-option>
              @for (a of actions; track a) { <mat-option [value]="a">{{ a }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:160px">
            <mat-label>Module</mat-label>
            <mat-select [(value)]="moduleFilter" (selectionChange)="applyFilters()">
              <mat-option value="">All</mat-option>
              @for (m of modules; track m) { <mat-option [value]="m">{{ m }}</mat-option> }
            </mat-select>
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="timestamp"><mat-header-cell *matHeaderCellDef mat-sort-header>Timestamp</mat-header-cell><mat-cell *matCellDef="let row">{{ row.timestamp | date:'short' }}</mat-cell></ng-container>
          <ng-container matColumnDef="userName"><mat-header-cell *matHeaderCellDef mat-sort-header>User</mat-header-cell><mat-cell *matCellDef="let row">{{ row.userName }}</mat-cell></ng-container>
          <ng-container matColumnDef="action">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Action</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span [class]="'action-badge action-' + row.action.toLowerCase()">{{ row.action }}</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="module"><mat-header-cell *matHeaderCellDef mat-sort-header>Module</mat-header-cell><mat-cell *matCellDef="let row">{{ row.module }}</mat-cell></ng-container>
          <ng-container matColumnDef="description"><mat-header-cell *matHeaderCellDef>Description</mat-header-cell><mat-cell *matCellDef="let row">{{ row.description }}</mat-cell></ng-container>
          <ng-container matColumnDef="ipAddress"><mat-header-cell *matHeaderCellDef>IP Address</mat-header-cell><mat-cell *matCellDef="let row"><code style="font-size:12px">{{ row.ipAddress }}</code></mat-cell></ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .action-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
    .action-create { background: #e8f5e9; color: #2e7d32; }
    .action-update { background: #e3f2fd; color: #1565c0; }
    .action-delete { background: #ffebee; color: #c62828; }
    .action-login, .action-logout { background: #f3e5f5; color: #6a1b9a; }
    .action-view { background: #f5f5f5; color: #546e7a; }
    .action-export { background: #e8f5e9; color: #00695c; }
    .action-revoke { background: #fff3e0; color: #e65100; }
  `]
})
export class AuditLogsListComponent implements OnInit, AfterViewInit {
  private auditLogService = inject(AuditLogService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<AuditLog>();
  displayedColumns = ['timestamp', 'userName', 'action', 'module', 'description', 'ipAddress'];
  actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'REVOKE'];
  modules = ['Operators', 'Providers', 'Games', 'Payments', 'Users', 'Integrations', 'Settings', 'Auth'];
  actionFilter = '';
  moduleFilter = '';

  ngOnInit(): void { this.auditLogService.getLogs().subscribe(logs => { this.dataSource.data = logs; }); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  applyFilters(): void {
    this.dataSource.filterPredicate = (d, _) => (!this.actionFilter || d.action === this.actionFilter) && (!this.moduleFilter || d.module === this.moduleFilter);
    this.dataSource.filter = Date.now().toString();
    if (!this.actionFilter && !this.moduleFilter) { this.dataSource.filterPredicate = (d, f) => JSON.stringify(d).toLowerCase().includes(f); this.dataSource.filter = ''; }
  }
}
