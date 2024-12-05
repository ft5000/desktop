import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { WindowComponent } from './components/window/window.component';
import { BrowserModule } from '@angular/platform-browser';
import { CaptureNgComponentOutletDirective } from './directives/capture-component-outlet.directive';
import { IconComponent } from './components/icon/icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WindowComponent,
    IconComponent,
    ToolbarComponent,
  ],
  exports: [
    CommonModule,
    WindowComponent,
    IconComponent,
    ToolbarComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
