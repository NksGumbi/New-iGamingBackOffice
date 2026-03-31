import { Routes } from '@angular/router';

export const PROVIDERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'groups', loadComponent: () => import('./provider-groups/provider-groups-list/provider-groups-list.component').then(m => m.ProviderGroupsListComponent) },
  { path: 'groups/new', loadComponent: () => import('./provider-groups/provider-group-form/provider-group-form.component').then(m => m.ProviderGroupFormComponent) },
  { path: 'groups/:id', loadComponent: () => import('./provider-groups/provider-group-detail/provider-group-detail.component').then(m => m.ProviderGroupDetailComponent) },
  { path: 'groups/:id/edit', loadComponent: () => import('./provider-groups/provider-group-form/provider-group-form.component').then(m => m.ProviderGroupFormComponent) },
  { path: 'list', loadComponent: () => import('./providers-list/providers-list.component').then(m => m.ProvidersListComponent) },
  { path: 'list/new', loadComponent: () => import('./provider-form/provider-form.component').then(m => m.ProviderFormComponent) },
  { path: ':id', loadComponent: () => import('./provider-detail/provider-detail.component').then(m => m.ProviderDetailComponent) },
  { path: ':id/edit', loadComponent: () => import('./provider-form/provider-form.component').then(m => m.ProviderFormComponent) }
];
