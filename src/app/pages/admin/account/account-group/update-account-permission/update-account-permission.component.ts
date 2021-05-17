import { Component, ErrorHandler, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthGroup, PermissionResult} from 'src/app/service/server/api';
import icClose from '@iconify/icons-ic/twotone-close';
import {FormControl} from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import {AuthDependence, AuthName, AuthService, IAuthGroup} from 'src/app/service/auth.service';
import {ServerService} from 'src/app/service/server.service';
import {SnackbarService} from 'src/app/service/snackbar.service';
import {BehaviorSubject, of, Subject} from 'rxjs';

@Component({
  selector: 'vex-update-account-permission',
  templateUrl: './update-account-permission.component.html',
  styleUrls: ['./update-account-permission.component.scss']
})
export class UpdateAccountPermissionComponent implements OnInit {

  searchCtrl = new FormControl();
  icClose = icClose;
  icSearch = icSearch;
  get dirty() {
    const allowed = this.group.permissions.filter((permission) => permission.permission === PermissionResult.ALLOW);
    return !(allowed.every(permission => this.selectedPermissions.has(permission.name as AuthName))
    && allowed.length === this.selectedPermissions.size);
  }

  selectedPermissions: Set<AuthName>;

  authGroup$ = new BehaviorSubject<IAuthGroup[]>(this.auth.AuthGroup);

  searchText = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public group: Partial<AuthGroup> | null,
    private dialogRef: MatDialogRef<UpdateAccountPermissionComponent>,
    private auth: AuthService,
    private server: ServerService,
    private errorHandler: ErrorHandler,
    private snackbar: SnackbarService,
  ) {
    this.selectedPermissions = new Set(group.permissions.filter((permission) => permission.permission === PermissionResult.ALLOW).map((permission) => permission.name as AuthName));
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges.subscribe({
      next: (text) => {
        this.searchText = text;
        this.authGroup$.next(this.auth.AuthGroup.filter((group) => {
          const hasChild = group.permissions.some((permission) => {
            return permission[1].includes(this.searchText);
          });

          return group.group.includes(this.searchText) || hasChild;
        }).map((group) => {

          return {
            group: group.group,
            permissions: group.permissions.filter((permission) => permission[1].includes(this.searchText)),
          };
        }));
      },
    });
  }

  hasPermission(name: AuthName) {
    return this.selectedPermissions.has(name);
  }

  changePermission(name: AuthName) {
    if (this.selectedPermissions.has(name)) {
      this.selectedPermissions.delete(name);
      const bindAuth = this.auth.getBindAuth(name);
      for (const auth of bindAuth) {
        this.selectedPermissions.delete(auth);
      }
    } else {
      this.selectedPermissions.add(name);
      if (AuthDependence[name]) {
        AuthDependence[name].forEach((dep) => {
          this.selectedPermissions.add(dep);
        });
      }
    }
  }

  isSelectedAll(group: IAuthGroup) {
    return group.permissions.every((permission) => this.selectedPermissions.has(permission[0]));
  }

  hasSelectedAny(group: IAuthGroup) {
    return group.permissions.some((permission) => this.selectedPermissions.has(permission[0]));
  }

  toggleSelectAll(group: IAuthGroup) {
    if (this.isSelectedAll(group)) {
      group.permissions.forEach(permission => this.selectedPermissions.delete(permission[0]));
    } else {
      group.permissions.forEach(permission => this.selectedPermissions.add(permission[0]));
    }
  }

  updatePermission() {
    return () => {
      return this.server.auth.updatePermission({
        gid: this.group.id,
        permissions: this.auth.AllPermissionName.map((name) => {
          return {
            name,
            permission: this.selectedPermissions.has(name) ? PermissionResult.ALLOW : PermissionResult.DENY,
          };
        }),
      }).subscribe({
        error: (err) => { this.errorHandler.handleError(err); },
        next: () => {
          this.snackbar.success('更新成功');
          this.dialogRef.close(true);
        }
      });
    };
  }
}
