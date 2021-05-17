import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountGroupComponent } from './create-account-group.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {DirectiveCommonModule} from 'src/app/directive/directive-common.module';



@NgModule({
  declarations: [CreateAccountGroupComponent],
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
    MatDividerModule
  ],
  entryComponents: [CreateAccountGroupComponent]
})
export class CreateAccountGroupModule { }
