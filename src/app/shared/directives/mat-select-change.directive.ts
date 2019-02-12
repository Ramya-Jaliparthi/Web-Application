import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMatSelectChange]',
})
export class AppMatSelectChangeDirective {
  @Input() parentFormField;
  constructor(private hostElement: ElementRef, private renderer: Renderer2) { }

  @HostListener('openedChange', ['$event'])
  openedChange(event) {
    if (this.parentFormField && this.parentFormField._elementRef && this.parentFormField._elementRef.nativeElement) {
      if (event) {
        this.renderer.addClass(this.parentFormField._elementRef.nativeElement, 'mat-select-custom-focused');
      } else {
        this.renderer.removeClass(this.parentFormField._elementRef.nativeElement, 'mat-select-custom-focused');
      }
    }
  }
}
