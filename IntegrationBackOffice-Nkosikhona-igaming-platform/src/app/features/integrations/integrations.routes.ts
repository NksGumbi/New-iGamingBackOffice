import { Routes } from '@angular/router';

export const INTEGRATIONS_ROUTES: Routes = [
  { path: '', redirectTo: 'api-keys', pathMatch: 'full' },
  { path: 'api-keys', loadComponent: () => import('./api-keys/api-keys.component').then(m => m.ApiKeysComponent) },
  { path: 'webhooks', loadComponent: () => import('./webhooks/webhooks.component').then(m => m.WebhooksComponent) }
];
