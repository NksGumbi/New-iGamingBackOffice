import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Operators', icon: 'business', children: [
        { label: 'Operator Groups', icon: 'folder', route: '/operators/groups' },
        { label: 'Operators', icon: 'store', route: '/operators/list' }
      ]
    },
    {
      label: 'Games', icon: 'sports_esports', children: [
        { label: 'Game Catalog', icon: 'grid_view', route: '/games/catalog' },
        { label: 'Game Assignments', icon: 'assignment', route: '/games/assignments' }
      ]
    },
    {
      label: 'Providers', icon: 'power', children: [
        { label: 'Provider Groups', icon: 'folder_special', route: '/providers/groups' },
        { label: 'Providers', icon: 'electrical_services', route: '/providers/list' }
      ]
    },
    {
      label: 'Payments', icon: 'payments', children: [
        { label: 'Payment Providers', icon: 'account_balance', route: '/payments/providers' },
        { label: 'Payment Methods', icon: 'credit_card', route: '/payments/methods' },
        { label: 'Transactions', icon: 'receipt_long', route: '/payments/transactions' }
      ]
    },
    {
      label: 'Users & Roles', icon: 'group', children: [
        { label: 'Users', icon: 'person', route: '/users/list' },
        { label: 'Roles', icon: 'admin_panel_settings', route: '/users/roles' }
      ]
    },
    {
      label: 'Integrations', icon: 'hub', children: [
        { label: 'API Keys', icon: 'key', route: '/integrations/api-keys' },
        { label: 'Webhooks', icon: 'webhook', route: '/integrations/webhooks' }
      ]
    },
    { label: 'Audit Logs', icon: 'list_alt', route: '/audit-logs' },
    {
      label: 'Settings', icon: 'settings', children: [
        { label: 'Platform Settings', icon: 'tune', route: '/settings/platform' },
        { label: 'Branding', icon: 'palette', route: '/settings/branding' }
      ]
    }
  ];
}
