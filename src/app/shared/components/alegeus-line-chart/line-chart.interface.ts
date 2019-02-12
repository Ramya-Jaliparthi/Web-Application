export interface LineChartOptionsInterface {
  headerText?: string;
  headerText1?: string;
  totalValue?: number;
  chartValue?: number;
  chartColor?: string;
  chartBackgroundColor?: string;
  chartOption1Text?: string;
  chartOption2Text?: string;
  altText?: string;
  AnnualElection?: number;
  chartOption3Text?: string;
  chartOption3Value?: number;
  chartOption3BackgroundColor?: string;
  showOption3?: boolean;
  currentYear?: number;
  roolOverYear?: number;

  getHeaderText(): string;
  setHeaderText(headerText: string): LineChartOptionsInterface;

  getHeaderText1(): string;
  setHeaderText1(headerText1: string): LineChartOptionsInterface;

  getTotalValue(): number;
  setTotalValue(totalValue: number): LineChartOptionsInterface;

  getChartValue(): number;
  setChartValue(chartValue: number): LineChartOptionsInterface;

  getChartColor(): string;
  setChartColor(chartColor: string): LineChartOptionsInterface;

  getChartBackgroundColor(): string;
  setChartBackgroundColor(chartBackgroundColor: string): LineChartOptionsInterface;

  getChartOption1Text(): string;
  setChartOption1Text(chartOption1Text: string): LineChartOptionsInterface;

  getChartOption2Text(): string;
  setChartOption2Text(chartOption2Text: string): LineChartOptionsInterface;

  getAltText(): string;
  setAltText(altText: string): LineChartOptionsInterface;

  getAnnualElection(): number;
  setAnnualElection(AnnualElection: number): LineChartOptionsInterface;

  getChartOption3Text(): string;
  setChartOption3Text(chartOption3Text: string): LineChartOptionsInterface;

  getChartOption3Value(): number;
  setChartOption3Value(chartOption3Value: number): LineChartOptionsInterface;

  getChartOption3BackgroundColor(): string;
  setChartOption3BackgroundColor(chartOption3BackgroundColor: string): LineChartOptionsInterface;

  getShowOption3(): boolean;
  setShowOption3(showOption3: boolean): LineChartOptionsInterface;

  getCurrentYear(): number;
  setCurrentYear(currentYear: number): LineChartOptionsInterface;

  getRollOverYear(): number;
  setRollOverYear(roolOverYear: number): LineChartOptionsInterface;
}
