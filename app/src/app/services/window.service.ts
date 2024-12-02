import { ComponentFactoryResolver, EventEmitter, Injectable, OnInit, Type } from '@angular/core';
import { WindowComponent } from '../components/window/window.component';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements OnInit {
  private windows = new Array<IWindowItem<any>>();
  private windowIsBeingDragged: boolean = false;
  private windowIsBeingResized: boolean = false;
  private windowOpen: EventEmitter<IWindowItem<any>> = new EventEmitter<IWindowItem<any>>();
  public windowOpen$ = this.windowOpen.asObservable();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { 
    console.log('Singleton Service Initialized');
  }

  ngOnInit(): void {
  }

  public openWindow<T>(component: Type<any>, data: Type<any>): void { 
    console.log('openWindow');
    this.windows.push({ component: component, data: data });
    this.windowOpen.emit({ component: component, data: data });
    console.log(this.windows)
  }
}

export interface IWindowItem<T> {
  component: Type<any>;
  data: Type<any>
}