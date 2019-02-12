import { LineChartOptionsInterface } from '../../../../shared/components/alegeus-line-chart/line-chart.interface';
import { FilterOptionInterface } from '../../../../shared/components/filter/filter-model.interface';
import { InOrOut, DetuctiblesCoverageType } from '../types/myded-co.types';

export interface MyDedCoInfoLineChartModelInterface {
  lineChartOptions: LineChartOptionsInterface;
  limitationText: string;
  exceptionText: string;
  inOutNetworkText: string;
  altText?: string;
}

export interface MyDedCoSegragatedMemberListModelInterface {
  medicalMembers: FilterOptionInterface[];
  dentalMembers: FilterOptionInterface[];

  getMedicalMembers(): FilterOptionInterface[];
  getDentalMembers(): FilterOptionInterface[];

  setMedicalMembers(medicalMembers: FilterOptionInterface[]): MyDedCoSegragatedMemberListModelInterface;
  setDentalMembers(dentalMembers: FilterOptionInterface[]): MyDedCoSegragatedMemberListModelInterface;

}

export interface DeductiblesAccumsInterface {
  planName: string; // example: Preferred Blue PPO SAVER
  planStartDate: string; // example: 2017 - 12 - 31 pattern: yyyy - MM - dd
  planEndDate: string; // example: 2018 - 12 - 31 pattern: yyyy - MM - dd
  planTypeFlag: string; // example: 111 111 - Subscriber & Spose, 127 Sub, SposeDependent, 101, Subscriber only 4119

  coverageType: DetuctiblesCoverageType; // Enum: 'Medical' | 'Dental'
  cobundledPlanFlag: string; //
  uaCovgCode: string; //
  blueChoiceFlag: string; //
  unionChoiceFlag: string; //
  saverFlag: string; //
  healthPlanTypeDescription: string; //
  benefitName: string; //

  coinsurance: CoinsuranceInterface[];

  overallDeductables: OverallDeductablesInterface[];

  outOfPocket: OutofpocketInterface[];

  overallBenefit: OverallBenefitInterface[];

}


export interface CoinsuranceInterface {
  networkIndicatorForCoinsurance: InOrOut;
  coinsuranceMax: string;
  coinsuranceContributed: string;
  coinsuranceRemainingMeet: string;
  coinsuraneexclusionExcep: string;
  coinsuranceLimitationContent: string;
}

export interface OverallDeductablesInterface {
  networkIndicatorForOverallDeductible: InOrOut;
  overallDeductible: string;
  deductibleContributed: string;
  deductibleRemainingToMeet: string;
  overallDeductibleExclusionExcep: string;
  overallDeductibleLimitationContent: string;
}

export interface OutofpocketInterface {
  networkIndicatorForOutOfPocketMax: InOrOut;
  outOfPocketMax: number;
  oopMaxContributed: number;
  oopMaxRemainingToMeet: string;
  oopMaxExclusionExcep: string;
  oopMaxLimitationContent: string;
}

export interface OverallBenefitInterface {
  networkIndicatorOverallBenefit: InOrOut;
  overallBenefitMax: number;
  overallBenefitMaxContributed: number;
  overallBenefitMaxRemainingToMeet: string;
  overallBenefitexclusionExcep: string;
  overallBenefitMaxLimitationContent: string;
}
