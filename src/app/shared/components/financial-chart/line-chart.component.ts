import { Component, OnInit, Input } from '@angular/core';
import { LineChartOptionsInterface } from './line-chart.interface';
import { LineChartOptions } from './line-chart.model';

@Component({
  selector: 'app-financialchart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class FinancialChartComponent implements OnInit {
  @Input() public lineChartOptions: LineChartOptionsInterface;
  public lineChartWidth: number;
  private defaultOptions: LineChartOptionsInterface = (new LineChartOptions()).setHeaderText('')
    .setHeaderText1('').setTotalValue(0).setChartValue(0)
    .setChartOption1Text('').setChartOption2Text('');
  constructor() { }

  ngOnInit() {
    this.lineChartOptions = (this.lineChartOptions === null ||
      this.lineChartOptions === undefined) ? this.defaultOptions : this.lineChartOptions;

    this.lineChartOptions.totalValue = (this.lineChartOptions.totalValue === null ||
      this.lineChartOptions.totalValue === undefined) ? 0 : Number(this.lineChartOptions.totalValue);

    this.lineChartOptions.chartValue = (this.lineChartOptions.chartValue === null ||
      this.lineChartOptions.chartValue === undefined) ? 0 : Number(this.lineChartOptions.chartValue);

    this.lineChartWidth = (((this.lineChartOptions.totalValue / (this.lineChartOptions.totalValue + this.lineChartOptions.chartValue)) * 100) + 0.3);

    // console.log(Number(this.lineChartOptions.chartValue));
    // console.log(Number(this.lineChartOptions.totalValue));
    // console.log(this.lineChartWidth);
  }

}
