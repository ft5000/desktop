import { Component } from '@angular/core';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-skull-spin',
  imports: [],
  templateUrl: './skull-spin.component.html',
  styleUrl: './skull-spin.component.css'
})
export class SkullSpinComponent extends WindowContent {
  constructor() {
    super('Mortis');
  }
}