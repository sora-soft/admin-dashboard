import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {AuthName, AuthService} from '../service/auth.service';

@Directive({
  selector: '[vexAuth]'
})
export class AuthDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) { }

  @Input() set vexAuth(names: AuthName[] | AuthName) {
    const permission = names ? this.authService.checkPermission(names) : true;

    if (permission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!permission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
