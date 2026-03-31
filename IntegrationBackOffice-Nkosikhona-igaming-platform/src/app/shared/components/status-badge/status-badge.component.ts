import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip [class]="'status-chip status-' + status.toLowerCase()">
      {{ status }}
    </mat-chip>
  `,
  styles: [`
    .status-chip {
      font-size: 11px !important;
      font-weight: 600 !important;
      height: 24px !important;
      min-height: 24px !important;
      letter-spacing: 0.5px;
    }
    .status-active { background-color: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-inactive { background-color: #ffebee !important; color: #c62828 !important; }
    .status-pending { background-color: #fff8e1 !important; color: #f57f17 !important; }
    .status-revoked { background-color: #fce4ec !important; color: #880e4f !important; }
    .status-suspended { background-color: #f3e5f5 !important; color: #6a1b9a !important; }
    .status-production { background-color: #e3f2fd !important; color: #1565c0 !important; }
    .status-staging { background-color: #fff3e0 !important; color: #e65100 !important; }
    .status-completed { background-color: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-failed { background-color: #ffebee !important; color: #c62828 !important; }
    .status-refunded { background-color: #e8eaf6 !important; color: #283593 !important; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';
}
