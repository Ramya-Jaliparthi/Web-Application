import {Component, OnInit, Input} from '@angular/core';
import {LineChartOptionsInterface} from './line-chart.interface';
import {LineChartOptions} from './line-chart.model';

@Component({
  selector: 'app-alegeus-linechart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class AlegeusLineChartComponent implements OnInit {
  @Input() public lineChartOptions: LineChartOptionsInterface;
  public lineChartWidth: number;
  public lineChartWidth2: number;
  public showOption3Bar: boolean;
  public showTotalValueBar: boolean;

  private defaultOptions: LineChartOptionsInterface = (new LineChartOptions()).setHeaderText('')
    .setHeaderText1('').setTotalValue(0).setChartValue(0)
    .setChartOption1Text('').setChartOption2Text('');

  constructor() {
  }

  ngOnInit() {
    this.lineChartOptions = (this.lineChartOptions === null ||
      this.lineChartOptions === undefined) ? this.defaultOptions : this.lineChartOptions;

    this.lineChartOptions.totalValue = (this.lineChartOptions.totalValue === null ||
      this.lineChartOptions.totalValue === undefined) ? 0 : Number(this.lineChartOptions.totalValue);

    this.lineChartOptions.chartValue = (this.lineChartOptions.chartValue === null ||
      this.lineChartOptions.chartValue === undefined) ? 0 : Number(this.lineChartOptions.chartValue);

    this.lineChartOptions.chartOption3Value = (this.lineChartOptions.chartOption3Value === null ||
      this.lineChartOptions.chartOption3Value === undefined) ? 0 : Number(this.lineChartOptions.chartOption3Value);

    this.showOption3Bar = !!(this.lineChartOptions.showOption3 && this.lineChartOptions.chartOption3Value);
    this.showTotalValueBar = !!this.lineChartOptions.totalValue;

    this.lineChartWidth = (((this.lineChartOptions.totalValue / (this.lineChartOptions.totalValue + this.lineChartOptions.chartValue + this.lineChartOptions.chartOption3Value)) * 100) + 0.3);

    this.lineChartWidth2 = (((this.lineChartOptions.chartOption3Value / (this.lineChartOptions.totalValue + this.lineChartOptions.chartValue + this.lineChartOptions.chartOption3Value)) * 100)) + this.lineChartWidth;
    // this.lineChartWidth = 20;
    // this.lineChartWidth2 = 20 + this.lineChartWidth;
    // console.log(Number(this.lineChartOptions.chartValue));
    // console.log(Number(this.lineChartOptions.totalValue));
    // console.log(this.lineChartWidth);
  }

}
