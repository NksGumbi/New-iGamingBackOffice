import { Routes } from '@angular/router';

export const PAYMENTS_ROUTES: Routes = [
  { path: '', redirectTo: 'providers', pathMatch: 'full' },
  { path: 'providers', loadComponent: () => import('./payment-providers/payment-providers-list/payment-providers-list.component').then(m => m.PaymentProvidersListComponent) },
  { path: 'providers/new', loadComponent: () => import('./payment-providers/payment-provider-form/payment-provider-form.component').then(m => m.PaymentProviderFormComponent) },
  { path: 'providers/:id', loadComponent: () => import('./payment-providers/payment-provider-detail/payment-provider-detail.component').then(m => m.PaymentProviderDetailComponent) },
  { path: 'providers/:id/edit', loadComponent: () => import('./payment-providers/payment-provider-form/payment-provider-form.component').then(m => m.PaymentProviderFormComponent) },
  { path: 'methods', loadComponent: () => import('./payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent) },
  { path: 'transactions', loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent) }
];
