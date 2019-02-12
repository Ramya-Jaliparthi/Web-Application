import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(val: string[], params: string[]): string {
    if (!val) {
      return '';
    }
    const joinString = (params[0]) ? params[0] : ' ';
    return val.join(joinString);
  }
}
