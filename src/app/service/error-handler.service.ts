import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseError} from './error/BaseError';
import {SnackbarService} from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private snackBar: SnackbarService,
    private readonly zone: NgZone
  ) {}

  public handle(err: Error) {
    console.error(err);
    if (err instanceof BaseError) {
      this.snackBar.error(err.showMessage);
    }
  }

  public handleError(err) {
    if (err.rejection) {
      this.handle(err.rejection);
    } else {
      this.handle(err);
    }
  }
}
