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
import { OperatorService } from '../../../core/services/operator.service';
import { OperatorGroup } from '../../../core/models/operator.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-operator-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Operator' : 'New Operator'" [subtitle]="isEdit ? 'Update operator details' : 'Register a new operator on the platform'"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Operator Name</mat-label>
                <input matInput formControlName="name" placeholder="e.g., BetKings Europe">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" style="max-width:140px">
                <mat-label>Code</mat-label>
                <input matInput formControlName="code" placeholder="BKE" style="text-transform:uppercase">
                @if (form.get('code')?.hasError('required') && form.get('code')?.touched) {
                  <mat-error>Code is required</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Operator Group</mat-label>
                <mat-select formControlName="groupId" (selectionChange)="onGroupChange($event.value)">
                  @for (group of groups; track group.id) {
                    <mat-option [value]="group.id">{{ group.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                  <mat-option value="PENDING">Pending</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="tech@operator.com">
                @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                  <mat-error>Valid email required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Website</mat-label>
                <input matInput formControlName="website" placeholder="operator.com">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Jurisdiction</mat-label>
                <input matInput formControlName="jurisdiction" placeholder="e.g., Malta, UK, Gibraltar">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Base Currency</mat-label>
                <mat-select formControlName="currency">
                  @for (c of currencies; track c) {
                    <mat-option [value]="c">{{ c }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="action-buttons">
              <button mat-stroked-button type="button" routerLink="/operators/list">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                {{ isEdit ? 'Update' : 'Create' }} Operator
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class OperatorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private operatorService = inject(OperatorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    groupId: ['', Validators.required],
    groupName: [''],
    email: ['', Validators.email],
    website: [''],
    jurisdiction: [''],
    currency: ['USD'],
    status: ['ACTIVE', Validators.required]
  });

  isEdit = false;
  operatorId: string | null = null;
  groups: OperatorGroup[] = [];
  currencies = ['USD', 'EUR', 'GBP', 'BRL', 'MXN', 'PHP', 'JPY', 'SEK', 'CAD', 'AUD'];

  ngOnInit(): void {
    this.operatorService.getGroups().subscribe(g => { this.groups = g; });
    this.operatorId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.operatorId;
    if (this.isEdit && this.operatorId) {
      this.operatorService.getOperator(this.operatorId).subscribe(op => {
        if (op) this.form.patchValue(op);
      });
    }
  }

  onGroupChange(groupId: string): void {
    const group = this.groups.find(g => g.id === groupId);
    if (group) this.form.patchValue({ groupName: group.name });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.operatorId) {
      this.operatorService.updateOperator(this.operatorId, data).subscribe(() => {
        this.snackBar.open('Operator updated', 'Close', { duration: 3000 });
        this.router.navigate(['/operators/list']);
      });
    } else {
      this.operatorService.createOperator(data).subscribe(() => {
        this.snackBar.open('Operator created', 'Close', { duration: 3000 });
        this.router.navigate(['/operators/list']);
      });
    }
  }
}
