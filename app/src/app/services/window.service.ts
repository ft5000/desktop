import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, OnInit, Type } from '@angular/core';
import { WindowComponent } from '../components/window/window.component';
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
    console.log('Singleton Service Initialized');
  }

  ngOnInit(): void {
  }

  public openWindow<T>(component: Type<any>, data: Type<any>, w?: number, h?: number): void {
    if (this.openWindows.length >= 12) {
      return;
    }
    console.log('openWindow', this.openWindows.length);
    this.windowOpen.emit({ component: component, data: data, width: w, height: h });
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
    this.openWindows = this.openWindows.filter((w: WindowModel) => { return w.ref !== ref });
    this.addToOpenWindows(model);

    this.openWindows.forEach((w: WindowModel, i: number) => {
      w.ref.instance.setZIndex(i + 1);
    });
  }

  public get newZIndex(): number {
    return this.openWindows.length + 1;
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
  width?: number;
  height?: number;
}