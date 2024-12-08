import { Component, OnInit } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { WindowContent } from 'src/app/models/WindowContent';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-echo-jam',
  imports: [ AppModule ],
  templateUrl: './echo-jam.component.html',
  styleUrl: './echo-jam.component.css'
})
export class EchoJamComponent extends WindowContent implements OnInit {
  private audioFiles: string[] = [
    'slop8.mp3',
    'save.mp3',
    'natural.mp3',
    'atrium.mp3',
    'lakes.mp3',
    'marine.mp3',
    'memory.mp3',
    'pavane.mp3',
    'open.mp3',
    'passage.mp3',
  ];
  constructor(private audioService: AudioService) {
    super('Echo Jam', 'echo_icon_1.png');
  }
  ngOnInit(): void {
    this.audioService.playlist = this.audioFiles;
    this.audioService.nextListPos();
    this.audioService.nextListPos();
    this.audioService.loadSound();
    console.log(this.playlist)
  }
  public previous(): void {
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
    this.audioService.next();
  }
  public select(name: string): void {
    this.audioService.select(name);
  }
  public get playlist(): string[] {
    return this.audioService.playlist;
  }
}
