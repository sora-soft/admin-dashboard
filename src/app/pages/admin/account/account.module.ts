import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import {AccountGroupComponent} from './account-group/account-group.component';
import {AccountListComponent} from './account-list/account-list.component';
import {PageLayoutModule} from 'src/@vex/components/page-layout/page-layout.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {IconModule} from '@visurel/iconify-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {ContainerModule} from 'src/@vex/directives/container/container.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {CreateAccountGroupModule} from './account-group/create-account-group/create-account-group.module';
import {MatMenuModule} from '@angular/material/menu';
import {UpdateAccountPermissionModule} from './account-group/update-account-permission/update-account-permission.module';
import {AccountCreateUpdateModule} from './account-list/account-create-update/account-create-update.module';
import {SecondaryToolbarModule} from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import {BreadcrumbsModule} from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import {DirectiveCommonModule} from 'src/app/directive/directive-common.module';


@NgModule({
  declarations: [
    AccountGroupComponent,
    AccountListComponent,
  ],
  imports: [
    CommonModule,
    DirectiveCommonModule,
    AccountRoutingModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    FlexLayoutModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    ContainerModule,
    MatPaginatorModule,
    MatTableModule,
    CreateAccountGroupModule,
    MatMenuModule,
    UpdateAccountPermissionModule,
    AccountCreateUpdateModule,
  ]
})
export class AccountModule { }
