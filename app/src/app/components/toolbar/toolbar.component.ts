import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { WindowModel, WindowService } from 'src/app/services/window.service';
import { WindowComponent } from '../window/window.component';

@Component({
  selector: 'app-toolbar',
  imports: [ CommonModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  constructor(private windowService: WindowService) {
  }

  public get windows(): WindowComponent[] {
    return this.windowService.openWindows.map((w: WindowModel) => { return w.ref.instance });
  }
}  

