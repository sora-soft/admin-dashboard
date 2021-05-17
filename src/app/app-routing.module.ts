import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AdminCanActivate} from './guard/admin-can-activate';
import {AppPath} from './app-path';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

const routes: Routes = [
  {
    path: 'admin',
    component: CustomLayoutComponent,
    canActivate: [AdminCanActivate],
    children: [{
      path: 'dashboard',
      loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardModule),
    }, {
      path: 'account',
      loadChildren: () => import('./pages/admin/account/account.module').then(m => m.AccountModule),
    }]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
