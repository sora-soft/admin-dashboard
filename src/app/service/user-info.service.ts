import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {mergeDeep} from 'src/@vex/utils/merge-deep';
import {AppPath} from '../app-path';
import {UserError} from './error/UserError';
import {ServerService} from './server.service';
import {UserErrorCode} from './server/api';

export interface IUserInfo {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfoSubject = new BehaviorSubject<IUserInfo>({
    username: 'NA',
    email: 'NA'
  });
  userInfo$ = this._userInfoSubject.asObservable();

  constructor(
    private server: ServerService,
    private router: Router,
  ) {}

  updateUserInfo(info: Partial<IUserInfo>) {
    this._userInfoSubject.next(mergeDeep({ ...this._userInfoSubject.getValue() }, info));
  }

  fetchUserInfo() {
    return this.server.gateway.info().subscribe({
      next: (result) => {
        this.updateUserInfo(result.account);
      },
      error: (err) => {
        if (err instanceof UserError) {
          if (err.code === UserErrorCode.ERR_NOT_LOGIN) {
            this.router.navigate([AppPath.LoginPage]);
          }
        }
      }
    });
  }
}
