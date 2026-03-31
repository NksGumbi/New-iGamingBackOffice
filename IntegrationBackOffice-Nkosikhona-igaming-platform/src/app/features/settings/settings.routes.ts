import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  { path: '', redirectTo: 'platform', pathMatch: 'full' },
  { path: 'platform', loadComponent: () => import('./platform-settings/platform-settings.component').then(m => m.PlatformSettingsComponent) },
  { path: 'branding', loadComponent: () => import('./branding/branding.component').then(m => m.BrandingComponent) }
];
