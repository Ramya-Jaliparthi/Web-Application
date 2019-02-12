
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoFirstPound]'
})
export class NoFirstPoundDirective {
  private el: NgControl;
  constructor(private ngControl: NgControl, private elem: ElementRef) {
    this.el = ngControl;
  }

  // Listen for the input event to also handle copy and paste.
  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    if (this.el.control.value === '' && event.shiftKey && (event.which === 51 || event.keyCode === 51)) {
      return false;
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event) {
    if (this.el.control.value.indexOf('#') === 0) {
      this.el.control.setValue(this.replaceFirstPound(this.el.control.value));
      this.elem.nativeElement.setSelectionRange(0, 0, 'none');
    }
  }

  replaceFirstPound(val: string) {
    let ret;
    ret = val.replace(new RegExp('#'), '');
    if (ret.indexOf('#') === 0) {
      return this.replaceFirstPound(ret);
    } else {
      return ret;
    }
  }
}
