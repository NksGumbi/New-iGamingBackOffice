import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="header-text">
        <h1>{{ title }}</h1>
        @if (subtitle) {
          <p class="subtitle">{{ subtitle }}</p>
        }
      </div>
      @if (actionLabel) {
        <button mat-flat-button color="primary" (click)="actionClick.emit()">
          <mat-icon>{{ actionIcon || 'add' }}</mat-icon>
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 { font-size: 24px; font-weight: 600; color: #1a237e; margin: 0; }
    .subtitle { color: #78909c; font-size: 14px; margin: 4px 0 0; }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() actionClick = new EventEmitter<void>();
}
