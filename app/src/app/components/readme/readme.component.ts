import { Component } from '@angular/core';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-readme',
  imports: [],
  templateUrl: './readme.component.html',
  styleUrl: './readme.component.css'
})
export class ReadmeComponent extends WindowContent {
  constructor() {
    super('readme', 'pad_icon_1.png');
  }
}
