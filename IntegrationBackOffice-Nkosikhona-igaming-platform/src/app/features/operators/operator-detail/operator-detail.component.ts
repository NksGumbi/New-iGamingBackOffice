import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { OperatorService } from '../../../core/services/operator.service';
import { Operator } from '../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-operator-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTabsModule, MatButtonModule, MatIconModule, MatDividerModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (operator) {
        <app-page-header [title]="operator.name" [subtitle]="'Code: ' + operator.code" actionLabel="Edit Operator" actionIcon="edit" (actionClick)="router.navigate(['/operators', operator.id, 'edit'])"></app-page-header>
        <mat-card class="app-card">
          <mat-tab-group>
            <mat-tab label="Info">
              <div class="tab-content">
                <div class="info-grid">
                  <div class="info-item"><label>Status</label><app-status-badge [status]="operator.status"></app-status-badge></div>
                  <div class="info-item"><label>Group</label><a [routerLink]="['/operators/groups', operator.groupId]" class="link">{{ operator.groupName }}</a></div>
                  <div class="info-item"><label>Email</label><span>{{ operator.email }}</span></div>
                  <div class="info-item"><label>Website</label><a [href]="'https://' + operator.website" target="_blank" class="link">{{ operator.website }}</a></div>
                  <div class="info-item"><label>Jurisdiction</label><span>{{ operator.jurisdiction }}</span></div>
                  <div class="info-item"><label>Currency</label><span>{{ operator.currency }}</span></div>
                  <div class="info-item"><label>Created</label><span>{{ operator.createdAt | date:'medium' }}</span></div>
                  <div class="info-item"><label>Last Activity</label><span>{{ operator.lastActivity ? (operator.lastActivity | date:'medium') : 'Never' }}</span></div>
                </div>
              </div>
            </mat-tab>
            <mat-tab label="Games">
              <div class="tab-content"><p class="placeholder">Game assignments for this operator. <a routerLink="/games/assignments" class="link">View Game Assignments</a></p></div>
            </mat-tab>
            <mat-tab label="Payments">
              <div class="tab-content"><p class="placeholder">Payment methods for this operator. <a routerLink="/payments/providers" class="link">View Payment Providers</a></p></div>
            </mat-tab>
            <mat-tab label="API Keys">
              <div class="tab-content"><p class="placeholder">API keys for this operator. <a routerLink="/integrations/api-keys" class="link">Manage API Keys</a></p></div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0; }
    .info-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; label { font-size: 13px; color: #78909c; font-weight: 500; } span, a { font-size: 14px; color: #37474f; } }
    .link { color: #1a237e; text-decoration: none; &:hover { text-decoration: underline; } }
    .placeholder { color: #90a4ae; font-size: 14px; }
  `]
})
export class OperatorDetailComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  operator: Operator | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.operatorService.getOperator(id).subscribe(op => { this.operator = op; });
  }
}
