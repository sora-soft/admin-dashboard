import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {ServerService} from './server.service';
import {AuthPermission, PermissionResult} from './server/api';
import {UserInfoService} from './user-info.service';

export interface IAuthGroup {
  group: string;
  permissions: [AuthName, string][];
}

export enum AuthName {
  UI_Dashboard = 'ui.dashboard',
  UI_Account = 'ui.account',
  UI_Account_AuthGroup = 'ui.account.auth-group',
  API_AuthGroup_Fetch = 'restful/fetch/auth-group',
  API_AuthGroup_Insert = 'restful/insert/auth-group',
  API_AuthGroup_Update = 'restful/update/auth-group',
  API_AuthGroup_Permission = 'auth/updatePermission',
  UI_Account_List = 'ui.account.account-list',
  API_Account_Fetch = 'restful/fetch/account',
  API_Account_Create = 'auth/createAccount',
  API_Account_Update = 'restful/update/account',
}

export const AuthDependence: {
  [key in AuthName]?: AuthName[]
} = {
  [AuthName.UI_Account_List]: [AuthName.API_Account_Fetch, AuthName.UI_Account],
  [AuthName.UI_Account_AuthGroup]: [AuthName.API_AuthGroup_Fetch, AuthName.UI_Account],
  [AuthName.API_Account_Update]: [AuthName.API_AuthGroup_Fetch],
  [AuthName.API_Account_Create]: [AuthName.API_AuthGroup_Fetch],
};

export const AuthGroup: IAuthGroup[] = [
  {
    group: '用户管理',
    permissions: [
      [AuthName.UI_Account, '用户管理'],
      [AuthName.UI_Account_List, '用户管理页面'],
      [AuthName.API_Account_Fetch, '获取用户列表'],
      [AuthName.API_Account_Create, '新建用户'],
      [AuthName.API_Account_Update, '更新用户信息'],
      [AuthName.UI_Account_AuthGroup, '用户组管理页面'],
      [AuthName.API_AuthGroup_Fetch, '获取用户组列表'],
      [AuthName.API_AuthGroup_Insert, '新建用户组'],
      [AuthName.API_AuthGroup_Update, '更新用户组'],
      [AuthName.API_AuthGroup_Permission, '修改用户组权限'],
    ]
  },
  {
    group: '仪表盘',
    permissions: [
      [AuthName.UI_Dashboard, '仪表盘页面']
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AuthGroup = AuthGroup;
  AllPermissionName = Object.values(AuthName);

  isLoaded = false;

  private userPermission = new Map<AuthName, PermissionResult>();

  constructor(
    private server: ServerService,
    private userInfo: UserInfoService,
  ) {}

  getBindAuth(name: AuthName) {
    const result = new Set<AuthName>();
    for (const [auth, dependence] of Object.entries(AuthDependence)) {
      if (dependence.includes(name)) {
        result.add(auth as AuthName);
      }
    }
    return [...result];
  }

  checkPermission(names: AuthName[] | AuthName) {
    if (!Array.isArray(names)) {
      names = [names];
    }

    return names.some((name) => this.userPermission.get(name) === PermissionResult.ALLOW);
  }

  clearPermission() {
    this.isLoaded = false;
    this.userPermission.clear();
  }

  fetchPermission() {
    return this.server.gateway.info()
      .pipe(
        map((info) => {
          this.loadPermission(info.permissions);
          this.userInfo.updateUserInfo(info.account);
          return info.permissions;
        })
      );
  }

  loadPermission(permissions: AuthPermission[]) {
    this.isLoaded = true;
    permissions.forEach((permission) => {
      this.userPermission.set(permission.name as AuthName, permission.permission);
    });
  }

}
