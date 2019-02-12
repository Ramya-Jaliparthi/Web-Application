import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[dateFormatValidation]'
})
export class DateFormatValidation implements OnInit {

  constructor(private e: ElementRef) {
  }
  
  ngOnInit() {

  }

  @HostListener('keydown', ['$event']) datekeydown($event) {

    const regexStr = '^[0-9]*$';
    if ([46, 8, 9, 27, 13, 110, 190].indexOf($event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      ($event.keyCode === 65 && $event.ctrlKey === true) ||
      // Allow: Ctrl+C
      ($event.keyCode === 67 && $event.ctrlKey === true) ||
      // Allow: Ctrl+V
      ($event.keyCode === 86 && $event.ctrlKey === true) ||
      // Allow: Ctrl+X
      ($event.keyCode === 88 && $event.ctrlKey === true) ||
      //Allow end ,page up etc
      ($event.keyCode >= 35 && $event.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    const regEx = new RegExp(regexStr);
    if (regEx.test(String.fromCharCode($event.keyCode)) || ($event.keyCode >= 96 && $event.keyCode <= 105)) {
      return;
    } else {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}
