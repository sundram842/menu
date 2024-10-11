import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './global/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('../app/layout/layout/layout.component').then(
        (m) => m.LayoutComponent,
      ),
    children: [
      {
        path: 'devices',
        loadComponent: () =>
          import(
            './devices/components/devices-list/devices-list.component'
          ).then((m) => m.DeviceListComponent),
      },
      {
        path: 'devices/:id',
        loadComponent: () =>
          import(
            './devices/components/devices-view-dialog/devices-view-dialog.component'
          ).then((m) => m.DeviceViewDialogComponent),
      },
      {
        path: 'menu-items',
        loadComponent: () =>
          import('./menu-item/components/menu-items/menu-items.component').then(
            (m) => m.MenuItemsComponent,
          ),
      },
      {
        path: 'menu-items/:id',
        loadComponent: () =>
          import('./menu-item/components/menu-detail-view-dialog/menu-detail-view-dialog.component').then(
            (m) => m.MenuDetailViewDialogComponent,
          ),
      },
      {
        path: 'schedule-menus',
        loadComponent: () =>
          import(
            './scheduled-menus/components/scheduled-menu-list/scheduled-menu-list.component'
          ).then((m) => m.ScheduledMenuListComponent),
      },
      {
        path: 'schedule-menus/:id',
        loadComponent: () =>
          import(
            './scheduled-menus/components/schedule-menu-view-dialog/schedule-menu-view-dialog.component'
          ).then((m) => m.ScheduleMenuViewDialogComponent),
      },
    ],
  },

  {
    path: 'user',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./user/components/users/users.component').then(
        (m) => m.UsersComponent,
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./global/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
