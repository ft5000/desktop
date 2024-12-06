import { Component } from '@angular/core';
import { WindowContent } from 'src/app/models/WindowContent';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent extends WindowContent {
  constructor() {
    super('Contact', 'contact_icon_2.png');
  }

}
