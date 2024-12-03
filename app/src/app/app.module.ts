import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { WindowComponent } from './components/window/window.component';
import { BrowserModule } from '@angular/platform-browser';
import { CaptureNgComponentOutletDirective } from './directives/capture-component-outlet.directive';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WindowComponent,
  ],
  exports: [
    CommonModule,
    WindowComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
