
import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Injectable()
export class SpinnerService {
    subject: Subject<any>;
    isOpacityUnsetSupported: boolean;
    constructor(private spinner: Ng4LoadingSpinnerService) {
        this.isOpacityUnsetSupported = this.cssPropertyValueSupported('opacity', 'unset');
    }

    setSubject(subject: Subject<any>) {
        this.subject = subject;
    }

    show() {
        if (this.subject) {
            this.subject.next(true);
        }
        this.spinner.show();
    }

    hide() {
        if (this.subject) {
            this.subject.next(false);
        }
        this.spinner.hide();
    }

    cssPropertyValueSupported(prop, value) {
        const elem = document.createElement('div');
        elem.style[prop] = value;
        return elem.style[prop] === value;
    }
}
