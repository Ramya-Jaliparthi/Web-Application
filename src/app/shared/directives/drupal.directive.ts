import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';
import { AuthHttp } from '../services/authHttp.service';
import { environment } from '../../../environments/environment';

@Directive({
  selector: '[drupalApi]',
})
export class drupalDirective {
  //  @Input() parentFormField;
  constructor(
    private hostElement: ElementRef,
    private renderer: Renderer2,
    private http: AuthHttp) { }

  @HostListener('openedChange', ['$event'])
  openedChange(event) {
    if (event) {
      // this.renderer.addClass(this.parentFormField._elementRef.nativeElement, 'mat-select-custom-focused');
    } else {
      // this.renderer.removeClass(this.parentFormField._elementRef.nativeElement, 'mat-select-custom-focused');
    }
  }

  private fetchDrupalContent() {
    this.http.get(environment.drupalTestUrl + '/page/mycards').subscribe(item => {
      // this[`_article${number}$`].next(new ArticleModel(number).deserialize(item[0], this.sanitizer));
      console.log(item);
    });
  }
}
