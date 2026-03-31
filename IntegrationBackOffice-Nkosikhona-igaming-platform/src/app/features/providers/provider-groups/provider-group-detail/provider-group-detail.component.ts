import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { ProviderService } from '../../../../core/services/provider.service';
import { ProviderGroup, Provider } from '../../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-provider-group-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatDividerModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (group) {
        <app-page-header [title]="group.name" actionLabel="Edit" actionIcon="edit" (actionClick)="router.navigate(['/providers/groups', group.id, 'edit'])"></app-page-header>
        <div class="detail-grid">
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Group Info</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="detail-row"><span>Type</span><app-status-badge [status]="group.type === 'GAME_PROVIDER' ? 'GAME' : 'PAYMENT'"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Status</span><app-status-badge [status]="group.status"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Providers</span><strong>{{ group.providerCount }}</strong></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Created</span><span>{{ group.createdAt | date:'mediumDate' }}</span></div>
            </mat-card-content>
          </mat-card>
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Providers in this Group</mat-card-title></mat-card-header>
            <mat-card-content>
              <mat-table [dataSource]="providers">
                <ng-container matColumnDef="name">
                  <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
                  <mat-cell *matCellDef="let p"><a [routerLink]="['/providers', p.id]" class="link-cell">{{ p.name }}</a></mat-cell>
                </ng-container>
                <ng-container matColumnDef="environment">
                  <mat-header-cell *matHeaderCellDef>Environment</mat-header-cell>
                  <mat-cell *matCellDef="let p"><app-status-badge [status]="p.environment"></app-status-badge></mat-cell>
                </ng-container>
                <ng-container matColumnDef="status">
                  <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
                  <mat-cell *matCellDef="let p"><app-status-badge [status]="p.status"></app-status-badge></mat-cell>
                </ng-container>
                <mat-header-row *matHeaderRowDef="['name','environment','status']"></mat-header-row>
                <mat-row *matRowDef="let row; columns: ['name','environment','status']"></mat-row>
              </mat-table>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`.detail-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; } .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; } .link-cell { color: #1a237e; text-decoration: none; &:hover { text-decoration: underline; } }`]
})
export class ProviderGroupDetailComponent implements OnInit {
  private providerService = inject(ProviderService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  group: ProviderGroup | undefined;
  providers: Provider[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.providerService.getGroup(id).subscribe(g => { this.group = g; });
    this.providerService.getProvidersByGroup(id).subscribe(ps => { this.providers = ps; });
  }
}
