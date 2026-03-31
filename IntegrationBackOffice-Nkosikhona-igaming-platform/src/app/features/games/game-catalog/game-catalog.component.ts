import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameService } from '../../../core/services/game.service';
import { Game } from '../../../core/models/game.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-game-catalog',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatTooltipModule, CurrencyPipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Game Catalog" subtitle="Manage all integrated games" actionLabel="Add Game" (actionClick)="router.navigate(['/games/catalog/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:280px">
            <mat-label>Search games...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:160px">
            <mat-label>Category</mat-label>
            <mat-select [(value)]="categoryFilter" (selectionChange)="applyCategoryFilter()">
              <mat-option value="">All</mat-option>
              @for (cat of categories; track cat) { <mat-option [value]="cat">{{ cat }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:140px">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="statusFilter" (selectionChange)="applyStatusFilter()">
              <mat-option value="">All</mat-option>
              <mat-option value="ACTIVE">Active</mat-option>
              <mat-option value="INACTIVE">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Game Name</mat-header-cell>
            <mat-cell *matCellDef="let row"><a [routerLink]="['/games/catalog', row.id]" class="link-cell">{{ row.name }}</a></mat-cell>
          </ng-container>
          <ng-container matColumnDef="providerName">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Provider</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.providerName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Category</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.category.replace('_', ' ') }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="rtp">
            <mat-header-cell *matHeaderCellDef mat-sort-header>RTP %</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.rtp }}%</mat-cell>
          </ng-container>
          <ng-container matColumnDef="minBet">
            <mat-header-cell *matHeaderCellDef>Min Bet</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.minBet | currency }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="maxBet">
            <mat-header-cell *matHeaderCellDef>Max Bet</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.maxBet | currency }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/games/catalog', row.id]" matTooltip="View"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button [routerLink]="['/games/catalog', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } }`]
})
export class GameCatalogComponent implements OnInit, AfterViewInit {
  private gameService = inject(GameService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Game>();
  displayedColumns = ['name', 'providerName', 'category', 'rtp', 'minBet', 'maxBet', 'status', 'actions'];
  categories = ['SLOTS', 'LIVE_CASINO', 'TABLE_GAMES', 'SPORTS', 'POKER', 'CRASH'];
  categoryFilter = '';
  statusFilter = '';

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.gameService.getGames().subscribe(g => { this.dataSource.data = g; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  applyCategoryFilter(): void { this.dataSource.filterPredicate = (d, _) => (!this.categoryFilter || d.category === this.categoryFilter) && (!this.statusFilter || d.status === this.statusFilter); this.dataSource.filter = Date.now().toString(); }
  applyStatusFilter(): void { this.applyCategoryFilter(); }

  delete(game: Game): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Game', message: `Delete "${game.name}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.gameService.deleteGame(game.id).subscribe(() => { this.snackBar.open('Game deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
