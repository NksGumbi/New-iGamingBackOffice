import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { Game } from '../../../core/models/game.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, DatePipe, CurrencyPipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      @if (game) {
        <app-page-header [title]="game.name" [subtitle]="game.providerName + ' · ' + game.category" actionLabel="Edit Game" actionIcon="edit" (actionClick)="router.navigate(['/games/catalog', game.id, 'edit'])"></app-page-header>
        <div class="detail-grid">
          <mat-card class="app-card">
            <mat-card-header><mat-card-title>Game Configuration</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="detail-row"><span>Status</span><app-status-badge [status]="game.status"></app-status-badge></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Category</span><span>{{ game.category.replace('_', ' ') }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Sub Category</span><span>{{ game.subCategory || 'N/A' }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Game Code</span><code>{{ game.gameCode }}</code></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>RTP</span><strong>{{ game.rtp }}%</strong></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Min Bet</span><span>{{ game.minBet | currency }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Max Bet</span><span>{{ game.maxBet | currency }}</span></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Has Demo</span><mat-icon [style.color]="game.hasDemo ? '#2e7d32' : '#c62828'">{{ game.hasDemo ? 'check_circle' : 'cancel' }}</mat-icon></div>
              <mat-divider></mat-divider>
              <div class="detail-row"><span>Mobile</span><mat-icon [style.color]="game.isMobile ? '#2e7d32' : '#c62828'">{{ game.isMobile ? 'check_circle' : 'cancel' }}</mat-icon></div>
            </mat-card-content>
          </mat-card>
          <div>
            <mat-card class="app-card" style="margin-bottom:16px">
              <mat-card-header><mat-card-title>Supported Currencies</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>@for (c of game.currencies; track c) { <mat-chip>{{ c }}</mat-chip> }</mat-chip-set>
              </mat-card-content>
            </mat-card>
            <mat-card class="app-card">
              <mat-card-header><mat-card-title>Supported Jurisdictions</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-chip-set>@for (j of game.jurisdictions; track j) { <mat-chip>{{ j }}</mat-chip> }</mat-chip-set>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`.detail-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; } .detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; } code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }`]
})
export class GameDetailComponent implements OnInit {
  private gameService = inject(GameService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  game: Game | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.gameService.getGame(id).subscribe(g => { this.game = g; });
  }
}
