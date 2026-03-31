import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '../../../core/services/game.service';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEdit ? 'Edit Game' : 'Add Game to Catalog'"></app-page-header>
      <mat-card class="app-card" style="max-width:700px">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Game Name</mat-label>
                <input matInput formControlName="name">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>Required</mat-error> }
              </mat-form-field>
              <mat-form-field appearance="outline" style="max-width:160px">
                <mat-label>Game Code</mat-label>
                <input matInput formControlName="gameCode">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Provider</mat-label>
                <mat-select formControlName="providerId" (selectionChange)="onProviderChange($event.value)">
                  @for (p of providers; track p.id) { <mat-option [value]="p.id">{{ p.name }}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  @for (c of categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>RTP (%)</mat-label>
                <input matInput type="number" formControlName="rtp" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Min Bet</mat-label>
                <input matInput type="number" formControlName="minBet" min="0">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Max Bet</mat-label>
                <input matInput type="number" formControlName="maxBet" min="0">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                  <mat-option value="PENDING">Pending</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="checkbox-row">
              <mat-checkbox formControlName="hasDemo">Has Demo Mode</mat-checkbox>
              <mat-checkbox formControlName="isMobile">Mobile Compatible</mat-checkbox>
            </div>
            <div class="action-buttons" style="margin-top:16px">
              <button mat-stroked-button type="button" routerLink="/games/catalog">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Add Game' }}</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.checkbox-row { display: flex; gap: 24px; margin-bottom: 8px; }`]
})
export class GameFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private gameService = inject(GameService);
  private providerService = inject(ProviderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required], gameCode: ['', Validators.required],
    providerId: ['', Validators.required], providerName: [''],
    category: ['SLOTS', Validators.required], subCategory: [''],
    rtp: [96.0, [Validators.min(0), Validators.max(100)]],
    minBet: [0.1], maxBet: [100],
    currencies: [[]], jurisdictions: [[]],
    hasDemo: [true], isMobile: [true], status: ['ACTIVE']
  });

  isEdit = false;
  gameId: string | null = null;
  providers: Provider[] = [];
  categories = ['SLOTS', 'LIVE_CASINO', 'TABLE_GAMES', 'SPORTS', 'POKER', 'CRASH'];

  ngOnInit(): void {
    this.providerService.getProviders().subscribe(ps => { this.providers = ps.filter(p => p.type === 'GAME_PROVIDER'); });
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.gameId;
    if (this.isEdit && this.gameId) { this.gameService.getGame(this.gameId).subscribe(g => { if (g) this.form.patchValue(g); }); }
  }

  onProviderChange(id: string): void {
    const p = this.providers.find(x => x.id === id);
    if (p) this.form.patchValue({ providerName: p.name });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const op = this.isEdit && this.gameId
      ? this.gameService.updateGame(this.gameId, this.form.value)
      : this.gameService.createGame(this.form.value);
    op.subscribe(() => { this.snackBar.open(this.isEdit ? 'Game updated' : 'Game added', 'Close', { duration: 3000 }); this.router.navigate(['/games/catalog']); });
  }
}
