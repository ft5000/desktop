import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { WindowComponent } from './components/window/window.component';
import { IconComponent } from './components/icon/icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PlayerComponent } from './components/player/player.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WindowComponent,
    IconComponent,
    ToolbarComponent,
    PlayerComponent,
    SplashScreenComponent,
  ],
  exports: [
    CommonModule,
    WindowComponent,
    IconComponent,
    ToolbarComponent,
    PlayerComponent,
    SplashScreenComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
