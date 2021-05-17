import { Component, ErrorHandler, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServerService} from 'src/app/service/server.service';
import {Account, AuthGroup} from 'src/app/service/server/api';
import {SnackbarService} from 'src/app/service/snackbar.service';
import icClose from '@iconify/icons-ic/twotone-close';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'vex-account-create-update',
  templateUrl: './account-create-update.component.html',
  styleUrls: ['./account-create-update.component.scss']
})
export class AccountCreateUpdateComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icClose = icClose;

  get authGroup$() {
    if (!this.authGroupCache) {
      this.authGroupCache = this.server.restful.fetch({
        db: 'auth-group',
        offset: 0,
        limit: 1000
      }).pipe(
        map((res) => {
          return res.list as AuthGroup[];
        }),
      );
    }
    return this.authGroupCache;
  }

  authGroupCache;

  constructor(
    @Inject(MAT_DIALOG_DATA) public account: Partial<Account> | null,
    private dialogRef: MatDialogRef<AccountCreateUpdateComponent>,
    private server: ServerService,
    private errorHandler: ErrorHandler,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.account) {
      this.mode = 'update';
    } else {
      this.account = {};
    }

    this.form = this.fb.group({
      username: [{value: this.account.username, disabled: this.isUpdateMode()}, [Validators.required, Validators.maxLength(10)]],
      email: [this.account.email, [Validators.required, Validators.email]],
      password: [{value:  this.isUpdateMode() ? '******' : '', disabled: this.isUpdateMode()}, [Validators.required]],
      gid: [this.account.gid, [Validators.required]],
    });
  }

  createAccount() {
    return () => {
      if (this.form.invalid) {
        return;
      }

      return this.server.auth.createAccount({
        ...this.form.value
      }).subscribe({
        next: () => {
          this.snackbar.success('创建成功');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        }
      });
    };
  }

  updateAccount() {
    return () => {
      if (this.form.invalid) {
        return;
      }

      const email = this.form.value.email;
      const gid = this.form.value.gid;

      return this.server.restful.update({
        db: 'account',
        data: {
          email,
          gid,
        },
        id: this.account.id
      }).subscribe({
        next: () => {
          this.snackbar.success('更新成功');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        }
      });
    };
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
