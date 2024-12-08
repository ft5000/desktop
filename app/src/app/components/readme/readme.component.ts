import { Component } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-readme',
  imports: [ AppModule ],
  templateUrl: './readme.component.html',
  styleUrl: './readme.component.css'
})
export class ReadmeComponent extends WindowContent {
  constructor() {
    super('readme', 'pad_icon_1.png');
  }
}
