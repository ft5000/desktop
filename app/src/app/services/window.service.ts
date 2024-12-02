import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, OnInit, Type } from '@angular/core';
import { WindowComponent } from '../components/window/window.component';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements OnInit {
  private windows = new Array<IWindowItem<any>>();

  private windowOpen: EventEmitter<IWindowItem<any>> = new EventEmitter<IWindowItem<any>>();
  public windowOpen$ = this.windowOpen.asObservable();

  private _openWindows: WindowModel[] = [];

  public windowIsBeingDragged: boolean = false;
  public windowIsBeingResized: boolean = false;


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

  public addOpenWindow(ref: ComponentRef<WindowComponent>): void {
    let model = new WindowModel(ref)
    model.zIndex = this._openWindows.length + 1;
    this._openWindows.push(new WindowModel(ref)); 
  }

  public get openWindows(): WindowModel[] {
    return this.openWindows;
  }

  public setZindex(ref: ComponentRef<WindowComponent>): void {
    let model = this._openWindows.find((w: WindowModel) => { return w.ref === ref });
    if (!model) {
      return
    }
    this._openWindows = this._openWindows.filter((w: WindowModel) => { return w.ref !== ref });
    this._openWindows.push(model);

    this._openWindows.forEach((w: WindowModel, i: number) => {
      w.ref.instance.setZIndex(i + 1);
    });
  }

  public get newZIndex(): number {
    return this.windows.length + 1;
  }
}

export class WindowModel {
  public zIndex: number = 1;
  public ref: ComponentRef<WindowComponent>;
  constructor(ref: ComponentRef<WindowComponent>) {
    this.ref = ref;
  }
}

export interface IWindowItem<T> {
  component: Type<any>;
  data: Type<any>
}