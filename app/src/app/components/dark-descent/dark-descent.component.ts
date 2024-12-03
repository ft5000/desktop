import { Component } from '@angular/core';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-dark-descent',
  imports: [],
  templateUrl: './dark-descent.component.html',
  styleUrl: './dark-descent.component.css'
})
export class DarkDescentComponent extends WindowContent {
  constructor() {
    super('Dark Descent');
  }
}
