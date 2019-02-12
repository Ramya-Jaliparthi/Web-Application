import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'casingForFilter'
})
export class CasingForFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.length) {
        const valueToNotTransform = ['MD'];
        let valueArr = value.split(' ');
        valueArr = valueArr.map((item, index, arr) => {
            if (index === arr.length - 1) {
                return valueToNotTransform.includes(item.toUpperCase()) ? ', ' + item : this.transformToTitleCase(item);
            } else {
                return this.transformToTitleCase(item);
            }
        });
        return valueArr.join(' ');
    }
  }

  transformToTitleCase(value: string) {
    return value ? value[0].toUpperCase() + value.substring(1).toLowerCase() : '';
  }

}
