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
    'slopped_not_chopped_8.mp3',
    'save.mp3',
    'natural.mp3',
    'atrium.mp3',
    'lakes.mp3',
    'marine.mp3',
    'memory.mp3',
    'pavane.mp3',
    'open.mp3',
    'passage.mp3',
    'forest.mp3',
    'green.mp3',
    'heart.mp3',
    'inside.mp3',
    'island.mp3',
    'joy.mp3',
    'keep_on_walking.mp3',
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
  }

  private initGfx(): void {
    this.canvas = document.getElementById('gfx') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    const audioContext = Howler.ctx;
    this.analyser = new AnalyserNode(audioContext);
    this.analyser.fftSize = 64; // Size of the Fast Fourier Transform (adjust as needed)
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    Howler.masterGain.connect(this.analyser);

    console.log(this.canvas, this.ctx, this.analyser);
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

    // Draw the bars
    // const barWidth = (this.canvas.width / this.dataArray.length) * 2;
    const barWidth = 3;
    let barHeight;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
        barHeight = Math.floor(this.dataArray[i] * 0.65);

        // this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        this.ctx.fillStyle = 'lime';
        this.ctx.fillRect(x, Math.floor(this.canvas.height - barHeight / 2), barWidth, Math.ceil(barHeight / 2));

        x += barWidth + 1; // Spacing between bars
    }
  }
}
