import { Component, AfterViewInit, ViewChild, ViewContainerRef, OnInit, ComponentRef } from '@angular/core';
import { WindowComponent } from './components/window/window.component';
import { IWindowItem, WindowService } from './services/window.service';
import { AppModule } from './app.module';
import { Subscriber } from 'rxjs';
import { DarkDescentComponent } from './components/dark-descent/dark-descent.component';
import { SkullSpinComponent } from './components/skull-spin/skull-spin.component';
import { ReadmeComponent } from './components/readme/readme.component';
import { ContactComponent } from './components/contact/contact.component';
import { EchoJamComponent } from './components/echo-jam/echo-jam.component';
import { DesktopService } from './services/desktop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AppModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('view', { read: ViewContainerRef, static: true }) view!: ViewContainerRef;

  private subscribers = new Subscriber();
  private isRendering = false;
  
  constructor(private windowService: WindowService, private desktopService: DesktopService) {

  }

  ngOnInit(): void {
    this.subscribers.add(this.windowService.windowOpen$.subscribe((window: IWindowItem<any>) => this.onOpenWindow(window)));

    setInterval(() => {
      let title = "WELCOME".split('');
      const chars = `FGT1993$#%&*^@!~`;
      for (let i = 0; i < title.length; i++) {
        if (Math.random() < 0.5) {
          title[i] = chars[Math.floor(Math.random() * chars.length)];
        }
      }
      document.title = title.join('');
    }, 100);
  }

  ngAfterViewInit(): void {
    let ref = this.view.createComponent(WindowComponent); // Create a window component 
    ref.instance.keepHidden = true; // and keep it hidden to prevent flickering
    this.openReadme();
  }

  public openDarkDescent(): void {
    this.windowService.openWindow(WindowComponent, DarkDescentComponent, {
      width: 872,
      height: 702,
    });
  }

  public openSkull(): void {
    this.windowService.openWindow(WindowComponent, SkullSpinComponent);
  }

  public openReadme(): void {
    this.windowService.openWindow(WindowComponent, ReadmeComponent, {
      width: 545,
      height: 326,
    });
  }

  public openContact(): void {
    this.windowService.openWindow(WindowComponent, ContactComponent, {
      width: 420,
      height: 326,
    });
  }

  public openEchoJam(): void {
    if (this.windowService.windowOfTypeIsOpen(EchoJamComponent)) {
      return;
    };
    this.windowService.openWindow(WindowComponent, EchoJamComponent, {
      width: 704,
      height: 448,
      fitToContent: true
    });
  }

  private onOpenWindow(window: IWindowItem<any>): void {
    this.renderWindow(window);
  }

  private renderWindow(window: IWindowItem<any>): void {
    if (this.isRendering) return;
    this.isRendering = true;
    
    let componentRef = this.view.createComponent(window.component)
    componentRef.instance.data = window.data;
    componentRef.instance.ref = componentRef;

    componentRef.instance.setWidth(window.config?.width);
    componentRef.instance.setHeight(window.config?.height);
    componentRef.instance.setFitToContent(window.config?.fitToContent);

    this.windowService.addOpenWindow(componentRef);
    this.isRendering = false;
  }

  public get hideDesktop(): boolean {
    return this.desktopService.hideDesktop;
  }
}
