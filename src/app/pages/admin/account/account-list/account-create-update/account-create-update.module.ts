import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCreateUpdateComponent } from './account-create-update.component';
import {DirectiveCommonModule} from 'src/app/directive/directive-common.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [AccountCreateUpdateComponent],
  entryComponents: [AccountCreateUpdateComponent],
  imports: [
    CommonModule,
    DirectiveCommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
  ]
})
export class AccountCreateUpdateModule { }
