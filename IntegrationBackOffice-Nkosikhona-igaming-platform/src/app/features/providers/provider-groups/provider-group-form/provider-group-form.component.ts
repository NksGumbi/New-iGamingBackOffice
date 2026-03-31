import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderService } from '../../../../core/services/provider.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-provider-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Provider Group' : 'New Provider Group'"></app-page-header>
      <mat-card class="app-card" style="max-width:600px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Group Name</mat-label>
                <input matInput formControlName="name">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>Name is required</mat-error> }
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="GAME_PROVIDER">Game Provider</mat-option>
                  <mat-option value="PAYMENT_PROVIDER">Payment Provider</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="action-buttons">
              <button mat-stroked-button type="button" routerLink="/providers/groups">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProviderGroupFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private providerService = inject(ProviderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({ name: ['', Validators.required], description: [''], type: ['GAME_PROVIDER', Validators.required], status: ['ACTIVE', Validators.required] });
  isEdit = false;
  groupId: string | null = null;

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.groupId;
    if (this.isEdit && this.groupId) { this.providerService.getGroup(this.groupId).subscribe(g => { if (g) this.form.patchValue(g); }); }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.groupId
      ? this.providerService.updateGroup(this.groupId, this.form.value)
      : this.providerService.createGroup(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'Group updated' : 'Group created', 'Close', { duration: 3000 }); this.router.navigate(['/providers/groups']); });
  }
}
