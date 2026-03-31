import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (provider) {
        <app-page-header [title]="provider.name" [subtitle]="provider.code" actionLabel="Edit" actionIcon="edit" (actionClick)="router.navigate(['/providers', provider.id, 'edit'])"></app-page-header>
        <div class="detail-grid">
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Provider Details</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="detail-row"><span>Type</span><app-status-badge [status]="provider.type === 'GAME_PROVIDER' ? 'GAME' : 'PAYMENT'"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Status</span><app-status-badge [status]="provider.status"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Environment</span><app-status-badge [status]="provider.environment"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Group</span><a [routerLink]="['/providers/groups', provider.groupId]" class="link">{{ provider.groupName }}</a></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>API Endpoint</span><code class="endpoint">{{ provider.apiEndpoint }}</code></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Secret Key</span><code class="masked">{{ provider.secretKey.substring(0, 10) }}••••••••••••••••</code></div>
              @if (provider.webhookUrl) {
                <mat-divider></mat-divider>
                <div class="detail-row"><span>Webhook URL</span><code class="endpoint">{{ provider.webhookUrl }}</code></div>
              }
            </mat-card-content>
          </mat-card>
          <div>
            <mat-card class="app-card" style="margin-bottom:16px">
              <mat-card-header><mat-card-title>Supported Currencies</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>
                  @for (c of provider.supportedCurrencies; track c) {
                    <mat-chip>{{ c }}</mat-chip>
                  }
                </mat-chip-set>
              </mat-card-content>
            </mat-card>
            <mat-card class="app-card">
              <mat-card-header><mat-card-title>Supported Jurisdictions</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>
                  @for (j of provider.supportedJurisdictions; track j) {
                    <mat-chip>{{ j }}</mat-chip>
                  }
                </mat-chip-set>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`.detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; } .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; flex-wrap: wrap; gap: 8px; } .link { color: #1a237e; text-decoration: none; &:hover { text-decoration: underline; } } code.endpoint { font-size: 12px; color: #546e7a; word-break: break-all; } code.masked { font-size: 12px; color: #546e7a; letter-spacing: 1px; }`]
})
export class ProviderDetailComponent implements OnInit {
  private providerService = inject(ProviderService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider: Provider | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.providerService.getProvider(id).subscribe(p => { this.provider = p; });
  }
}
