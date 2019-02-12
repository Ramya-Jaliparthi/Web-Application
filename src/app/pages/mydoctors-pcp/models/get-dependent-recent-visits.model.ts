import { VisitsResponse, MyDoctorsGenericRequestModel } from './my-doctor-module-common.model';
import {
    GetDependentRecentVisitsRequestModelInterface,
    GetDependentRecentVisitsResponseModelInterface
} from './interfaces/get-dependent-recent-visits-model.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class GetDependentRecentVisitsRequestModel extends MyDoctorsGenericRequestModel
    implements GetDependentRecentVisitsRequestModelInterface {
    dependentId: string;
}

export class GetDependentRecentVisitsResponseModel extends GeneralError
    implements GetDependentRecentVisitsResponseModelInterface {
    recentVisits: VisitsResponse[];
}
