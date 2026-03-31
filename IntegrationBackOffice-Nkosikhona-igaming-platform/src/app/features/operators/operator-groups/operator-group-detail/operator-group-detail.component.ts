import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { OperatorService } from '../../../../core/services/operator.service';
import { OperatorGroup, Operator } from '../../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-operator-group-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatDividerModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (group) {
        <app-page-header [title]="group.name" [subtitle]="group.description" actionLabel="Edit Group" actionIcon="edit" (actionClick)="router.navigate(['/operators/groups', group.id, 'edit'])"></app-page-header>
        <div class="detail-grid">
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Group Information</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="detail-row"><span>Status</span><app-status-badge [status]="group.status"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Operators</span><strong>{{ group.operatorCount }}</strong></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Created</span><span>{{ group.createdAt | date:'mediumDate' }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Updated</span><span>{{ group.updatedAt | date:'mediumDate' }}</span></div>
            </mat-card-content>
          </mat-card>

          <mat-card class="app-card">
            <mat-card-header>
              <mat-card-title>Assigned Operators</mat-card-title>
              <div class="header-actions">
                <button mat-stroked-button routerLink="/operators/list/new" color="primary">
                  <mat-icon>add</mat-icon> Add Operator
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <mat-table [dataSource]="operators">
                <ng-container matColumnDef="name">
                  <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
                  <mat-cell *matCellDef="let op"><a [routerLink]="['/operators', op.id]" class="link-cell">{{ op.name }}</a></mat-cell>
                </ng-container>
                <ng-container matColumnDef="code">
                  <mat-header-cell *matHeaderCellDef>Code</mat-header-cell>
                  <mat-cell *matCellDef="let op"><code>{{ op.code }}</code></mat-cell>
                </ng-container>
                <ng-container matColumnDef="jurisdiction">
                  <mat-header-cell *matHeaderCellDef>Jurisdiction</mat-header-cell>
                  <mat-cell *matCellDef="let op">{{ op.jurisdiction }}</mat-cell>
                </ng-container>
                <ng-container matColumnDef="status">
                  <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
                  <mat-cell *matCellDef="let op"><app-status-badge [status]="op.status"></app-status-badge></mat-cell>
                </ng-container>
                <mat-header-row *matHeaderRowDef="['name','code','jurisdiction','status']"></mat-header-row>
                <mat-row *matRowDef="let row; columns: ['name','code','jurisdiction','status']"></mat-row>
              </mat-table>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-grid { display: grid; grid-template-columns: 300px 1fr; gap: 24px; }
    .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .header-actions { margin-left: auto; }
    .link-cell { color: #1a237e; text-decoration: none; &:hover { text-decoration: underline; } }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  `]
})
export class OperatorGroupDetailComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  group: OperatorGroup | undefined;
  operators: Operator[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.operatorService.getGroup(id).subscribe(g => { this.group = g; });
    this.operatorService.getOperatorsByGroup(id).subscribe(ops => { this.operators = ops; });
  }
}
