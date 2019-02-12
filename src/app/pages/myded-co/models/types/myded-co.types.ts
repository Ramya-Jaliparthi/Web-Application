export type DetuctiblesCoverageType = 'Medical' | 'Dental';
export type InOrOut = 'In' | 'Out' | 'In/Out';
export enum MemberType {
    Subscriber = 0,
    Family = 1
}

export enum AccumChartType {
    Coinsurance,
    overallDeductables,
    outOfPocket,
    overallBenefit
}
