
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
  private el: NgControl;
  private reg = /^\d+$/;
  constructor(private ngControl: NgControl) {
    this.el = ngControl;
  }

  // Listen for the input event to also handle copy and paste.
  @HostListener('input', ['$event.target.value', '$event'])
  onInput(value: string, event: Event) {
    this.el.control.patchValue(value.replace(/[^0-9]/g, ''));
  }
}
