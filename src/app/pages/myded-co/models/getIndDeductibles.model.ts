import {
    GetIndDeductiblesRequestInterface,
    GetIndDeductiblesRequestForMemberInterface,
    GetIndDeductiblesResponseInterface
} from './interfaces/getIndDeductibles-model.interface';
import { DeductiblesAccums } from './myded-co-info.model';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class GetIndDeductiblesRequest implements GetIndDeductiblesRequestInterface {
    member: GetIndDeductiblesRequestForMember = new GetIndDeductiblesRequestForMember();
}

export class GetIndDeductiblesRequestForMember extends MyBlueGeneralAPIRequestModel implements GetIndDeductiblesRequestForMemberInterface {

    subscriberNo: string;
    memberSuffix: string;
    coverageType: string;

    getSubscriberNo(): string {
        return this.subscriberNo;
    }
    setSubscriberNo(subscriberNo: string): GetIndDeductiblesRequestForMember {
        this.subscriberNo = subscriberNo;
        return this;
    }
    getMemberSuffix(): string {
        return this.memberSuffix;
    }
    setMemberSuffix(memberSuffix: string): GetIndDeductiblesRequestForMember {
        this.memberSuffix = memberSuffix;
        return this;
    }
    getCoverageType(): string {
        return this.coverageType;
    }
    setCoverageType(coverageType: string): GetIndDeductiblesRequestForMember {
        this.coverageType = coverageType;
        return this;
    }
}

export class GetIndDeductiblesResponse extends GeneralError implements GetIndDeductiblesResponseInterface {
    accums: DeductiblesAccums[];
}




