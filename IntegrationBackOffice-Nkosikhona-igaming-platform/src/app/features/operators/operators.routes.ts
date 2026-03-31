import { Routes } from '@angular/router';

export const OPERATORS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'groups',
    loadComponent: () => import('./operator-groups/operator-groups-list/operator-groups-list.component').then(m => m.OperatorGroupsListComponent)
  },
  {
    path: 'groups/new',
    loadComponent: () => import('./operator-groups/operator-group-form/operator-group-form.component').then(m => m.OperatorGroupFormComponent)
  },
  {
    path: 'groups/:id',
    loadComponent: () => import('./operator-groups/operator-group-detail/operator-group-detail.component').then(m => m.OperatorGroupDetailComponent)
  },
  {
    path: 'groups/:id/edit',
    loadComponent: () => import('./operator-groups/operator-group-form/operator-group-form.component').then(m => m.OperatorGroupFormComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./operators-list/operators-list.component').then(m => m.OperatorsListComponent)
  },
  {
    path: 'list/new',
    loadComponent: () => import('./operator-form/operator-form.component').then(m => m.OperatorFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./operator-detail/operator-detail.component').then(m => m.OperatorDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./operator-form/operator-form.component').then(m => m.OperatorFormComponent)
  }
];
