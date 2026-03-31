import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../../core/services/payment.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-payment-provider-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Payment Provider' : 'New Payment Provider'"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>Provider Name</mat-label><input matInput formControlName="name"></mat-form-field>
              <mat-form-field appearance="outline" style="max-width:140px"><mat-label>Code</mat-label><input matInput formControlName="code"></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>API Endpoint</mat-label><input matInput formControlName="apiEndpoint"></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>Processing Fee (%)</mat-label><input matInput type="number" formControlName="processingFee" min="0"></mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Settlement Time</mat-label><input matInput formControlName="settlementTime" placeholder="T+2"></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width"><mat-label>Min Transaction</mat-label><input matInput type="number" formControlName="minTransactionLimit" min="0"></mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Max Transaction</mat-label><input matInput type="number" formControlName="maxTransactionLimit" min="0"></mat-form-field>
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
              <button mat-stroked-button type="button" routerLink="/payments/providers">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class PaymentProviderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required], code: ['', Validators.required],
    apiEndpoint: [''], processingFee: [1.5], settlementTime: ['T+2'],
    minTransactionLimit: [1], maxTransactionLimit: [50000],
    supportedCurrencies: [[]], supportedCountries: [[]], status: ['ACTIVE']
  });

  isEdit = false;
  providerId: string | null = null;

  ngOnInit(): void {
    this.providerId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.providerId;
    if (this.isEdit && this.providerId) { this.paymentService.getProvider(this.providerId).subscribe(p => { if (p) this.form.patchValue(p); }); }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.providerId
      ? this.paymentService.updateProvider(this.providerId, this.form.value)
      : this.paymentService.createProvider(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'Provider updated' : 'Provider created', 'Close', { duration: 3000 }); this.router.navigate(['/payments/providers']); });
  }
}
