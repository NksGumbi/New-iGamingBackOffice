import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderService } from '../../../core/services/provider.service';
import { ProviderGroup } from '../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Provider' : 'New Provider'"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Provider Name</mat-label>
                <input matInput formControlName="name">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>Required</mat-error> }
              </mat-form-field>
              <mat-form-field appearance="outline" style="max-width:140px">
                <mat-label>Code</mat-label>
                <input matInput formControlName="code">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Provider Group</mat-label>
                <mat-select formControlName="groupId" (selectionChange)="onGroupChange($event.value)">
                  @for (g of groups; track g.id) { <mat-option [value]="g.id">{{ g.name }}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="GAME_PROVIDER">Game Provider</mat-option>
                  <mat-option value="PAYMENT_PROVIDER">Payment Provider</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>API Endpoint</mat-label>
                <input matInput formControlName="apiEndpoint" placeholder="https://api.provider.com/v1">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Secret Key</mat-label>
                <input matInput formControlName="secretKey" type="password">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Webhook URL</mat-label>
                <input matInput formControlName="webhookUrl">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Environment</mat-label>
                <mat-select formControlName="environment">
                  <mat-option value="STAGING">Staging</mat-option>
                  <mat-option value="PRODUCTION">Production</mat-option>
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
            <div class="action-buttons">
              <button mat-stroked-button type="button" routerLink="/providers/list">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProviderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private providerService = inject(ProviderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required], code: ['', Validators.required],
    groupId: ['', Validators.required], groupName: [''],
    type: ['GAME_PROVIDER', Validators.required], environment: ['STAGING', Validators.required],
    apiEndpoint: [''], secretKey: [''], webhookUrl: [''],
    supportedCurrencies: [[]], supportedJurisdictions: [[]], status: ['ACTIVE']
  });

  isEdit = false;
  providerId: string | null = null;
  groups: ProviderGroup[] = [];

  ngOnInit(): void {
    this.providerService.getGroups().subscribe(g => { this.groups = g; });
    this.providerId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.providerId;
    if (this.isEdit && this.providerId) { this.providerService.getProvider(this.providerId).subscribe(p => { if (p) this.form.patchValue(p); }); }
  }

  onGroupChange(groupId: string): void {
    const group = this.groups.find(g => g.id === groupId);
    if (group) this.form.patchValue({ groupName: group.name, type: group.type });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.providerId
      ? this.providerService.updateProvider(this.providerId, this.form.value)
      : this.providerService.createProvider(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'Provider updated' : 'Provider created', 'Close', { duration: 3000 }); this.router.navigate(['/providers/list']); });
  }
}
