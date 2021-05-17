import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AsyncButtonDirective} from './async-button.directive';
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { AuthDirective } from './auth.directive';

@NgModule({
  declarations: [AsyncButtonDirective, AuthDirective],
  entryComponents: [FaIconComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [AsyncButtonDirective, AuthDirective]
})
export class DirectiveCommonModule { }
