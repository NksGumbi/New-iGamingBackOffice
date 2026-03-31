import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';
import { Permission } from '../../../../core/models/user.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

const MODULES = ['Dashboard', 'Operators', 'Providers', 'Games', 'Payments', 'Users', 'Integrations', 'Audit Logs', 'Settings'];

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatTableModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Role' : 'New Role'"></app-page-header>
      <mat-card class="app-card" style="max-width:900px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>Role Name</mat-label><input matInput formControlName="name">@if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>Required</mat-error> }</mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><input matInput formControlName="description"></mat-form-field>
            </div>
            <h3 style="margin:16px 0 8px">Permissions</h3>
            <mat-table [dataSource]="permissionsArray.controls">
              <ng-container matColumnDef="module"><mat-header-cell *matHeaderCellDef>Module</mat-header-cell><mat-cell *matCellDef="let ctrl"><strong>{{ ctrl.get('module')?.value }}</strong></mat-cell></ng-container>
              <ng-container matColumnDef="view"><mat-header-cell *matHeaderCellDef>View</mat-header-cell><mat-cell *matCellDef="let ctrl"><mat-checkbox [formControl]="$any(ctrl.get('view'))"></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="create"><mat-header-cell *matHeaderCellDef>Create</mat-header-cell><mat-cell *matCellDef="let ctrl"><mat-checkbox [formControl]="$any(ctrl.get('create'))"></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="edit"><mat-header-cell *matHeaderCellDef>Edit</mat-header-cell><mat-cell *matCellDef="let ctrl"><mat-checkbox [formControl]="$any(ctrl.get('edit'))"></mat-checkbox></mat-cell></ng-container>
              <ng-container matColumnDef="delete"><mat-header-cell *matHeaderCellDef>Delete</mat-header-cell><mat-cell *matCellDef="let ctrl"><mat-checkbox [formControl]="$any(ctrl.get('delete'))"></mat-checkbox></mat-cell></ng-container>
              <mat-header-row *matHeaderRowDef="['module','view','create','edit','delete']"></mat-header-row>
              <mat-row *matRowDef="let row; columns: ['module','view','create','edit','delete']"></mat-row>
            </mat-table>
            <div class="action-buttons" style="margin-top:16px">
              <button mat-stroked-button type="button" routerLink="/users/roles">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Create' }} Role</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    permissions: this.fb.array(MODULES.map(m => this.fb.group({ module: [m], view: [false], create: [false], edit: [false], delete: [false] })))
  });

  get permissionsArray(): FormArray { return this.form.get('permissions') as FormArray; }

  isEdit = false;
  roleId: string | null = null;

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.roleId;
    if (this.isEdit && this.roleId) {
      this.userService.getRole(this.roleId).subscribe(role => {
        if (role) {
          this.form.patchValue({ name: role.name, description: role.description });
          role.permissions.forEach((p, i) => { this.permissionsArray.at(i).patchValue(p); });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.roleId
      ? this.userService.updateRole(this.roleId, this.form.value)
      : this.userService.createRole(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'Role updated' : 'Role created', 'Close', { duration: 3000 }); this.router.navigate(['/users/roles']); });
  }
}
