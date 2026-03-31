import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { OperatorService } from '../../../core/services/operator.service';
import { ApiKey } from '../../../core/models/user.model';
import { Operator } from '../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="API Keys" subtitle="Manage API keys for operator integrations" actionLabel="Generate API Key" (actionClick)="showGenForm = !showGenForm"></app-page-header>

      @if (showGenForm) {
        <div class="app-card" style="margin-bottom:16px">
          <h3 style="margin-bottom:16px">Generate New API Key</h3>
          <div class="filter-bar">
            <mat-form-field appearance="outline" style="min-width:220px">
              <mat-label>Operator</mat-label>
              <mat-select [(value)]="selectedOperatorId">
                @for (o of operators; track o.id) { <mat-option [value]="o.id">{{ o.name }}</mat-option> }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="min-width:220px">
              <mat-label>Key Name</mat-label>
              <input matInput [(ngModel)]="keyName" placeholder="e.g., Production Key">
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="generateKey()" [disabled]="!selectedOperatorId || !keyName">Generate</button>
            <button mat-stroked-button (click)="showGenForm = false">Cancel</button>
          </div>
        </div>
      }

      <div class="app-card">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name"><mat-header-cell *matHeaderCellDef mat-sort-header>Key Name</mat-header-cell><mat-cell *matCellDef="let row">{{ row.name }}</mat-cell></ng-container>
          <ng-container matColumnDef="operatorName"><mat-header-cell *matHeaderCellDef mat-sort-header>Operator</mat-header-cell><mat-cell *matCellDef="let row">{{ row.operatorName }}</mat-cell></ng-container>
          <ng-container matColumnDef="key">
            <mat-header-cell *matHeaderCellDef>API Key</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <code class="api-key">{{ row.status === 'REVOKED' ? '••••••••••••••••••••••••' : row.key.substring(0, 20) + '...' }}</code>
              @if (row.status === 'ACTIVE') {
                <button mat-icon-button (click)="copyKey(row.key)" matTooltip="Copy key"><mat-icon>content_copy</mat-icon></button>
              }
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell></ng-container>
          <ng-container matColumnDef="lastUsed"><mat-header-cell *matHeaderCellDef>Last Used</mat-header-cell><mat-cell *matCellDef="let row">{{ row.lastUsed ? (row.lastUsed | date:'short') : 'Never' }}</mat-cell></ng-container>
          <ng-container matColumnDef="expiresAt"><mat-header-cell *matHeaderCellDef>Expires</mat-header-cell><mat-cell *matCellDef="let row">{{ row.expiresAt ? (row.expiresAt | date:'mediumDate') : 'Never' }}</mat-cell></ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              @if (row.status === 'ACTIVE') {
                <button mat-stroked-button color="warn" (click)="revoke(row)" style="font-size:12px;height:28px">Revoke</button>
              }
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.api-key { font-size: 12px; color: #546e7a; letter-spacing: 0.5px; }`]
})
export class ApiKeysComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private operatorService = inject(OperatorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<ApiKey>();
  displayedColumns = ['name', 'operatorName', 'key', 'status', 'lastUsed', 'expiresAt', 'actions'];
  operators: Operator[] = [];
  showGenForm = false;
  selectedOperatorId = '';
  keyName = '';

  ngOnInit(): void {
    this.load();
    this.operatorService.getOperators().subscribe(o => { this.operators = o; });
  }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.userService.getApiKeys().subscribe(k => { this.dataSource.data = k; }); }

  generateKey(): void {
    const op = this.operators.find(o => o.id === this.selectedOperatorId);
    if (!op) return;
    this.userService.generateApiKey(op.id, op.name, this.keyName).subscribe(key => {
      this.snackBar.open(`API key generated: ${key.key.substring(0, 20)}...`, 'Close', { duration: 5000 });
      this.showGenForm = false;
      this.keyName = '';
      this.load();
    });
  }

  copyKey(key: string): void {
    navigator.clipboard.writeText(key).then(() => { this.snackBar.open('API key copied to clipboard', 'Close', { duration: 2000 }); });
  }

  revoke(apiKey: ApiKey): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Revoke API Key', message: `Revoke key "${apiKey.name}"? This cannot be undone.`, confirmText: 'Revoke', type: 'warning' } });
    ref.afterClosed().subscribe(c => { if (c) { this.userService.revokeApiKey(apiKey.id).subscribe(() => { this.snackBar.open('API key revoked', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
