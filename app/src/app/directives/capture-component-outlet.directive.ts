import { Directive, Input, OnChanges, SimpleChanges, ViewContainerRef, ComponentRef, Injector } from '@angular/core';

@Directive({
  selector: '[captureNgComponentOutlet]'
})
export class CaptureNgComponentOutletDirective implements OnChanges {
  @Input() captureNgComponentOutlet: any; // The component class to be dynamically rendered
  componentRef?: ComponentRef<any>; // Store the reference

  constructor(private viewContainerRef: ViewContainerRef, private injector: Injector) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['captureNgComponentOutlet'] && this.captureNgComponentOutlet) {
      // Clear previous content if any
      this.viewContainerRef.clear();

      // Dynamically create the component
      const componentFactory = this.viewContainerRef.createComponent(this.captureNgComponentOutlet, {
        injector: this.injector,
      });
      this.componentRef = componentFactory;
    }
  }
}
