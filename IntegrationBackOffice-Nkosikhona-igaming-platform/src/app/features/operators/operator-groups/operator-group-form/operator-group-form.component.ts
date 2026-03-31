import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OperatorService } from '../../../../core/services/operator.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-operator-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Operator Group' : 'New Operator Group'" [subtitle]="isEdit ? 'Update group details' : 'Create a new operator group'"></app-page-header>
      <mat-card class="app-card" style="max-width:600px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Group Name</mat-label>
                <input matInput formControlName="name" placeholder="e.g., European Operations">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Brief description of this group"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="action-buttons">
              <button mat-stroked-button type="button" routerLink="/operators/groups">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                {{ isEdit ? 'Update' : 'Create' }} Group
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class OperatorGroupFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private operatorService = inject(OperatorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    status: ['ACTIVE', Validators.required]
  });

  isEdit = false;
  groupId: string | null = null;

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.groupId;
    if (this.isEdit && this.groupId) {
      this.operatorService.getGroup(this.groupId).subscribe(group => {
        if (group) this.form.patchValue(group);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.groupId) {
      this.operatorService.updateGroup(this.groupId, data).subscribe(() => {
        this.snackBar.open('Group updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/operators/groups']);
      });
    } else {
      this.operatorService.createGroup(data).subscribe(() => {
        this.snackBar.open('Group created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/operators/groups']);
      });
    }
  }
}
