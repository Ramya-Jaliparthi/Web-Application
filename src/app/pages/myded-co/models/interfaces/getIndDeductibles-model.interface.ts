import {
    GeneralErrorInterface, MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';
import { DeductiblesAccumsInterface } from './myded-co-info-model.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetIndDeductiblesRequestInterface {
    member: GetIndDeductiblesRequestForMemberInterface;
}

export interface GetIndDeductiblesRequestForMemberInterface extends MyBlueGeneralAPIRequestModelInterface {
    subscriberNo: string;
    memberSuffix: string;
    coverageType: string;

    getSubscriberNo(): string;
    setSubscriberNo(subscriberNo: string): GetIndDeductiblesRequestForMemberInterface;
    getMemberSuffix(): string;
    setMemberSuffix(memberSuffix: string): GetIndDeductiblesRequestForMemberInterface;
    getCoverageType(): string;
    setCoverageType(coverageType: string): GetIndDeductiblesRequestForMemberInterface;
}


export interface GetIndDeductiblesResponseInterface extends GeneralErrorInterface {
    accums: DeductiblesAccumsInterface | DeductiblesAccumsInterface[];
}




