import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // console.log(value, args, 'Pipes');
    if (!value) {
      return '';
    }
    return value.toString().trim(); //  msubstring(0, value.length - 1);
  }

}
