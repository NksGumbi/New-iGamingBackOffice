import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { Role, Permission } from '../../../../core/models/user.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatCheckboxModule, DatePipe, PageHeaderComponent],
  template: `
    <div class="page-container">
      @if (role) {
        <app-page-header [title]="role.name" [subtitle]="role.description" actionLabel="Edit Role" actionIcon="edit" (actionClick)="router.navigate(['/users/roles', role.id, 'edit'])"></app-page-header>
        <mat-card class="app-card">
          <mat-card-header>
            <mat-card-title>Permissions Matrix</mat-card-title>
            <mat-card-subtitle>{{ role.userCount }} user(s) assigned to this role</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-table [dataSource]="role.permissions">
              <ng-container matColumnDef="module"><mat-header-cell *matHeaderCellDef>Module</mat-header-cell><mat-cell *matCellDef="let p"><strong>{{ p.module }}</strong></mat-cell></ng-container>
              <ng-container matColumnDef="view"><mat-header-cell *matHeaderCellDef>View</mat-header-cell><mat-cell *matCellDef="let p"><mat-checkbox [checked]="p.view" disabled></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="create"><mat-header-cell *matHeaderCellDef>Create</mat-header-cell><mat-cell *matCellDef="let p"><mat-checkbox [checked]="p.create" disabled></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="edit"><mat-header-cell *matHeaderCellDef>Edit</mat-header-cell><mat-cell *matCellDef="let p"><mat-checkbox [checked]="p.edit" disabled></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="delete"><mat-header-cell *matHeaderCellDef>Delete</mat-header-cell><mat-cell *matCellDef="let p"><mat-checkbox [checked]="p.delete" disabled></mat-checkbox></mat-cell></ng-container>
              <mat-header-row *matHeaderRowDef="['module','view','create','edit','delete']"></mat-header-row>
              <mat-row *matRowDef="let row; columns: ['module','view','create','edit','delete']"></mat-row>
            </mat-table>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `
})
export class RoleDetailComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  role: Role | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getRole(id).subscribe(r => { this.role = r; });
  }
}
