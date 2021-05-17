import {Route} from '@angular/compiler/src/core';
import {ErrorHandler, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppPath} from '../app-path';
import {AuthService} from '../service/auth.service';
import {SnackbarService} from '../service/snackbar.service';

@Injectable()
export class AdminCanActivate implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isLoaded) {
      return true;
    }

    return this.auth.fetchPermission().pipe(
      map((result) => {
        return !!result;
      }),
      catchError((err) => {
        return of(false);
      }),
      map((result) => {
        if (!result) {
          this.snackbar.error('尚未登录或登录已过期，请重新登录');
          return this.router.parseUrl(AppPath.LoginPage);
        } else {
          return result;
        }
      }),
    );
  }
}
