import { Component, OnInit, Input } from '@angular/core';
import { LineChartOptionsInterface } from './line-chart.interface';
import { LineChartOptions } from './line-chart.model';

@Component({
  selector: 'app-linechart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent implements OnInit {
  @Input() public lineChartOptions: LineChartOptionsInterface;
  public lineChartWidth: number;
  public lineChartRemaining: number;
  private defaultOptions: LineChartOptionsInterface = (new LineChartOptions()).setHeaderText('')
    .setHeaderText1('').setTotalValue(0).setChartValue(0)
    .setChartOption1Text('').setChartOption2Text('');
  constructor() { }

  ngOnInit() {
    this.lineChartOptions = (this.lineChartOptions === null ||
      this.lineChartOptions === undefined) ? this.defaultOptions : this.lineChartOptions;
    this.lineChartOptions.totalValue = (this.lineChartOptions.totalValue === null ||
      this.lineChartOptions.totalValue === undefined) ? 0 : this.lineChartOptions.totalValue;
    this.lineChartOptions.chartValue = (this.lineChartOptions.chartValue === null ||
      this.lineChartOptions.chartValue === undefined) ? 0 : this.lineChartOptions.chartValue;
    this.lineChartRemaining = this.lineChartOptions.totalValue - this.lineChartOptions.chartValue;
    this.lineChartWidth = (((this.lineChartOptions.chartValue / this.lineChartOptions.totalValue) * 100) + 0.3);
  }

}
