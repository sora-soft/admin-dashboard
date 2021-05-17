import { Component, ErrorHandler, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import {ServerService} from 'src/app/service/server.service';
import {AuthGroup} from 'src/app/service/server/api';
import {SnackbarService} from 'src/app/service/snackbar.service';

@Component({
  selector: 'vex-create-account-group',
  templateUrl: './create-account-group.component.html',
  styleUrls: ['./create-account-group.component.scss']
})
export class CreateAccountGroupComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icClose = icClose;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: Partial<AuthGroup> | null,
              private dialogRef: MatDialogRef<CreateAccountGroupComponent>,
              private server: ServerService,
              private errorHandler: ErrorHandler,
              private snackbar: SnackbarService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {};
    }

    this.form = this.fb.group({
      name: [this.defaults.name, [Validators.required, Validators.maxLength(10)]]
    });
  }

  createAuthGroup() {
    return () => {
      if (this.form.invalid) {
        return;
      }
      const authGroup = this.form.value;
      return this.server.restful.insert({
        db: 'auth-group',
        data: authGroup
      }).subscribe({
        next: (result) => {
          this.snackbar.success('创建成功');
          this.dialogRef.close(result);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        }
      });
    };
  }

  updateAuthGroup() {
    return () => {
      if (this.form.invalid) {
        return;
      }
      const id = this.defaults.id;
      const authGroup = this.form.value;
      return this.server.restful.update({
        db: 'auth-group',
        data: authGroup,
        id,
      }).subscribe({
        next: (result) => {
          this.snackbar.success('更新成功');
          this.dialogRef.close(result);
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
