import { Component, AfterViewInit, ViewChild, ViewContainerRef, OnInit, ComponentRef } from '@angular/core';
import { WindowComponent } from './components/window/window.component';
import { IWindowItem, WindowModel, WindowService } from './services/window.service';
import { AppModule } from './app.module';
import { Subscriber } from 'rxjs';
import { DarkDescentComponent } from './components/dark-descent/dark-descent.component';
import { SkullSpinComponent } from './components/skull-spin/skull-spin.component';
import { ReadmeComponent } from './components/readme/readme.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AppModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('view', { read: ViewContainerRef }) view!: ViewContainerRef;

  private subscribers = new Subscriber();
  
  constructor(private windowService: WindowService) {

  }

  ngOnInit(): void {
    this.subscribers.add(this.windowService.windowOpen$.subscribe((window: IWindowItem<any>) => this.onOpenWindow(window)));
  }

  ngAfterViewInit(): void {
    this.openReadme();
  }

  public openDarkDescent(): void {
    this.windowService.openWindow(WindowComponent, DarkDescentComponent);
  }

  public openSkull(): void {
    this.windowService.openWindow(WindowComponent, SkullSpinComponent);
  }

  public openReadme(): void {
    this.windowService.openWindow(WindowComponent, ReadmeComponent);
  }

  private onOpenWindow(window: IWindowItem<any>): void {
    console.log('render', window)
    this.renderWindow(window);
  }

  public get openWindows(): WindowModel[] {
    return this.windowService.openWindows;
  }

  private renderWindow(window: IWindowItem<any>): void {
    console.log('renderWindow', window);
    let componentRef = this.view.createComponent(window.component);
    componentRef.instance.data = window.data;
    componentRef.instance.ref = componentRef;
    this.windowService.addOpenWindow(componentRef);
  }
}
