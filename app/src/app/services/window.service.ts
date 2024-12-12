import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, OnInit, Type } from '@angular/core';
import { IWindowConfig, WindowComponent } from '../components/window/window.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements OnInit {
  private windowOpen: EventEmitter<IWindowItem<any>> = new EventEmitter<IWindowItem<any>>();
  public windowOpen$ = this.windowOpen.asObservable();

  private _openWindows: BehaviorSubject<WindowModel[]> = new BehaviorSubject<WindowModel[]>([]);
  public _openWindows$ = this._openWindows.asObservable();

  public windowIsBeingDragged: boolean = false;
  public windowIsBeingResized: boolean = false;


  constructor(private componentFactoryResolver: ComponentFactoryResolver) { 

  }

  ngOnInit(): void {
  }

  public openWindow<T>(component: Type<any>, data: Type<any>, config?: IWindowConfig): void {
    if (this.openWindows.length >= 12) {
      return;
    }
    this.windowOpen.emit({ component: component, data: data, config: config });
  }

  public addOpenWindow(ref: ComponentRef<WindowComponent>): void {
    let model = new WindowModel(ref)
    model.zIndex = this.openWindows.length + 1;
    this.addToOpenWindows(new WindowModel(ref)); 
  }

  public get openWindows(): WindowModel[] {
    return this._openWindows.getValue();
  }

  public set openWindows(value: WindowModel[]) {
    this._openWindows.next(value);
  }

  public addToOpenWindows(newValue: WindowModel): void {
    const currentArray = this._openWindows.getValue();
    const updatedArray = [...currentArray, newValue];
    this.openWindows = updatedArray
  }

  public removeWindow(guid: string): void {
    this.openWindows = this.openWindows.filter((w: WindowModel) => { return w.ref.instance.guid != guid });
  }

  public setZindex(ref: ComponentRef<WindowComponent>): void {
    const model = this.openWindows.find((w: WindowModel) => w.ref === ref);
    if (!model) {
      return;
    }
  
    const highestZIndex = this.openWindows.length;
  
    model.zIndex = highestZIndex;
    model.ref?.instance.setZIndex(model.zIndex);
  
    this.openWindows.forEach((window) => {
      if (window !== model && window.zIndex === highestZIndex) {
        window.zIndex -= 1;
        window.ref?.instance.setZIndex(window.zIndex);
      }
    });

    console.log(this.openWindows.map(w => ({ zIndex: w.zIndex, guid: w.ref.instance.guid })));
  }

  public hasFocus(): WindowComponent { 
    let windows = this.openWindows;
    return windows.sort((a, b) => b.zIndex - a.zIndex)[0].ref.instance;
  }

  public get newZIndex(): number {
    if (this.openWindows.length === 0) {
      return 1;
    }
    var sorted = this.openWindows.map((w: WindowModel) => w.zIndex).sort((a, b) => a - b);
    return sorted[sorted.length - 1] + 1;
  }

  public windowOfTypeIsOpen(type: Type<any>): boolean {
    return this.openWindows.some(w => w.ref.instance.data === type);
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
  config?: IWindowConfig;
}