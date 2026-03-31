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
import { ProviderService } from '../../../../core/services/provider.service';
import { ProviderGroup } from '../../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-provider-groups-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Provider Groups" subtitle="Manage game and payment provider groups" actionLabel="New Group" (actionClick)="router.navigate(['/providers/groups/new'])"></app-page-header>
      <div class="app-card">
        <div class="filter-bar">
          <mat-form-field appearance="outline" style="min-width:300px">
            <mat-label>Search groups...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)">
          </mat-form-field>
        </div>
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
            <mat-cell *matCellDef="let row"><a [routerLink]="['/providers/groups', row.id]" class="link-cell">{{ row.name }}</a></mat-cell>
          </ng-container>
          <ng-container matColumnDef="type">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Type</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.type === 'GAME_PROVIDER' ? 'GAME' : 'PAYMENT'"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="providerCount">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Providers</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.providerCount }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row"><app-status-badge [status]="row.status"></app-status-badge></mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="['/providers/groups', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
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
export class ProviderGroupsListComponent implements OnInit, AfterViewInit {
  private providerService = inject(ProviderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<ProviderGroup>();
  displayedColumns = ['name', 'type', 'providerCount', 'status', 'actions'];

  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  load(): void { this.providerService.getGroups().subscribe(g => { this.dataSource.data = g; }); }
  applyFilter(event: Event): void { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  delete(group: ProviderGroup): void {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Provider Group', message: `Delete "${group.name}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe(c => { if (c) { this.providerService.deleteGroup(group.id).subscribe(() => { this.snackBar.open('Group deleted', 'Close', { duration: 3000 }); this.load(); }); } });
  }
}
