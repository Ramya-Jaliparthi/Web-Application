import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let inputPhoneNumber = value + '';
        if (inputPhoneNumber !== '') {
            inputPhoneNumber = inputPhoneNumber.replace('-', '').replace('-', '');
            const areaCode = inputPhoneNumber.slice(0, 3);
            const number = inputPhoneNumber.slice(3);
            return areaCode + '-' + number.slice(0, 3) + '-' + number.slice(3);
        }
        return '';
    }
}
