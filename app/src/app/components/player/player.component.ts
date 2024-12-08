import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { interval } from 'rxjs';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @Input() src: string = '';
  public guid: string = this.generateGuid();
  public sound: Howl | null = null;
  public loading: boolean = false;
  private seekInterval: any;
  public sliderValue: number = 0;
  public isInteracting: boolean = false;
  private updateInterval: any;
  
  constructor() {

  }

  ngOnInit(): void {
    this.loadAudio();
    this.updateThumbPos()
  }

  ngOnDestroy(): void {
    clearInterval(this.seekInterval);
    clearInterval(this.updateInterval);
  }

  public updateThumbPos(): void {
    this.updateInterval = setInterval(() => {
      document.getElementById(this.guid)?.style.setProperty('--thumbPos', `${this.calculateThumbPos(this.pos)}%`);
    }, 10)
  }

  private calculateThumbPos(pos: number): number {
    return Math.trunc(pos / this.audioMaxValue * 100);
  }

  private loadAudio() {
    this.loading = true;

    this.sound = new Howl({
      src: `../../assets/audio/${this.src}`,
    });

    this.sound.on('load', () => {
      this.loading = false;
    });
  }

  public play(): void {
    if (this.sound) {
      this.sound.play();
    }
  }

  public pause(): void {
    if (this.sound) {
      this.sound.pause();
      clearInterval(this.seekInterval);
    }
  }

  public stop(): void {
    if (this.sound) {
      this.sound.stop();
    }
  }

  public onClick(): void {
    if (!this.playing) {
      this.play();
    }
    else {
      this.stop();
    }
  }

  public onSliderInput(event: any): void {
    this.sliderValue = Math.trunc(parseFloat(event.target.value));
  }

  public onSliderChange(event: any): void {
    this.sound?.seek(this.sliderValue);
    this.endInteraction();
  }

  public startInteraction(): void {
    this.isInteracting = true;
    this.sliderValue = this.pos;
  }
  
  public endInteraction(): void {
    this.isInteracting = false;
  }
  public get pos(): number {
    return this.sound ? Math.trunc(this.sound.seek()) : 0;
  }

  public get audioMaxValue(): number {
    return this.sound ? Math.trunc(this.sound.duration()) : 100;
  }

  public get playing(): boolean {
    return this.sound ? this.sound.playing() : false;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
