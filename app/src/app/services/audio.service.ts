import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private _playlist: string[] = [];
  public listPos: number = 0;

  private _sound: BehaviorSubject<Howl | null> = new BehaviorSubject<Howl | null>(null);
  public sound$ = this._sound.asObservable();

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  constructor() { 
    console.log('AudioService Initialized');
  }

  public set playlist(value: string[]) {
    this.listPos = 0;
    this._playlist = value;
  }
    
  public loadSound(): void {
    this.loading.next(true);
    var howl = new Howl({
      src: `assets/audio/${this._playlist[this.listPos]}`,
    });
    this.sound = howl;
    howl.on('load', () => {
      this.loading.next(false);
    });
  }

  private set sound(value: Howl) {
    this._sound.next(value);
  }

  private get sound(): Howl | null {
    return this._sound.getValue();
  }

  public nextListPos(): void {
    this.listPos = this.listPos + 1 < this._playlist.length ? this.listPos + 1 : 0;
  }

  
  public play(): void {
    if (this.sound) {
      this.sound.play();
    }
  }


  public pause(): void {
    if (this.sound) {
      this.sound.pause();
    }
  }

  public stop(): void {
    if (this.sound) {
      this.sound.stop();
    }
  }

}
