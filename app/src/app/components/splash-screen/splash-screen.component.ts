import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop.service';

@Component({
  selector: 'app-splash-screen',
  imports: [ CommonModule ],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css',
  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class SplashScreenComponent implements AfterViewInit {
  private logInterval: any;
  private logCount: number = 0;
  private readonly logCountMax: number = 2048;
  private readonly logDeleteMax: number = 10000;
  private consoleCount: number = 0;
  private logs: HTMLElement[] = [];
  public hide = false;

  private bootSound: Howl = new Howl({ src: 'assets/audio/desktop/boot.wav', volume: 0.25 });
  private startupSound: Howl = new Howl({ src: 'assets/audio/desktop/startup.wav', volume: 0.5 });

  constructor(private desktopSevice: DesktopService) { }

  ngAfterViewInit(): void {
  }

  public onEnter(): void {
    this.bootSound.rate(0.9);
    this.bootSound.play();
    var it = this.calculateRequiredConsoles();
    document.getElementById('enter-btn')?.remove();
    setInterval(() => {
      this.findOutdatedMessages();
    });
    for (let i = 0; i < it; i++) {{
      setTimeout(() => {
        let consoleCount = this.appendNewConsole();
        this.logInterval = setInterval(() => {
          if (!this.loaded) {
            this.log(consoleCount);
          }
          else if (!this.hide) {
            clearInterval(this.logInterval);
            setTimeout(() => {
              if (!this.startupSound.playing()) {
                if (this.bootSound.playing()) {
                  this.bootSound.fade(0.25, 0, 1000);
                }
                this.startupSound.play();
              }
              this.hide = true;
              this.desktopSevice.hideDesktop = false;
              setTimeout(() => {
                this.desktopSevice.removeSplashScreen();
              }, 1000);
            }, 1000);
          }
        }, 10);
      }, 60 * i);
      }
    }
  }

  public calculateRequiredConsoles(): number {
    const screenWidth = window.innerWidth;
    const consoleWidth = 200;
    const horizontalConsoles = Math.floor(screenWidth / consoleWidth);
    return horizontalConsoles;
}

  private appendNewConsole(): number {
    var container = document.getElementById('splash-container') as HTMLElement;
    var console = document.createElement('div');
    var count = this.consoleCount;
    console.id = `console-${this.consoleCount}`;
    console.classList.add('splash-console');
    container.appendChild(console);
    this.consoleCount++;
    return count;
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
    else {
      mess.style.color = 'lime';
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

  private log(consoleCount: number): void {
    var console = document.getElementById(`console-${consoleCount}`) as HTMLElement;
    var message = this.newMessage;
    console?.appendChild(message);
    this.logCount++;
    this.logs.push(this.newMessage)
  }

  private findOutdatedMessages(): void {
    this.logs = Array.from(document.querySelectorAll('.splash-message'));

    for (let i = this.logs.length - 1; i >= 0; i--) {
        const log = this.logs[i];
        const rect = log.getBoundingClientRect();

        if (rect.bottom < 0) {
            log.remove();
            this.logs.splice(i, 1);
        }
    }
  }

  public get loaded(): boolean {
    return this.logCount > this.logCountMax;
  }
}
