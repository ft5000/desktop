import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Output() public onClick: EventEmitter<void> = new EventEmitter<void>();
  @Input() public text: string = '';
  @Input() public src: string = '';

  constructor() {}

  public onClickHandler() {
    this.onClick.emit();
  }
}
