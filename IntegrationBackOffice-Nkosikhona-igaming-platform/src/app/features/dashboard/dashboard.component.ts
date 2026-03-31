import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin } from 'rxjs';
import { OperatorService } from '../../core/services/operator.service';
import { GameService } from '../../core/services/game.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuditLogService } from '../../core/services/audit-log.service';
import { AuditLog } from '../../core/models/audit-log.model';

interface KpiCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  route: string;
  change?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatDividerModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private gameService = inject(GameService);
  private paymentService = inject(PaymentService);
  private auditLogService = inject(AuditLogService);

  kpiCards: KpiCard[] = [];
  recentActivity: AuditLog[] = [];
  isLoading = true;

  quickActions = [
    { label: 'Add Operator', icon: 'add_business', route: '/operators/list/new', color: '#1a237e' },
    { label: 'Add Game', icon: 'add_circle', route: '/games/catalog/new', color: '#00695c' },
    { label: 'Add Provider', icon: 'add_link', route: '/providers/list/new', color: '#1565c0' },
    { label: 'View Transactions', icon: 'receipt_long', route: '/payments/transactions', color: '#6a1b9a' }
  ];

  ngOnInit(): void {
    forkJoin({
      operators: this.operatorService.getOperators(),
      games: this.gameService.getGames(),
      paymentProviders: this.paymentService.getProviders(),
      logs: this.auditLogService.getLogs()
    }).subscribe(({ operators, games, paymentProviders, logs }) => {
      const activeOperators = operators.filter(o => o.status === 'ACTIVE').length;
      const activeGames = games.filter(g => g.status === 'ACTIVE').length;
      const activePaymentProviders = paymentProviders.filter(p => p.status === 'ACTIVE').length;

      this.kpiCards = [
        { title: 'Total Operators', value: operators.length, icon: 'business', color: '#1a237e', route: '/operators/list', change: `${activeOperators} active` },
        { title: 'Active Games', value: activeGames, icon: 'sports_esports', color: '#00695c', route: '/games/catalog', change: `${games.length} total` },
        { title: 'Payment Providers', value: activePaymentProviders, icon: 'payments', color: '#1565c0', route: '/payments/providers', change: `${paymentProviders.length} total` },
        { title: 'Monthly Revenue', value: '$2.4M', icon: 'trending_up', color: '#6a1b9a', route: '/payments/transactions', change: '+12% vs last month' }
      ];

      this.recentActivity = logs.slice(0, 8);
      this.isLoading = false;
    });
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      'CREATE': 'add_circle',
      'UPDATE': 'edit',
      'DELETE': 'delete',
      'LOGIN': 'login',
      'LOGOUT': 'logout',
      'VIEW': 'visibility',
      'EXPORT': 'download',
      'REVOKE': 'block'
    };
    return icons[action] || 'info';
  }
}
