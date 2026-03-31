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
import { Webhook } from '../../../core/models/user.model';
import { Operator } from '../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const EVENT_TYPES = ['GAME_ROUND_COMPLETE', 'TRANSACTION_COMPLETE', 'PLAYER_SESSION_START', 'PLAYER_SESSION_END', 'WITHDRAWAL_APPROVED', 'DEPOSIT_COMPLETE'];

@Component({
  selector: 'app-webhooks',
  standalone: true,
  imports: [FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Webhooks" subtitle="Configure webhook endpoints for operator event notifications" actionLabel="Add Webhook" (actionClick)="showForm = !showForm"></app-page-header>

      @if (showForm) {
        <div class="app-card" style="margin-bottom:16px">
          <h3 style="margin-bottom:16px">Configure New Webhook</h3>
          <div class="filter-bar" style="flex-wrap:wrap">
            <mat-form-field appearance="outline" style="min-width:200px">
              <mat-label>Operator</mat-label>
              <mat-select [(ngModel)]="newWebhook.operatorId" (ngModelChange)="onOperatorSelect($event)">
                @for (o of operators; track o.id) { <mat-option [value]="o.id">{{ o.name }}</mat-option> }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="min-width:200px">
              <mat-label>Event Type</mat-label>
              <mat-select [(ngModel)]="newWebhook.eventType">
                @for (e of eventTypes; track e) { <mat-option [value]="e">{{ e }}</mat-option> }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="min-width:300px">
              <mat-label>Webhook URL</mat-label>
              <input matInput [(ngModel)]="newWebhook.url" placeholder="https://your-server.com/webhooks">
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="saveWebhook()" [disabled]="!newWebhook.operatorId || !newWebhook.url || !newWebhook.eventType">Save</button>
            <button mat-stroked-button (click)="showForm = false">Cancel</button>
          </div>
        </div>
      }

      <div class="app-card">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="operatorName"><mat-header-cell *matHeaderCellDef mat-sort-header>Operator</mat-header-cell><mat-cell *matCellDef="let row">{{ row.operatorName }}</mat-cell></ng-container>
          <ng-container matColumnDef="eventType"><mat-header-cell *matHeaderCellDef mat-sort-header>Event</mat-header-cell><mat-cell *matCellDef="let row"><code style="font-size:11px">{{ row.eventType }}</code></mat-cell></ng-container>
          <ng-container matColumnDef="url"><mat-header-cell *matHeaderCellDef>URL</mat-header-cell><mat-cell *matCellDef="let row"><code style="font-size:11px">{{ row.url }}</code></mat-cell></ng-container>
          <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell></ng-container>
          <ng-container matColumnDef="lastTriggered"><mat-header-cell *matHeaderCellDef>Last Triggered</mat-header-cell><mat-cell *matCellDef="let row">{{ row.lastTriggered ? (row.lastTriggered | date:'short') : 'Never' }}</mat-cell></ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="testWebhook(row)" matTooltip="Test webhook"><mat-icon>send</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `
})
export class WebhooksComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private operatorService = inject(OperatorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Webhook>();
  displayedColumns = ['operatorName', 'eventType', 'url', 'status', 'lastTriggered', 'actions'];
  operators: Operator[] = [];
  eventTypes = EVENT_TYPES;
  showForm = false;
  newWebhook: Partial<Webhook> = {};

  ngOnInit(): void { this.load(); this.operatorService.getOperators().subscribe(o => { this.operators = o; }); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.userService.getWebhooks().subscribe(w => { this.dataSource.data = w; }); }

  onOperatorSelect(id: string): void {
    const op = this.operators.find(o => o.id === id);
    if (op) this.newWebhook.operatorName = op.name;
  }

  saveWebhook(): void {
    this.userService.createWebhook({ ...this.newWebhook, status: 'ACTIVE' }).subscribe(() => {
      this.snackBar.open('Webhook configured', 'Close', { duration: 3000 });
      this.showForm = false;
      this.newWebhook = {};
      this.load();
    });
  }

  testWebhook(webhook: Webhook): void {
    this.userService.testWebhook(webhook.id).subscribe(result => {
      this.snackBar.open(result.message, 'Close', { duration: 4000 });
    });
  }

  delete(webhook: Webhook): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Webhook', message: `Delete webhook for "${webhook.eventType}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.userService.deleteWebhook(webhook.id).subscribe(() => { this.snackBar.open('Webhook deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
