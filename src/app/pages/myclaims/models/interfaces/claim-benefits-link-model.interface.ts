import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface ClaimBenefitsLinkRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

    eobClaimId: string; // example: 1234567890000
    recordKey: string;
    eobContractId: string;
    claimProcessDate: string;
}

export interface ClaimBenefitsLinkResponseModelInterface {
    eobLink: string; // example: https://abcdefgh12345.pdf
}
