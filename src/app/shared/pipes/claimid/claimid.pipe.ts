import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'claimid'
})
export class ClaimidPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value && value.toString().replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
  }

}
