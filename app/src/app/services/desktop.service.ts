import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesktopService {
  public hideDesktop = true; 

  constructor() { }

  public removeSplashScreen(): void {
    const splash = document.getElementsByTagName('app-splash-screen')[0];
    if (splash) {
      splash.remove();
    }
  }
}
