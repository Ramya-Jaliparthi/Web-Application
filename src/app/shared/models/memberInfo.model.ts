export class MemberInfo {
  memFistName: string;
  memLastName: string;
  relationship: string;
  hasDependents: boolean;
  clmAllowAmt: string;
  clmDOS: string;
  clmICN: number;
  clmPaidAmt: string;
  clmPaymtStatus: string;
  clmPrvName: string;
  memGender: string;
  clmSrvType: string;
  clmStatus: string;
  hasALG: string;
  hasHEQ: string;
  lastLoginDt: string;
  memMidInit: string;
  numOfClmsSinceLastLogin: string;
  rxDispDt: string;
  rxDispPrvCity: string;
  rxDispPrvName: string;
  rxDispPrvNum: string;
  rxDispPrvPhone: string;
  rxDispPrvState: string;
  rxDispPrvStreet: string;
  rxDispPrvZip: string;
  rxDrugName: string;
  rxNSDC: string;
  rxPrescPhone: string;
  rxPrescPrvName: string;
  rxPrescPrvNum: string;
  rxStrength: string;
  visitCity: string;
  visitPhone: string;
  visitPrvName: string;
  visitPrvNum: string;
  visitSpec: string;
  visitState: string;
  visitStreet: string;
  visitSvcDate: string;
  visitZip: string;
  member_id: string;
  userState: string;
  userType: string;
  memMedexFlag: string; // Verify  is this needed with FRD >
  memMedicareFlag: string;
  hasSS: string;
  clmLastDOS: string; // or clmDOS -> Wats the diff?
  clmYouOweAmt: string;
  clmCopay: string;
  unreadMessageCount: string;
  visitLastSvcDate: string;
  rxDrugType: string;
  rxCoPay: string;
  rxLastFillDate: string;
  rxUniquePersonId: string;
  rxNDCCode: string;
  rxIncurredDate: string;
  planName: string;
  planType: string;
  groupNumber: string;
  groupName: string;
  planEffectiveDate: string;

  get fullName() {
    return `${this.memFistName} ${this.memLastName}`;
  }

  get fullMemInfo() {
    return `${this.memFistName} ${this.memLastName} (${this.relationship})`;
  }

  deserialize(obj) {
    this.memFistName = obj.memFistName;
    this.memLastName = obj.memLastName;
    this.relationship = obj.relationship;
    this.clmAllowAmt = obj.clmAllowAmt;
    this.clmDOS = obj.clmDOS;
    this.clmICN = obj.clmICN;
    this.clmPaidAmt = obj.clmPaidAmt;
    this.clmPaymtStatus = obj.clmPaymtStatus;
    this.clmPrvName = obj.clmPrvName;
    this.hasDependents = obj.hasDependents;
    this.memGender = obj.memGender;
    this.clmSrvType = obj.clmSrvType;
    this.clmStatus = obj.clmStatus;
    this.hasALG = obj.hasALG;
    this.hasHEQ = obj.hasHEQ;
    this.lastLoginDt = obj.lastLoginDt;
    this.memMidInit = obj.memMidInit;
    this.numOfClmsSinceLastLogin = obj.numOfClmsSinceLastLogin;
    this.rxDispDt = obj.rxDispDt;
    this.rxDispPrvCity = obj.rxDispPrvCity;
    this.rxDispPrvName = obj.rxDispPrvName;
    this.rxDispPrvNum = obj.rxDispPrvNum;
    this.rxDispPrvPhone = obj.rxDispPrvPhone;
    this.rxDispPrvState = obj.rxDispPrvState;
    this.rxDispPrvStreet = obj.rxDispPrvStreet;
    this.rxDispPrvZip = obj.rxDispPrvZip;
    this.rxDrugName = obj.rxDrugName;
    this.rxNSDC = obj.rxNSDC;
    this.rxPrescPhone = obj.rxPrescPhone;
    this.rxPrescPrvName = obj.rxPrescPrvName;
    this.rxPrescPrvNum = obj.rxPrescPrvNum;
    this.rxStrength = obj.rxStrength;
    this.visitCity = obj.visitCity;
    this.visitPhone = obj.visitPhone;
    this.visitPrvName = obj.visitPrvName;
    this.visitPrvNum = obj.visitPrvNum;
    this.visitSpec = obj.visitSpec;
    this.visitState = obj.visitState;
    this.visitStreet = obj.visitStreet;
    this.visitSvcDate = obj.visitSvcDate;
    this.visitZip = obj.visitZip;
    this.member_id = obj.member_id;
    this.userState = obj.userState;
    this.userType = obj.userType;
    this.memMedexFlag = obj.memMedexFlag;
    this.memMedicareFlag = obj.memMedicareFlag;
    this.hasSS = obj.hasSS;
    this.clmLastDOS = obj.clmLastDOS;
    this.clmYouOweAmt = obj.clmYouOweAmt;
    this.clmCopay = obj.clmCopay;
    this.unreadMessageCount = obj.unreadMessageCount;
    this.visitLastSvcDate = obj.visitLastSvcDate;
    this.rxDrugType = obj.rxDrugType;
    this.rxCoPay = obj.rxCoPay;
    this.rxLastFillDate = obj.rxLastFillDate;
    this.rxUniquePersonId = obj.rxUniquePersonId;
    this.rxNDCCode = obj.rxNDCCode;
    this.rxIncurredDate = obj.rxIncurredDate;
    this.planName = obj.planName;
    this.planType = obj.planType;
    this.groupNumber = obj.groupNumber;
    this.groupName = obj.groupName;
    this.planEffectiveDate = obj.planEffectiveDate;
    return this;
  }
}

