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
  ];
  constructor(private audioService: AudioService) {
    super('Echo Jam', 'echo_icon_1.png');
  }
  ngOnInit(): void {
    this.audioService.playlist = this.audioFiles;
    this.audioService.nextListPos();
    this.audioService.nextListPos();
    this.audioService.loadSound();
  }
}
