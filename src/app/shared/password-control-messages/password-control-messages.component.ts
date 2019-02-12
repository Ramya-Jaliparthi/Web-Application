import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {ValidationService} from '../services/validation.service';

@Component({
  selector: 'app-password-control-messages',
  templateUrl: './password-control-messages.html',
  styleUrls: ['./password-control-messages.component.scss']
})
export class PasswordControlMessagesComponent {
  @Input() control: FormControl;
  @Input() password: string;
  @Input() isSubmitted: boolean;
  @Input() isBlurEvent: boolean;
  allowedSpecialCharters = '! @ # $ % ^ & * ( ) + ~ . , / [ ] { } -';
  constructor(private validation: ValidationService) {
  }

  get errorMessage() {
    // for (const propertyName in this.control.errors) {
    //   if (true) {
    //     return this.validation.passwordStatus(this.password);
    //   }
    // }
    return this.validation.passwordStatus(this.password);
  }

}
