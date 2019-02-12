export enum Status {
  Complete = <any>'C',
  Denied = <any>'D',
  Pending = <any>'P'
}

export class Claim {
  DOS: string;      // Date of Service
  SvcType: string;  // Service Type
  PrvName: string;  // Provider Name
  MemOwedAmt: string; // Amount you owe
  ClmStat: Status;  // Status
  RowNum: string;

  constructor(responseObj) {
    this.DOS = responseObj.DOS;
    this.SvcType = responseObj.SvcType;
    this.PrvName = responseObj.PrvName;
    this.MemOwedAmt = responseObj.MemOwedAmt;
    this.ClmStat = responseObj.ClmStat;
    this.RowNum = responseObj.RowNum;
  }

}

export class Medication {
  BrandName: string;
  DispCity: string;
  DispDt: string;
  DispName: string;
  DispPh: string;
  DispState: string;
  DispStreet: string;
  DispZip: string;
  GenericName: string;
  PrescName: string;
  PrescPh: string;
  QtyDisp: number;
  RowNum: number;
  Strength: string;
  addressStr: string;
  date: string;
  MemberInfo: string;
  DependentId: number;
}

export class MyClaims {
  DOS: string;
  billedAmt: number;
  clmStatus: string;
  clm_paymt_stat: string;
  firstDOS: string;
  intClmNum: number;
  isDependent: boolean;
  lastDOS: string;
  memDOB: string;
  memFName: string;
  memLName: string;
  memNum: number;
  prescribingProvName: string;
  provName: string;
  subNum: number;
  svcType: string;
  youOweAmt: number;
  displayMemName: string;
  date: Date;
  MemberInfo: string;
  DependentId: number;
}

export class FilterModel {
  useridin: string;
  param1: string;
  param2: string;
}

export class RadioList {
  value: string;
  checked: boolean;
}

export class ClaimsId {
  useridin: string;
  param1: string;
}

export class ClaimsDetails {
  alldAmt: number;
  coinsAmt: number;
  billedAmt: number;
  notCovAmt: number;
  provName: string;
  RowNum: number;
  copayAmt: number;
  clmStatus: string;
  paidAmt: number;
  otherInsurance: number;
  recDt: string;
  intClmNum: number;
  serviceType: string;
  subNum: number;
  msgSpecified: boolean;
  memFName: string;
  memNum: number;
  svcType: string;
  youOweAmt: number;
  prvSubAmt: number;
  statusDt: string;
  dedAmt: number;
  clmPaymtStatus: string;
  DOS: string;
  lineMsg: string;
}

export class SelectionList {
  value: string;
  selected: boolean;
}

export class MockClaim {
  DOS: string;
  billedAmt: number;
  clmStatus: string;
  clm_paymt_stat: string;
  firstDOS: string;
  intClmNum: number;
  isDependent: boolean;
  lastDOS: string;
  memDOB: string;
  memFName: string;
  memLName: string;
  memNum: number;
  prescribingProvName: string;
  provName: string;
  subNum: number;
  svcType: string;
  youOweAmt: number;
  displayMemName: string;
  date: Date;

}
