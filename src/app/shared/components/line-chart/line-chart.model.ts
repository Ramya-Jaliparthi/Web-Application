import {LineChartOptionsInterface} from './line-chart.interface';

export class LineChartOptions implements LineChartOptionsInterface {
  headerText?: string;
  headerText1?: string;
  totalValue?: number;
  chartValue?: number;
  chartColor?: string;
  chartBackgroundColor?: string;
  chartOption1Text?: string;
  chartOption2Text?: string;
  altText?: string;
  AnnualElection?: string;

  public getHeaderText(): string {
    return this.headerText;
  }

  public setHeaderText(headerText: string): LineChartOptionsInterface {
    this.headerText = headerText;
    return this;
  }

  public getAnnualElection(): string {
    return this.AnnualElection;
  }

  public setAnnualElection(AnnualElection: string): LineChartOptionsInterface {
    this.AnnualElection = AnnualElection;
    return this;
  }

  public getHeaderText1(): string {
    return this.headerText1;
  }

  public setHeaderText1(headerText1: string): LineChartOptionsInterface {
    this.headerText1 = headerText1;
    return this;
  }

  public getTotalValue(): number {
    return this.totalValue;
  }

  public setTotalValue(totalValue: number): LineChartOptionsInterface {
    this.totalValue = totalValue;
    return this;
  }

  public getChartValue(): number {
    return this.chartValue;
  }

  public setChartValue(chartValue: number): LineChartOptionsInterface {
    this.chartValue = chartValue;
    return this;
  }

  public getChartColor(): string {
    return this.chartColor;
  }

  public setChartColor(chartColor: string): LineChartOptionsInterface {
    this.chartColor = chartColor;
    return this;
  }

  public getChartBackgroundColor(): string {
    return this.chartBackgroundColor;
  }

  public setChartBackgroundColor(chartBackgroundColor: string): LineChartOptionsInterface {
    this.chartBackgroundColor = chartBackgroundColor;
    return this;
  }

  getChartOption1Text(): string {
    return this.chartOption1Text;
  }

  setChartOption1Text(chartOption1Text: string): LineChartOptionsInterface {
    this.chartOption1Text = chartOption1Text;
    return this;
  }

  public getChartOption2Text(): string {
    return this.chartOption2Text;
  }

  public setChartOption2Text(chartOption2Text: string): LineChartOptionsInterface {
    this.chartOption2Text = chartOption2Text;
    return this;
  }

  public getAltText(): string {
    return this.altText;
  }

  public setAltText(altText: string): LineChartOptionsInterface {
    this.altText = altText;
    return this;
  }

}
