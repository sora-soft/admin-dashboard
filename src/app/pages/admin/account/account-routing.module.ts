import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VexRoutes} from 'src/@vex/interfaces/vex-route.interface';
import {AccountGroupComponent} from './account-group/account-group.component';
import {AccountListComponent} from './account-list/account-list.component';

const routes: VexRoutes = [{
  path: 'account-list',
  component: AccountListComponent,
}, {
  path: 'account-group',
  component: AccountGroupComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
