import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit, AfterViewInit {
  @ViewChild('outlet', { read: ViewContainerRef }) outlet!: ViewContainerRef;

  data: any;

  public guid: string = '';
  private left: number = 0;
  private top: number = 0;
  public width: number = 500;
  public height: number = 600;
  public isDragging: boolean = false;
  public isResizing: boolean = false;
  private throttleTimeout: any | null = null;


  private startWidth: number = 0;
  private startHeight: number = 0;
  private resizeDir: string = '';

  private mdx: number = 0;
  private mdy: number = 0;

  constructor() { 
    this.guid = this.generateGuid();
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMoveResize = this.onMouseMoveResize.bind(this);
    this.onMouseUpResizing = this.onMouseUpResizing.bind(this);
  }

  ngAfterViewInit(): void {
    this.initCoords();
    // const componentRef = this.outlet.createComponent(this.data);
  }

  ngOnInit(): void {
    console.log('this.data', this.data);
  }

  private initCoords(): void {
    this.left = this.container.offsetLeft;
    this.top = this.container.offsetTop;
    this.container.style.setProperty('--xpos', `${this.left}px`);
    this.container.style.setProperty('--ypos', `${this.top}px`);
    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("win-bar") && this.container.contains(event.target as Node)) {
      this.mdx = event.clientX - this.left;
      this.mdy = event.clientY - this.top;
      this.initCoords();
      this.isDragging = true;
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    else if (target.classList.contains("wb-right") || target.classList.contains("wb-bot") && this.container.contains(event.target as Node)) {
      this.mdx = event.clientX - this.left;
      this.mdy = event.clientY - this.top;

      this.startWidth = this.width;
      this.startHeight = this.height;

      this.updateSize();

      this.isResizing = true;
      this.resizeDir = target.classList.contains("wb-right") ? 'right' : 'bottom';
      console.log('resizing', this.resizeDir);
      document.addEventListener('mousemove', this.onMouseMoveResize);
      document.addEventListener('mouseup', this.onMouseUpResizing);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUpOutside(event: MouseEvent) {
    this.onMouseUp(event);
    this.onMouseUpResizing(event);
  }

  onMouseMoveResize(event: MouseEvent): void {
    const deltaX = event.clientX - this.mdx; // Horizontal movement
    const deltaY = event.clientY - this.mdy; // Vertical movement

    if (this.resizeDir == 'right') {
      this.setWidth(this.startWidth + deltaX);
    }
    if (this.resizeDir == 'bottom') {
      this.setHeight(this.startHeight + deltaY);
    }
    this.updateSize();
  }

  private setWidth(width: number): void {
    this.width = width;
  }

  private setHeight(height: number): void {
    this.height = height;
  }

  private updateSize(): void {
    console.log(this.width, this.height);
    if (this.resizeDir == 'right') {
      this.container.style.width = `${this.width}px`;
    }
    if (this.resizeDir == 'bottom') {
      this.container.style.height = `${this.height}px`;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      if (!this.throttleTimeout) {
        this.throttleTimeout = setTimeout(() => {
          this.throttleTimeout = null; // Reset timeout
          this.setXPos(event.clientX - this.mdx);
          this.setYPos(event.clientY - this.mdy);
          this.updatePosition();
        }, 10);
      }
    }
  }

  private lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  onMouseUp(event?: MouseEvent): void {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseUpResizing(event?: MouseEvent): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMoveResize);
    document.removeEventListener('mouseup', this.onMouseUpResizing);
  }

  private setXPos(xpos: number): void {
    this.left = xpos;
  }

  private setYPos(ypos: number): void {
    this.top = ypos;
  }

  private updatePosition(): void {
    console.log(this.left, this.top);
    this.container.style.setProperty('--xpos', `${this.left}px`);
    this.container.style.setProperty('--ypos', `${this.top}px`);
    this.container.style.transform = `translate(${this.left}px, ${this.top}px)`;
  }

  private get container(): HTMLElement {
    return document.getElementById(this.guid) as HTMLElement;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
