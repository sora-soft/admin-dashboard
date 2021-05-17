import { ComponentFactoryResolver, ContentChild, Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[vexAsyncButton]'
})
export class AsyncButtonDirective {
  private disable = false;

  @ContentChild('loading', {read: ViewContainerRef}) loading: ViewContainerRef;
  @Input() vexAsyncButton: (event: Event) => Subscription;

  @HostListener('click') onMouseEnter(event) {
    if (this.disable) {
      return;
    }

    let origin = '';
    if (this.loading) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(FaIconComponent);
      const componentRef = this.loading.createComponent(factory);
      const icon = componentRef.instance;
      icon.icon = faCircleNotch;
      icon.spin = true;
      icon.render();

      const loadingElement: HTMLElement = this.loading.element.nativeElement;
      origin = loadingElement.innerText;
      loadingElement.innerText = '';
    }

    this.disable = true;

    const subscription = this.vexAsyncButton(event);

    if (subscription) {
      subscription.add(() => {
        this.handleEnd(origin);
      });
    } else {
      this.handleEnd(origin);
    }
  }

  handleEnd(origin: string) {
    this.disable = false;
    if (this.loading) {
      this.loading.clear();
      const loadingElement: HTMLElement = this.loading.element.nativeElement;
      loadingElement.innerText = origin;
    }
  }

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
  ) {}

}
