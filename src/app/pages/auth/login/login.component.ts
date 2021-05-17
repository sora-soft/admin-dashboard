import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { environment } from '../../../../environments/environment';
import {ServerService} from 'src/app/service/server.service';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import {delay, tap} from 'rxjs/operators';
import {AppPath} from 'src/app/app-path';
import {UserInfoService} from 'src/app/service/user-info.service';
import {AuthService} from 'src/app/service/auth.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  faCircleNotch = faCircleNotch;

  name = environment.name;

  form: FormGroup;

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private server: ServerService,
              private errorHandler: ErrorHandler,
              private userInfo: UserInfoService,
              private auth: AuthService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  send() {
    return () => {
      if (this.form.invalid) {
        return;
      }
      return this.server.gateway.login(this.form.value).subscribe({
        next: (result) => {
          this.userInfo.updateUserInfo(result.account);
          this.auth.loadPermission(result.permissions);
          this.router.navigate([AppPath.DashboardPage]);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        },
      });
    };
    // this.router.navigate(['/']);
    // this.snackbar.open('Lucky you! Looks like you didn\'t need a password or email address! For a real application we provide validators to prevent this. ;)', 'LOL THANKS', {
    //   duration: 10000
    // });
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
