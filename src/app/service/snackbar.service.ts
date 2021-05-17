import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(
    private snackbar: MatSnackBar,
    private readonly zone: NgZone
  ) {}

  success(message: string) {
    this.zone.run(() => {
      this.snackbar.open(message, '关闭', {
        duration: 5000,
      });
    });
  }

  error(message: string) {
    this.zone.run(() => {
      this.snackbar.open(message, '关闭', {
        duration: 5000,
      });
    });
  }
}
