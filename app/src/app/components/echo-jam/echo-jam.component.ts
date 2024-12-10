import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { WindowContent } from 'src/app/models/WindowContent';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-echo-jam',
  imports: [ AppModule ],
  templateUrl: './echo-jam.component.html',
  styleUrl: './echo-jam.component.css'
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

    for (let i = 0; i < this.dataArray.length && x < this.canvas.width; i++) {
      barHeight = roundToEven(this.dataArray[i] * 0.3);

      this.ctx.restore();
      this.ctx.fillStyle = 'lime';
      this.ctx.fillRect(x, roundToEven(this.canvas.height - barHeight) + 2, barWidth, barHeight);

      this.ctx.restore();
      this.ctx.fillStyle = 'lime';
      this.ctx.fillRect(x, roundToEven(this.canvas.height - barHeight) - 2, barWidth, 2);

      x += barWidth;
    }

    function roundToEven(num: number): number {
      let rounded = Math.round(num);
      return rounded % 2 === 0 ? rounded : rounded + 1;
    }
  }
}
