import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'filterByCallback',
    pure: true
})
export class FilterByCallbackPipe implements PipeTransform {
    transform(items: any[], callback: (item: any) => boolean): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item));
    }
}
