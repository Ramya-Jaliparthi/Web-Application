import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doctorname'
})
export class DoctorNameFormatter implements PipeTransform {

  transform(value: string, args?: any): string {

    if (!value) {
      return '';
    }

    const docNameEntities: string[] = value.split(' ');

    // tslint:disable-next-line:max-line-length
    let docNameFirstPart: string[] = docNameEntities.slice(0, -1);
    docNameFirstPart = docNameFirstPart.map(item =>
      `${item.substring(0, 1).toUpperCase()}${item.substring(1, item.length).toLowerCase()}`);
    const docNameLastPart = docNameEntities.slice(-1).join(' ').trim().toUpperCase();
    const refinedName: string = `${docNameFirstPart.join(' ')}, ${docNameLastPart}`;
    return refinedName; //  msubstring(0, value.length - 1);
  }

}
