import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WindowModel, WindowService } from 'src/app/services/window.service';
import { WindowComponent } from '../window/window.component';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  imports: [ CommonModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  private subscribers = new Subscriber();

  public tabs: TabIdModel[] = [];
  public hasOpenWindows: boolean = false;

  constructor(private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.subscribers.add(this.windowService._openWindows$.subscribe((windows: WindowModel[]) => {
      windows.forEach((w: WindowModel) => {
        if (!this.tabs.some(t => t.item.guid === w.ref.instance.guid)) {
          this.tabs.push({ id: this.tabs.length, item: w.ref.instance });
        }
      });
      this.tabs = this.tabs.filter(t => windows.some(w => w.ref.instance.guid === t.item.guid));
      this.hasOpenWindows = this.tabs.length > 0;
    }));
  }

  public get instances(): WindowComponent[] {
    return this.tabs.map((t: TabIdModel) => t.item);
  }

  public closeWindow(tab: TabIdModel): void {
    tab.item.closeWindow();
    this.tabs = this.tabs.filter(t => t.id !== tab.id);
  }

  public focusWindow(tab: TabIdModel): void {
    tab.item.reorganizeWindows();
    tab.item.center();
  }

  public hasFocus(tab: TabIdModel): boolean {
    return tab.item.guid === this.windowService.hasFocus().guid;
  }
}

export class TabIdModel {
  public id: number = 0;
  public item: WindowComponent;
  constructor(id: number, item: WindowComponent) {
    this.id = id;
    this.item = item;
  }
}

