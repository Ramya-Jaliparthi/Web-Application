import { ClaimStatusType } from './types/claims.types';
import {
    ClaimProcessingStatusRequestModelInterface,
    ClaimProcessingStatusResponseModelInterface,
    ClaimStatusRecordInterface
} from './interfaces/claim-processing-data-model.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class ClaimProcessingStatusRequestModel extends MyBlueGeneralAPIRequestModel implements ClaimProcessingStatusRequestModelInterface {
    claimId: string;
    recordKey: string;
}

export class ClaimProcessingStatusResponseModel implements ClaimProcessingStatusResponseModelInterface {
    statusRecord: ClaimStatusRecord;
}

export class ClaimStatusRecord implements ClaimStatusRecordInterface {
    claimId: string; // example: 123456789000
    claimStatus: ClaimStatusType; // example: Completed  Enum:  [ Completed, Denied, Pending ]
    dateOfService: string; // example: 08/09/2018
    firstDateOfService: string; // example: 08/09/2018
    lastDateOfService: string; // example: 08/09/2018
    recievedDate: string; // example: 08/09/2018
    completedDate: string; // example: 08/09/2018
    memberName?: string;
}
