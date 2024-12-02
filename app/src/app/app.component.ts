import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { WindowComponent } from './components/window/window.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [WindowComponent],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
