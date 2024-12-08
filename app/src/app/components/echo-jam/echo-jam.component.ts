import { Component } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-echo-jam',
  imports: [ AppModule ],
  templateUrl: './echo-jam.component.html',
  styleUrl: './echo-jam.component.css'
})
export class EchoJamComponent extends WindowContent {
  constructor() {
    super('Echo Jam', 'echo_icon_1.png');
  }
}
