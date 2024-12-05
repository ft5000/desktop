import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentRef, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { CaptureNgComponentOutletDirective } from 'src/app/directives/capture-component-outlet.directive';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ CommonModule, CaptureNgComponentOutletDirective ],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements AfterViewInit {
  @ViewChild(CaptureNgComponentOutletDirective) outlet!: CaptureNgComponentOutletDirective;

  data: any;
  ref: ComponentRef<WindowComponent> | null = null;

  public title: string = '';

  public guid: string = '';
  private left: number = 0;
  private top: number = 0;
  public width: number = 500;
  public height: number = 600;
  public isDragging: boolean = false;
  public isResizing: boolean = false;
  public zIndex: number = 1;
  public hidden = true;
  public keepHidden = false;

  private startWidth: number = 0;
  private startHeight: number = 0;

  private resizeDir: string = '';

  private mdx: number = 0;
  private mdy: number = 0;

  constructor(private windowService: WindowService, private cdr: ChangeDetectorRef) { 
    this.guid = this.generateGuid();
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMoveResize = this.onMouseMoveResize.bind(this);
    this.onMouseUpResizing = this.onMouseUpResizing.bind(this);
  }

  ngAfterViewInit(): void {
    if (this.keepHidden) {
      this.container.style.display = 'none';
    }
    this.initCoords();
    this.title = this.outlet.componentRef?.instance.title;
    this.reorganizeWindows();
    this.container.classList.remove('hidden');
    this.cdr.detectChanges();
  }

  private disableWindowInteractions(): void {
    this.windowService.windowIsBeingDragged = this.isDragging;
    this.windowService.windowIsBeingResized = this.isResizing
  }

  private initCoords(): void {
    this.container.style.setProperty('--xpos', `${this.left}px`);
    this.container.style.setProperty('--ypos', `${this.top}px`);
    this.container.style.setProperty('--width', `${this.width}px`);
    this.container.style.setProperty('--height', `${this.height}px`);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.container.contains(event.target as Node)) {
      this.reorganizeWindows();
    }
    
    if (this.hasClickedWindowBar(target)) {
      this.mdx = event.clientX - this.left;
      this.mdy = event.clientY - this.top;

      this.left = this.container.offsetLeft;
      this.top = this.container.offsetTop;

      this.isDragging = true;
      this.disableWindowInteractions();
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    else if (target.classList.contains("wb-right") || target.classList.contains("wb-bot")) {
      this.isResizing = true;

      this.mdx = event.clientX;
      this.mdy = event.clientY;

      this.width = this.container.getBoundingClientRect().width;
      this.height = this.container.getBoundingClientRect().height;

      this.startWidth = this.width;
      this.startHeight = this.height;

      this.disableWindowInteractions();
      this.resizeDir = target.classList.contains("wb-right") ? 'right' : 'bottom';
      document.addEventListener('mousemove', this.onMouseMoveResize);
      document.addEventListener('mouseup', this.onMouseUpResizing);
    }
  }

  private hasClickedWindowBar(target: HTMLElement): boolean {
    return (target.classList.contains("win-bar") || this.hasParentWithClass(target, 'win-bar')) && 
            this.container.contains(target as Node) &&
            !target.parentElement?.classList.contains('bar-controls');
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

  private setWidth(width?: number): void {
    if (!width) { this.width = this.width; return; }
    this.width = width >= 128 ? width : 128;
  }

  private setHeight(height?: number): void {
    if (!height) { this.height = this.height; return; }
    this.height = height >= 64 ? height : 64;
  }

  private updateSize(): void {
    if (this.resizeDir == 'right') {
      this.container.style.setProperty('--width', `${this.width}px`);
    }
    if (this.resizeDir == 'bottom') {
      this.container.style.setProperty('--height', `${this.height}px`);
    }
  }

  public closeWindow(): void {
    this.windowService.windowIsBeingDragged = false;
    this.windowService.windowIsBeingResized = false;
    this.ref?.destroy();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.setXPos(event.clientX - this.mdx);
      this.setYPos(event.clientY - this.mdy);
      this.updatePosition();
    }
  }

  public reorganizeWindows(): void {
    if (!this.ref) {
      return;
    }
    this.windowService.setZindex(this.ref);
  }

  public setZIndex(zIndex: number) {
    if (!this.container) {
      return;
    }
    this.container.style.zIndex = zIndex.toString();
  }

  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.disableWindowInteractions();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseUpResizing(event: MouseEvent): void {
    this.isResizing = false;
    this.disableWindowInteractions();
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
    this.container.style.setProperty('--xpos', `${this.left}px`);
    this.container.style.setProperty('--ypos', `${this.top}px`);
    this.container.style.transform = `translate(${this.left}px, ${this.top}px)`;
  }

  public get container(): HTMLElement {
    return document.getElementById(this.guid) as HTMLElement;
  }

  public get windowIsBeingDragged(): boolean {
    return this.windowService.windowIsBeingDragged
  }

  public get windowIsBeingResized(): boolean {
    return this.windowService.windowIsBeingResized
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private hasParentWithClass(child: HTMLElement, className: string) {
    let element = child.parentElement; // Start with the parent
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return true;
        }
        element = element.parentElement; // Move to the next parent
    }
    return false;
}
}

