import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-providers-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatChipsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Providers" subtitle="Manage game and payment providers" actionLabel="New Provider" (actionClick)="router.navigate(['/providers/list/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search providers...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let row"><a [routerLink]="['/providers', row.id]" class="link-cell">{{ row.name }}</a></mat-cell>
          </ng-container>
          <ng-container matColumnDef="code">
            <mat-header-cell *matHeaderCellDef>Code</mat-header-cell>
            <mat-cell *matCellDef="let row"><code>{{ row.code }}</code></mat-cell>
          </ng-container>
          <ng-container matColumnDef="type">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Type</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.type === 'GAME_PROVIDER' ? 'GAME' : 'PAYMENT'"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="groupName">
            <mat-header-cell *matHeaderCellDef>Group</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.groupName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="environment">
            <mat-header-cell *matHeaderCellDef>Environment</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.environment"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/providers', row.id]" matTooltip="View"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button [routerLink]="['/providers', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
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
  styles: [`.link-cell { color: #1a237e; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } } code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }`]
})
export class ProvidersListComponent implements OnInit, AfterViewInit {
  private providerService = inject(ProviderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Provider>();
  displayedColumns = ['name', 'code', 'type', 'groupName', 'environment', 'status', 'actions'];

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  load(): void { this.providerService.getProviders().subscribe(ps => { this.dataSource.data = ps; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  delete(provider: Provider): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Provider', message: `Delete "${provider.name}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.providerService.deleteProvider(provider.id).subscribe(() => { this.snackBar.open('Provider deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
