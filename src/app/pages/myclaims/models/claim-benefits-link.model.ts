import {
    ClaimBenefitsLinkRequestModelInterface,
    ClaimBenefitsLinkResponseModelInterface
} from './interfaces/claim-benefits-link-model.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class ClaimBenefitsLinkRequestModel extends MyBlueGeneralAPIRequestModel implements ClaimBenefitsLinkRequestModelInterface {
    eobClaimId: string; // example: 1234567890000
    recordKey: string;
    eobContractId: string;
    claimProcessDate: string;
}

export class ClaimBenefitsLinkResponseModel implements ClaimBenefitsLinkResponseModelInterface {
    eobLink: string; // example: https://abcdefgh12345.pdf
}
