import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentProvider, PaymentMethod } from '../../../../core/models/payment.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-payment-provider-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, MatTableModule, CurrencyPipe, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (provider) {
        <app-page-header [title]="provider.name" [subtitle]="'Code: ' + provider.code" actionLabel="Edit" actionIcon="edit" (actionClick)="router.navigate(['/payments/providers', provider.id, 'edit'])"></app-page-header>
        <div class="detail-grid">
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Provider Details</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="detail-row"><span>Status</span><app-status-badge [status]="provider.status"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Processing Fee</span><strong>{{ provider.processingFee }}%</strong></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Settlement Time</span><span>{{ provider.settlementTime }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Min Transaction</span><span>{{ provider.minTransactionLimit | currency }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Max Transaction</span><span>{{ provider.maxTransactionLimit | currency }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>API Endpoint</span><code>{{ provider.apiEndpoint }}</code></div>
            </mat-card-content>
          </mat-card>
          <div>
            <mat-card class="app-card" style="margin-bottom:16px">
              <mat-card-header><mat-card-title>Currencies</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>@for (c of provider.supportedCurrencies; track c) { <mat-chip>{{ c }}</mat-chip> }</mat-chip-set>
              </mat-card-content>
            </mat-card>
            <mat-card class="app-card" style="margin-bottom:16px">
              <mat-card-header><mat-card-title>Countries</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>@for (c of provider.supportedCountries; track c) { <mat-chip>{{ c }}</mat-chip> }</mat-chip-set>
              </mat-card-content>
            </mat-card>
            <mat-card class="app-card">
              <mat-card-header><mat-card-title>Payment Methods</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-table [dataSource]="methods">
                  <ng-container matColumnDef="name"><mat-header-cell *matHeaderCellDef>Method</mat-header-cell><mat-cell *matCellDef="let m">{{ m.name }}</mat-cell></ng-container>
                  <ng-container matColumnDef="type"><mat-header-cell *matHeaderCellDef>Type</mat-header-cell><mat-cell *matCellDef="let m">{{ m.type }}</mat-cell></ng-container>
                  <ng-container matColumnDef="status"><mat-header-cell *matHeaderCellDef>Status</mat-header-cell><mat-cell *matCellDef="let m"><app-status-badge [status]="m.status"></app-status-badge></mat-cell></ng-container>
                  <mat-header-row *matHeaderRowDef="['name','type','status']"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: ['name','type','status']"></mat-row>
                </mat-table>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`.detail-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; } .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; } code { font-size: 12px; color: #546e7a; }`]
})
export class PaymentProviderDetailComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider: PaymentProvider | undefined;
  methods: PaymentMethod[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.paymentService.getProvider(id).subscribe(p => { this.provider = p; });
    this.paymentService.getMethodsByProvider(id).subscribe(m => { this.methods = m; });
  }
}
