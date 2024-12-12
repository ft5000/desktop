import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscriber } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { WindowContent } from 'src/app/models/WindowContent';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-echo-jam',
  imports: [ AppModule ],
  templateUrl: './echo-jam.component.html',
  styleUrl: './echo-jam.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class EchoJamComponent extends WindowContent implements OnInit, OnDestroy {
  private audioFiles: string[] = [
    'cycle.mp3',
    'marine.mp3',
    'tram.mp3',
    'complex.mp3',
    'town.mp3',
    'no.mp3',
  ];

  public themes: string[] = [
    'mono_dark',
    'blood',
    'ye_olde',
  ];

  public theme: string = 'mono_dark';
  private themeIndex: number = 0;

  private textPos: number = 0;
  private updateTitle: any;
  public selectedTitle: string = '';

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array = new Uint8Array();

  private drawInterval: any;

  constructor(private audioService: AudioService) {
    super('EchoJam', 'echo_icon_1.png');
  }

  ngOnDestroy(): void {
    clearInterval(this.updateTitle);
    clearInterval(this.drawInterval);
    this.audioService.stop();
  }

  ngOnInit(): void {
    this.audioService.playlist = this.audioFiles;
    this.audioService.loadSound();

    this.updateTitle = setInterval(() => {
      if (this.textPos == 0) {
        setTimeout(() => {
        }, 5000)
      }
      let selected = this.audioService.selected;
      this.selectedTitle = selected.length > 16 ? this.scrollText(this.audioService.selected) : selected;
    }, 500)

    this.initGfx();
    this.drawInterval = setInterval(() => {
      this.draw();
    }, 60)

    this.draw();
  }

  private initGfx(): void {
    this.canvas = document.getElementById('gfx') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    const audioContext = Howler.ctx;
    this.analyser = new AnalyserNode(audioContext);
    this.analyser.fftSize = 256; // Size of the Fast Fourier Transform (adjust as needed)
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    Howler.masterGain.connect(this.analyser);
  }
  public previous(): void {
    this.textPos = 0;
    this.audioService.previous();
  }
  public play(): void {
    this.audioService.play();
  }
  public pause(): void {
    this.audioService.pause();
  }
  public stop(): void {
    this.audioService.stop();
  }
  public next(): void {
    this.textPos = 0;
    this.audioService.next();
  }
  public select(name: string): void {
    this.textPos = 0;
    this.audioService.select(name);
  }
  public changeVolume(event: any): void {
    this.audioService.volume = (event.target.value / 100);
  }

  public get volume(): number {
    return this.audioService.currentVolume * 100;
  }

  public get selected(): string {
    return this.audioService.selected;
  }

  public get playlist(): string[] {
    return this.audioService.playlist;
  }

  public get isPlaying(): boolean {
    return this.audioService.isPlaying;
  }

  public scrollText(text: string): string {
    if (text == null  || text.length == 0) {
      return '';
    }
    var scrolled = `${text.substring(this.textPos)} ${text.substring(0, this.textPos)}`;
    if (this.textPos < text.length) {
      this.textPos++;
    } else {
      this.textPos = 0;
    }
    return scrolled;
  }

  private draw() {
    if (!this.ctx || !this.canvas || !this.analyser) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.analyser.getByteFrequencyData(this.dataArray);

    const barWidth = Math.floor(this.canvas.width / 20);
    let barHeight;
    let x = 0;

    const echo = document.querySelector('.echo-container') as HTMLElement;

    for (let i = 0; i < this.dataArray.length && x < this.canvas.width; i++) {
      barHeight = roundToEven(this.dataArray[i] * 0.3);

      this.ctx.restore();
      this.ctx.fillStyle = echo.style.getPropertyValue('--primary1');
      this.ctx.fillRect(x, roundToEven(this.canvas.height - barHeight) + 2, barWidth, barHeight);

      this.ctx.restore();
      this.ctx.fillStyle = echo.style.getPropertyValue('--primary1');
      this.ctx.fillRect(x, roundToEven(this.canvas.height - barHeight) - 2, barWidth, 2);

      x += barWidth;
    }

    function roundToEven(num: number): number {
      let rounded = Math.round(num);
      return rounded % 2 === 0 ? rounded : rounded + 1;
    }
  }

  public changeTheme(): void {
    this.themeIndex = this.themeIndex + 1 < this.themes.length ? this.themeIndex + 1 : 0;
    switch (this.themeIndex) {
      case EchoTheme.MONO_DARK:
        this.setMonoDarkTheme();
        break;
      case EchoTheme.BLOOD:
        this.setBloodTheme();
        break;
      case EchoTheme.YE_OLDE:
        this.setYeOldeTheme();
        break;
    }
  }

  public setBloodTheme(): void {
    this.theme = 'blood';
    const echo = document.querySelector('.echo-container') as HTMLElement;
    if (echo) {
      echo.style.setProperty('--primary1', 'white');
      echo.style.setProperty('--primary2', 'red');
      echo.style.setProperty('--secondary', 'blue');
      echo.style.setProperty('--slider', "url('../../../assets/images/echo/skins/blood/vol_slide.png')");
    }
  }

  public setMonoDarkTheme(): void {
    this.theme = 'mono_dark';
    const echo = document.querySelector('.echo-container') as HTMLElement;
    if (echo) {
      echo.style.setProperty('--primary1', 'lime');
      echo.style.setProperty('--primary2', 'white');
      echo.style.setProperty('--secondary', 'black');
      echo.style.setProperty('--slider', "url('../../../assets/images/echo/skins/mono_dark/vol_slide.png')");
    }
  }

  public setYeOldeTheme(): void {
    this.theme = 'ye_olde';
    const echo = document.querySelector('.echo-container') as HTMLElement;
    if (echo) {
      echo.style.setProperty('--primary1', 'pink');
      echo.style.setProperty('--primary2', 'white');
      echo.style.setProperty('--secondary', 'red');
      echo.style.setProperty('--slider', "url('../../../assets/images/echo/skins/ye_olde/vol_slide.png')");
    }
  }
}

export enum EchoTheme {
  MONO_DARK = 0,
  BLOOD = 1,
  YE_OLDE = 2,
}
