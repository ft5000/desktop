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
    console.log('WindowService Initialized');
  }

  ngOnInit(): void {
  }

  public openWindow<T>(component: Type<any>, data: Type<any>, config?: IWindowConfig): void {
    if (this.openWindows.length >= 12) {
      return;
    }
    console.log('openWindow', this.openWindows.length);
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
    console.log('removeWindow', guid);
    this.openWindows = this.openWindows.filter((w: WindowModel) => { return w.ref.instance.guid != guid });
    console.log(this._openWindows);
  }

  public setZindex(ref: ComponentRef<WindowComponent>): void {
    let model = this.openWindows.find((w: WindowModel) => { return w.ref === ref });
    if (!model) {
      return
    }
    model.zIndex = this.newZIndex
    model.ref?.instance.setZIndex(model.zIndex)
    console.log('setZindex', model.zIndex);
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
    console.log(sorted)
    return sorted[sorted.length - 1] + 1;
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