import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
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
import { GameService } from '../../../core/services/game.service';
import { OperatorService } from '../../../core/services/operator.service';
import { GameAssignment } from '../../../core/models/game.model';
import { Operator } from '../../../core/models/operator.model';
import { Game } from '../../../core/models/game.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-game-assignments',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, DatePipe, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Game Assignments" subtitle="Manage which games are available to each operator" actionLabel="Assign Game" (actionClick)="showAssignForm = !showAssignForm"></app-page-header>

      @if (showAssignForm) {
        <div class="app-card" style="margin-bottom:16px">
          <h3 style="margin-bottom:16px">Quick Assign Game to Operator</h3>
          <div class="filter-bar">
            <mat-form-field appearance="outline" style="min-width:220px">
              <mat-label>Select Game</mat-label>
              <mat-select [(value)]="selectedGameId">
                @for (g of games; track g.id) { <mat-option [value]="g.id">{{ g.name }}</mat-option> }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="min-width:220px">
              <mat-label>Select Operator</mat-label>
              <mat-select [(value)]="selectedOperatorId">
                @for (o of operators; track o.id) { <mat-option [value]="o.id">{{ o.name }}</mat-option> }
              </mat-select>
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="assignGame()" [disabled]="!selectedGameId || !selectedOperatorId">Assign</button>
            <button mat-stroked-button (click)="showAssignForm = false">Cancel</button>
          </div>
        </div>
      }

      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:280px">
            <mat-label>Search assignments...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="gameName">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Game</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.gameName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="operatorName">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Operator</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.operatorName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="minBetOverride">
            <mat-header-cell *matHeaderCellDef>Min Bet Override</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.minBetOverride ?? 'Default' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="maxBetOverride">
            <mat-header-cell *matHeaderCellDef>Max Bet Override</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.maxBetOverride ?? 'Default' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="assignedAt">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Assigned</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.assignedAt | date:'mediumDate' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button color="warn" (click)="removeAssignment(row)" matTooltip="Remove"><mat-icon>remove_circle</mat-icon></button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `
})
export class GameAssignmentsComponent implements OnInit, AfterViewInit {
  private gameService = inject(GameService);
  private operatorService = inject(OperatorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<GameAssignment>();
  displayedColumns = ['gameName', 'operatorName', 'minBetOverride', 'maxBetOverride', 'status', 'assignedAt', 'actions'];
  games: Game[] = [];
  operators: Operator[] = [];
  showAssignForm = false;
  selectedGameId = '';
  selectedOperatorId = '';

  ngOnInit(): void {
    this.load();
    this.gameService.getGames().subscribe(g => { this.games = g; });
    this.operatorService.getOperators().subscribe(o => { this.operators = o; });
  }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.gameService.getAssignments().subscribe(a => { this.dataSource.data = a; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  assignGame(): void {
    const game = this.games.find(g => g.id === this.selectedGameId);
    const operator = this.operators.find(o => o.id === this.selectedOperatorId);
    if (!game || !operator) return;
    this.gameService.createAssignment({ gameId: game.id, gameName: game.name, operatorId: operator.id, operatorName: operator.name, status: 'ACTIVE' }).subscribe(() => {
      this.snackBar.open('Game assigned successfully', 'Close', { duration: 3000 });
      this.showAssignForm = false;
      this.load();
    });
  }

  removeAssignment(assignment: GameAssignment): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Remove Assignment', message: `Remove "${assignment.gameName}" from "${assignment.operatorName}"?`, confirmText: 'Remove' } });
    ref.afterClosed().subscribe(c => { if (c) { this.gameService.deleteAssignment(assignment.id).subscribe(() => { this.snackBar.open('Assignment removed', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
