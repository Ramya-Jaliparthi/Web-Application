
import { LineChartOptionsInterface } from '../../../shared/components/alegeus-line-chart/line-chart.interface';
import {
  MyDedCoInfoLineChartModelInterface,
  MyDedCoSegragatedMemberListModelInterface,
  CoinsuranceInterface,
  OverallDeductablesInterface,
  OutofpocketInterface,
  OverallBenefitInterface,
  DeductiblesAccumsInterface
} from './interfaces/myded-co-info-model.interface';
import { FilterOptionInterface } from '../../../shared/components/filter/filter-model.interface';
import { DetuctiblesCoverageType } from './types/myded-co.types';



export class MyDedCoInfoLineChartModel implements MyDedCoInfoLineChartModelInterface {
  lineChartOptions: LineChartOptionsInterface;
  limitationText: string;
  exceptionText: string;
  inOutNetworkText: string = '';
  altText?: string;
}

export class MyDedCoSegragatedMemberListModel implements MyDedCoSegragatedMemberListModelInterface {
  medicalMembers: FilterOptionInterface[];
  dentalMembers: FilterOptionInterface[];

  getMedicalMembers(): FilterOptionInterface[] {
    return this.medicalMembers;
  }

  getDentalMembers(): FilterOptionInterface[] {
    return this.dentalMembers;
  }

  setMedicalMembers(medicalMembers: FilterOptionInterface[]): MyDedCoSegragatedMemberListModel {
    this.medicalMembers = medicalMembers;
    return this;
  }
  setDentalMembers(dentalMembers: FilterOptionInterface[]): MyDedCoSegragatedMemberListModel {
    this.dentalMembers = dentalMembers;
    return this;
  }

}

export class DeductiblesAccums implements DeductiblesAccumsInterface {
  planName: string; // example: Preferred Blue PPO SAVER
  planStartDate: string; // example: 2017 - 12 - 31 pattern: yyyy - MM - dd
  planEndDate: string; // example: 2018 - 12 - 31 pattern: yyyy - MM - dd
  planTypeFlag: string; // example: 111 111 - Subscriber & Spose, 127 Sub, SposeDependent, 101, Subscriber only 4119
  coverageType: DetuctiblesCoverageType; // Enum: 'Medical' | 'Dental'
  cobundledPlanFlag: string;
  uaCovgCode: string;
  blueChoiceFlag: string;
  unionChoiceFlag: string;
  saverFlag: string;
  coinsuranceMaxFam: string;
  coinsuranceContributedFam: string;
  coinsuranceRemainingMeetFam: string;
  healthPlanTypeDescription: string;
  benefitName: string;
  overallBenefitMaxFam: string;
  overallBenefitMaxContributedFam: string;
  overallBenefitMaxRemainingToMeetFam: string;
  results: string;
  exclusionExcepFam: string;

  coinsurance: CoinsuranceInterface[];
  // coinsurance1: CoinsuranceInterface;
  // coinsurance2: CoinsuranceInterface;

  overallDeductables: OverallDeductablesInterface[];
  // overallDeductables1: OverallDeductablesInterface;
  // overallDeductables2: OverallDeductablesInterface;

  outOfPocket: OutofpocketInterface[];
  // outOfPocket1: OutofpocketInterface;
  // outOfPocket2: OutofpocketInterface;

  overallBenefit: OverallBenefitInterface[];
  // overallBenefit1: OverallBenefitInterface;
  // overallBenefit2: OverallBenefitInterface;
}


