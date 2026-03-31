import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header title="Branding" subtitle="Customize the platform look and feel"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Platform Name</mat-label>
                <input matInput formControlName="platformName">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Logo URL</mat-label>
                <mat-icon matPrefix>image</mat-icon>
                <input matInput formControlName="logoUrl" placeholder="https://yourcompany.com/logo.png">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Favicon URL</mat-label>
                <input matInput formControlName="faviconUrl">
              </mat-form-field>
            </div>
            <div class="form-row">
              <div class="color-field">
                <label class="color-label">Primary Color</label>
                <div class="color-input-row">
                  <input type="color" formControlName="primaryColor" class="color-picker">
                  <mat-form-field appearance="outline" style="flex:1">
                    <input matInput formControlName="primaryColor" placeholder="#1a237e">
                  </mat-form-field>
                </div>
              </div>
              <div class="color-field">
                <label class="color-label">Accent Color</label>
                <div class="color-input-row">
                  <input type="color" formControlName="accentColor" class="color-picker">
                  <mat-form-field appearance="outline" style="flex:1">
                    <input matInput formControlName="accentColor" placeholder="#00bcd4">
                  </mat-form-field>
                </div>
              </div>
            </div>
            <div class="preview-section">
              <h4>Preview</h4>
              <div class="brand-preview" [style.background]="form.get('primaryColor')?.value">
                <div class="preview-logo">{{ form.get('platformName')?.value }}</div>
                <div class="preview-accent" [style.background]="form.get('accentColor')?.value"></div>
              </div>
            </div>
            <div class="action-buttons" style="margin-top:24px">
              <button mat-flat-button color="primary" type="submit">Save Branding</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .color-field { flex: 1; }
    .color-label { display: block; font-size: 13px; color: #546e7a; margin-bottom: 8px; }
    .color-input-row { display: flex; align-items: center; gap: 8px; }
    .color-picker { width: 48px; height: 48px; border: 1px solid #ddd; border-radius: 4px; padding: 2px; cursor: pointer; }
    .preview-section { margin-top: 16px; h4 { font-size: 14px; color: #546e7a; margin-bottom: 8px; } }
    .brand-preview { border-radius: 8px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
    .preview-logo { color: white; font-size: 16px; font-weight: 700; }
    .preview-accent { width: 32px; height: 32px; border-radius: 50%; }
  `]
})
export class BrandingComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    platformName: ['iGaming Back Office', Validators.required],
    logoUrl: [''],
    faviconUrl: [''],
    primaryColor: ['#1a237e'],
    accentColor: ['#00bcd4']
  });

  save(): void {
    this.snackBar.open('Branding saved successfully (mock)', 'Close', { duration: 3000 });
  }
}
