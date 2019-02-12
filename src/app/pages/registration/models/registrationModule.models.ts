import { AbstractControl } from '@angular/forms';
import { VerifyAccessCodeInputValidationResultModelInterface } from './registrationModule.interfaces';

export class VerifyAccessCodeInputValidationResultModel implements VerifyAccessCodeInputValidationResultModelInterface {
    'isError': boolean = false;
    'hasErrors': boolean = false;
}

export class FormGroupControlsModel {
    [key: string]: AbstractControl;
}