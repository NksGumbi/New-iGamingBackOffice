import { Routes } from '@angular/router';

export const GAMES_ROUTES: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', loadComponent: () => import('./game-catalog/game-catalog.component').then(m => m.GameCatalogComponent) },
  { path: 'catalog/new', loadComponent: () => import('./game-form/game-form.component').then(m => m.GameFormComponent) },
  { path: 'catalog/:id', loadComponent: () => import('./game-detail/game-detail.component').then(m => m.GameDetailComponent) },
  { path: 'catalog/:id/edit', loadComponent: () => import('./game-form/game-form.component').then(m => m.GameFormComponent) },
  { path: 'assignments', loadComponent: () => import('./game-assignments/game-assignments.component').then(m => m.GameAssignmentsComponent) }
];
