import { Component, AfterViewInit, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { WindowComponent } from './components/window/window.component';
import { IWindowItem, WindowService } from './services/window.service';
import { AppModule } from './app.module';
import { Subscriber } from 'rxjs';
import { DarkDescentComponent } from './components/dark-descent/dark-descent.component';

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
  }

  public openWindow(): void {
    this.windowService.openWindow(WindowComponent, DarkDescentComponent);
  }

  private onOpenWindow(window: IWindowItem<any>): void {
    this.renderWindow(window);
  }

  private renderWindow(window: IWindowItem<any>): void {
    console.log('renderWindow', window);
    const componentRef = this.view.createComponent(window.component);
    componentRef.instance.data = window.data;
    // console.log('componentRef', componentRef);
    // this.view.insert(componentRef.hostView);
  }
}
