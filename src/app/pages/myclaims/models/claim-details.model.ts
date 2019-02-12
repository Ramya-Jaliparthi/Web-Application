import { EobLinkTextType, ClaimStatusType } from './types/claims.types';
import {
    ClaimDetailsRequestModelInterface, ClaimDetailsResponseModelInterface,
    ClaimDetailInterface, ClaimAddressModelInterface,
    ClaimTotalInterface, ClaimServiceLineInterface
} from './interfaces/claim-details-model.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class ClaimDetailsRequestModel extends MyBlueGeneralAPIRequestModel implements ClaimDetailsRequestModelInterface {
    claimId: string; // example: 1234567890000
    recordKey: string; // example: 123123
}

export class ClaimDetailsResponseModel implements ClaimDetailsResponseModelInterface {
    claimDetails: ClaimDetail;
    // Enum:  [ Explanation Of Benefits, Summary Of Health Plan Benefits, Summary Of Health Care Benefits ]
}

export class ClaimDetail implements ClaimDetailInterface {
    memberName: string; // example: John Smith
    memberType: string; //
    medicareFlag: boolean; // example: true    Enum:    [ true, false ]
    medexFlag: boolean; // example: true    Enum:    [ true, false ]
    claimId: string; // example: 1234567890000
    claimStatus: ClaimStatusType; // example: Denied    Enum:    [ Completed, Denied, Pending ]
    adjustedClaimFlag: boolean; // example: true    Enum:    [ true, false ]
    claimStatusDescription: string; //
    providerName: string; // example: Steven Michael MD
    providerAddress: ClaimAddressModel;
    claimsProviderFlag: boolean; // example: true    Enum:    [ true, false ]
    amountCovered: string; // example: 100
    amountOwed: string; // example: 100
    dateOfService: string; // example: 08/09/2018
    firstDateOfService: string; // example: 08/09/2018
    lastDateOfService: string; // example: 08/09/2018
    visitType: string; // example: CVS
    planName: string; // example: Plan 1
    claimTotals: ClaimTotal;
    claimServiceLines: ClaimServiceLine[];
    directPayIndicator: boolean;
    eobClaimId: string;
    eobLinkName: string;
    eobContractId: string;
    claimProcessDate: string;

}

export class ClaimAddressModel implements ClaimAddressModelInterface {
    address1: string; // example: 123 Street 1
    address2: string; // example: unit 123A
    city: string; // example: Boston
    state: string; // example: MA
    zipcode: string; // example: 12312
    phone: string; // example: 1234567890
    text: string;
}

export class ClaimTotal implements ClaimTotalInterface {
    amountCharged: number; // example: 100
    amountAllowed: number; // example: 100
    amountCoveredByBCBS: number; // example: 100
    amountCoveredByOthers: number; // example: 100
    coPayments: number; // example: 10
    appliedToDeductible: number;
    coinsurance: number;
    amountNotCovered: number; // example: 20
    amountOwed: number; // example: 40
}

export class ClaimServiceLine implements ClaimServiceLineInterface {
    amountCharged: number; // example: 100
    amountAllowed: number; // example: 100
    amountCoveredByBCBS: number; // example: 100
    amountCoveredByOthers: number; // example: 100
    coPayments: number; // example: 10
    appliedToDeductible: number; //
    coinsurance: number; //
    amountNotCovered: number; // example: 20
    amountOwed: number; // example: 40
}
