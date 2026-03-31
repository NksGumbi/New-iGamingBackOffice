import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { Role } from '../../../core/models/user.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit User' : 'New User'"></app-page-header>
      <mat-card class="app-card" style="max-width:600px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>First Name</mat-label><input matInput formControlName="firstName">@if (form.get('firstName')?.hasError('required') && form.get('firstName')?.touched) { <mat-error>Required</mat-error> }</mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Last Name</mat-label><input matInput formControlName="lastName">@if (form.get('lastName')?.hasError('required') && form.get('lastName')?.touched) { <mat-error>Required</mat-error> }</mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
                @if (form.get('email')?.hasError('email') && form.get('email')?.touched) { <mat-error>Valid email required</mat-error> }
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Role</mat-label>
                <mat-select formControlName="roleId" (selectionChange)="onRoleChange($event.value)">
                  @for (r of roles; track r.id) { <mat-option [value]="r.id">{{ r.name }}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                  <mat-option value="SUSPENDED">Suspended</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="action-buttons">
              <button mat-stroked-button type="button" routerLink="/users/list">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Create' }} User</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required], lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roleId: ['', Validators.required], roleName: [''], status: ['ACTIVE']
  });

  isEdit = false;
  userId: string | null = null;
  roles: Role[] = [];

  ngOnInit(): void {
    this.userService.getRoles().subscribe(r => { this.roles = r; });
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.userId;
    if (this.isEdit && this.userId) { this.userService.getUser(this.userId).subscribe(u => { if (u) this.form.patchValue(u); }); }
  }

  onRoleChange(roleId: string): void {
    const role = this.roles.find(r => r.id === roleId);
    if (role) this.form.patchValue({ roleName: role.name });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.userId
      ? this.userService.updateUser(this.userId, this.form.value)
      : this.userService.createUser(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'User updated' : 'User created', 'Close', { duration: 3000 }); this.router.navigate(['/users/list']); });
  }
}
