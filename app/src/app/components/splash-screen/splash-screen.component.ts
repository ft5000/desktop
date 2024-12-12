import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop.service';

@Component({
  selector: 'app-splash-screen',
  imports: [ CommonModule ],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css',
  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class SplashScreenComponent implements AfterViewInit{
  @ViewChild('console') splashConsole: HTMLElement | undefined;
  private logInterval: any;
  private logCount: number = 0;
  private readonly logCountMax: number = 1000;
  private readonly logDeleteMax: number = 100;
  public hide = false;

  constructor(private desktopSevice: DesktopService) { }

  ngAfterViewInit(): void {
    this.splashConsole = document.getElementById('console') as HTMLElement | undefined;
    this.logInterval = setInterval(() => {
      if (!this.loaded) {
        this.log();
      }
      else if (!this.hide) {
        console.log('Hiding splash screen', this.logCount);
        setTimeout(() => {
          this.hide = true;
          this.desktopSevice.hideDesktop = false;
          setTimeout(() => {
            clearInterval(this.logInterval);
            this.desktopSevice.removeSplashScreen();
          }, 1000);
        }, 1000);
      }
    });
  }

  private get newMessage(): HTMLElement {
    var mess = document.createElement('span');
    mess.classList.add('splash-message');
    var string = this.logCount < this.logCountMax ? `Loading${this.dots}`.split('') : `Ready${this.dots}`.split('');
      const chars = `FGT1993$#%&*^@!~`;
      for (let i = 0; i < string.length; i++) {
        if (Math.random() < 0.5) {
          string[i] = chars[Math.floor(Math.random() * chars.length)];
        }
      }
    mess.innerText = `[${this.logCount}] ${string.join('')}`;
    if (this.logCount < this.logCountMax) {
      mess.classList.add('fade');
    }
    return mess;
  }

  private get dots(): string {
    var count = Math.abs(Math.floor(Math.sin((this.logCount + Math.random() * 200) / 100) * 10));
    var dots = '';
    for (let i = 0; i < count; i++) {
      dots += '.';
    }
    return dots;
  }

  private log() {
    this.splashConsole?.appendChild(this.newMessage);
    if (this.logCount > this.logDeleteMax) {
      this.splashConsole?.removeChild(this.splashConsole?.firstChild as Node);
    }
    this.logCount++;
  }

  public get loaded(): boolean {
    return this.logCount > this.logCountMax;
  }
}
