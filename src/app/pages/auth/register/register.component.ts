import { ChangeDetectorRef, Component, ErrorHandler, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { environment } from '../../../../environments/environment';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServerService} from 'src/app/service/server.service';
import {AppPath} from 'src/app/app-path';

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control.dirty) {
      return false;
    }

    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.hasError('notSame') && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class RegisterComponent implements OnInit {

  name = environment.name;

  form: FormGroup;

  confirmPasswordErrorMather = new ConfirmPasswordStateMatcher();

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private server: ServerService,
              private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    }, {
      validators: this.checkPass
    });
  }

  checkPass(group: FormGroup) {
    const password = group.get('password').value;
    const passwordConfirm = group.get('passwordConfirm').value;

    return password === passwordConfirm ? null : { notSame: true };
  }

  send() {
    return () => {
      if (this.form.invalid) {
        return;
      }

      return this.server.gateway.register({
        username: this.form.get('username').value,
        password: this.form.get('password').value,
        email: this.form.get('email').value,
      }).subscribe({
        next: (result) => {
          this.router.navigate([AppPath.LoginPage]);
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        }
      });
    }
    // this.router.navigate(['/']);
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
