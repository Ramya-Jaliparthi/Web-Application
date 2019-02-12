import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'customdate'
})
export class CustomdatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const date = moment(value, 'M/D/YY').format('MM/DD/YYYY h:mm:ss A');
    return moment(date).format( 'L');
  }

}


@Pipe({
  name: 'homedate'
})
export class HomedatePipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   const date = moment(value, 'M/D/YY').format('MM/DD/YYYY h:mm:ss A');
  //   return moment(date).format( 'L');
  // }
  constructor(private date: DatePipe) {
  }

  transform(value: any): any {
    return this.date.transform(value, 'MM/dd/yyyy');
  }

}
