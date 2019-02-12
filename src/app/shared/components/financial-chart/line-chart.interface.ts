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
    AnnualElection?: string;

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

    getAnnualElection(): string;
    setAnnualElection(AnnualElection: string): LineChartOptionsInterface;
}
