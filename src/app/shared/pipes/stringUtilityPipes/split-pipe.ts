import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  transform(val: string, params: string[]): string[] {
    if (!val) {
      return [''];
    }
    const splitString = (params[0]) ? params[0] : ' ';
    return val.split(splitString);
  }
}
