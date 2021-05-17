import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { DirectiveCommonModule } from './directive/directive-common.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ErrorHandlerService} from './service/error-handler.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AdminCanActivate} from './guard/admin-can-activate';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DirectiveCommonModule,
    FontAwesomeModule,
    MatSnackBarModule,

    // Vex
    VexModule,
    CustomLayoutModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    AdminCanActivate,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
