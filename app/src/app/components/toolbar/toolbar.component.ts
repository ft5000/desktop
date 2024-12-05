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
  public index: number = 0;

  constructor(private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.subscribers.add(this.windowService._openWindows$.subscribe((windows: WindowModel[]) => {
      const allWindowsInTabs = windows.every(w =>
        this.tabs.some(t => t.item.guid === w.ref.instance.guid)
      );
      
      if (allWindowsInTabs && this.tabs.length > 0) {
        return; // All windows already exist in tabs; no need to proceed
      }
      
      if (windows.length === 0) {
        this.index = 0; // Reset the index if there are no windows
      }

      // Only add new tabs and keep existing ones' IDs intact
      windows.forEach((w: WindowModel) => {
        const existingTab = this.tabs.find(t => t.item.guid == w.ref.instance.guid);
        if (!existingTab) {
          this.tabs.push(new TabIdModel(Number(this.index), w.ref.instance));
          this.index++;
        }
      });
    
      // Remove any tabs that are no longer in the windows list
      this.tabs = this.tabs.filter(t => windows.some(w => w.ref.instance.guid == t.item.guid));
    
      // Sort tabs by ID
      this.tabs.sort((a, b) => a.id - b.id);
    
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
    this.sortTabs();
  }

  private sortTabs(): void {
    this.tabs = this.tabs.sort((a, b) => a.id - b.id);
    console.log(this.tabs.map(t => ({ id: t.id, guid: t.item.guid })));
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

