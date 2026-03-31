import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent) },
  { path: 'list/new', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'list/:id', loadComponent: () => import('./user-detail/user-detail.component').then(m => m.UserDetailComponent) },
  { path: 'list/:id/edit', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'roles', loadComponent: () => import('./roles/roles-list/roles-list.component').then(m => m.RolesListComponent) },
  { path: 'roles/new', loadComponent: () => import('./roles/role-form/role-form.component').then(m => m.RoleFormComponent) },
  { path: 'roles/:id', loadComponent: () => import('./roles/role-detail/role-detail.component').then(m => m.RoleDetailComponent) },
  { path: 'roles/:id/edit', loadComponent: () => import('./roles/role-form/role-form.component').then(m => m.RoleFormComponent) }
];
