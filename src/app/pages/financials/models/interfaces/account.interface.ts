export interface AccountSummaryModelInterface extends AccountDetailInfoInterface {
  AccountDetailInfo: AccountDetailInfoInterface;
  AccountDisplayHeader: string;
  AccountDisplayOptions: number;
  AccountTypeOptions: number;
  PlanEndDate: string;
  PlanStartDate: string;
}

export interface AccountSummaryTypeInterface extends AccountSummaryModelInterface {
    accountType: string;
    AcctStatusCde: number;
    AcctTypeClassCde: number;
    FlexAccountKey: number;
}

export interface AccountDetailsRequestModelInterface {
    participantId: number;
    flexaccountkey: number;
    accttypecode: string;
    planyear: number;
    useridin: string;
}

export interface AccountDetailInfoInterface extends AccountInfoInterface, AccountPayRollInfoInterface, FamilyDetailInfoInterface,
  DeductibleInfoInterface {
    AccountDisplayOptions: number;
    AccountEndDate:	string;
    AccountInfo:	AccountInfoInterface[];
    AccountPayRollInfo:	AccountPayRollInfoInterface;
    AccountStartDate:	string;
    AccountType:	string;
    AccountDisplayHeader: string;
    AccountTypeOptions:	number;
    AcctTypeClassCde: number;
    BalanceDue:	number;
    CurrentDate:	string;
    Deductible:	number;
    DeductibleApplied:	number;
    DeductibleRemaining:	number;
    IsHRA:	boolean;
    RemainingBalance:	number;
    SpendingLastDate:	string;
    Spent:	number;
    SubmitClaimsLastDate:	string;
    availBalance: number;
    contributionsYTD: number;
    remainingContributions: number;
    planStartDate: string;
    planEndDate: string;
    payments: number;
    planYear: number;
    accountType: string;
    availableRollover: number;
    annualElection: number;
    balance: number;
    availableRollOver: number;
    currentyear: number;
    rolloveryear: number;
    submitClaimsLastDate: string;
    spendingLastDate: string;
    deductibleInfo:  DeductibleInfoInterface[];
    familyDetailInfo: FamilyDetailInfoInterface[];
}

export interface FamilyDetailInfoInterface {
  firstName: string;
  lastName: string;
  middleInitial: string;
  status: string;
}

export interface DeductibleInfoInterface {
  deductible: number;
  appliedDeductible: number;
  remainingDeductible: number;
}

export interface AccountPayRollInfoInterface {
    AutoDepositCalendarKey:	number;
    ContributionsYTD:	number;
    EmployeePPPContribution:	number;
    EmployerPPPContributionsAmount:	number;
    PayrollCycle:	number;
    PlanEndDate:	string;
    PlanStartDate:	string;
    RemainingContributions:	number;
}

export interface AccountInfoInterface {
    AadditionalDeposits:	number;
    Balance:	number;
    DepFlexAcctStatus:	number;
    DepStatus:	number;
    EmpeFlexAcctStatus:	number;
    EmpeRelation:	number;
    FirstName:	string;
    FlexAcctKey:	number;
    IndividualAmount:	number;
    Initial:	string;
    IsDep:	boolean;
    LastName:	string;
    Payments:	number;
    Status:	number;
}

export interface TermsConditionsInterface {
    title: string;
    body: string;
}
