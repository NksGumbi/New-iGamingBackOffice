import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-platform-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule, MatDividerModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Platform Settings" subtitle="Configure global platform settings"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <h3 class="section-title">General</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Default Currency</mat-label>
                <mat-select formControlName="defaultCurrency">
                  @for (c of currencies; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Timezone</mat-label>
                <mat-select formControlName="timezone">
                  @for (tz of timezones; track tz) { <mat-option [value]="tz">{{ tz }}</mat-option> }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" style="max-width:200px">
                <mat-label>Session Timeout (minutes)</mat-label>
                <input matInput type="number" formControlName="sessionTimeout" min="5" max="480">
              </mat-form-field>
            </div>

            <mat-divider style="margin: 16px 0"></mat-divider>
            <h3 class="section-title">System</h3>

            <div class="toggle-row">
              <div>
                <div class="toggle-label">Maintenance Mode</div>
                <div class="toggle-hint">Enable to put platform in maintenance mode</div>
              </div>
              <mat-slide-toggle formControlName="maintenanceMode" color="warn"></mat-slide-toggle>
            </div>

            <div class="toggle-row">
              <div>
                <div class="toggle-label">Force 2FA for Admins</div>
                <div class="toggle-hint">Require two-factor authentication for admin users</div>
              </div>
              <mat-slide-toggle formControlName="force2fa" color="primary"></mat-slide-toggle>
            </div>

            <div class="toggle-row">
              <div>
                <div class="toggle-label">Audit Logging</div>
                <div class="toggle-hint">Log all user actions to the audit trail</div>
              </div>
              <mat-slide-toggle formControlName="auditLogging" color="primary"></mat-slide-toggle>
            </div>

            <div class="action-buttons" style="margin-top:24px">
              <button mat-flat-button color="primary" type="submit">Save Settings</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .section-title { font-size: 15px; font-weight: 600; color: #1a237e; margin: 8px 0 16px; }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
    .toggle-label { font-size: 14px; font-weight: 500; color: #37474f; }
    .toggle-hint { font-size: 12px; color: #90a4ae; margin-top: 2px; }
  `]
})
export class PlatformSettingsComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    defaultCurrency: ['USD', Validators.required],
    timezone: ['UTC', Validators.required],
    sessionTimeout: [60, [Validators.min(5), Validators.max(480)]],
    maintenanceMode: [false],
    force2fa: [true],
    auditLogging: [true]
  });

  currencies = ['USD', 'EUR', 'GBP', 'BRL', 'MXN', 'PHP', 'JPY', 'SEK', 'CAD', 'AUD'];
  timezones = ['UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+5:30', 'UTC+8', 'UTC+9', 'UTC-5', 'UTC-8'];

  save(): void {
    this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
  }
}
