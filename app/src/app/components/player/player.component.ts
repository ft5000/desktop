import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { interval, Subscriber } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit, OnDestroy {
  public guid: string = this.generateGuid();
  public sound: Howl | null = null;
  public loading: boolean = false;
  public sliderValue: number = 0;
  public isInteracting: boolean = false;
  private updateInterval: any;

  subscriber = new Subscriber();

  
  
  constructor(private audioService: AudioService) {
  }

  ngOnInit(): void {
    this.subscriber.add(this.audioService.sound$.subscribe((sound: Howl | null) =>  this.sound = sound));
    this.subscriber.add(this.audioService.loading$.subscribe((value: boolean) => this.loading = value));
    this.updateThumbPos()
  }

  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
  }

  public updateThumbPos(): void {
    this.updateInterval = setInterval(() => {
      document.getElementById(this.guid)?.style.setProperty('--thumbPos', `${this.calculateThumbPos(this.pos + 1)}%`);
    }, 10)
  }

  private calculateThumbPos(pos: number): number {
    return Math.trunc(pos / this.audioMaxValue * 100);
  }

  public play(): void {
    if (this.sound) {
      this.audioService.play();
    }
  }

  public pause(): void {
    if (this.sound) {
      this.audioService.pause();
    }
  }

  public stop(): void {
    if (this.sound) {
      this.audioService.stop();
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
    return this.sound ? Math.trunc(this.sound.duration()) + 1 : 100;
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
