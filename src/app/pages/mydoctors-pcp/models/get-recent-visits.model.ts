import { MyDoctorsGenericRequestModel, VisitsResponse } from './my-doctor-module-common.model';
import {
    GetRecentVisitsRequestModelInterface,
    GetRecentVisitsResponseModelInterface
} from './interfaces/get-recent-visits-models.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class GetRecentVisitsRequestModel extends MyDoctorsGenericRequestModel
    implements GetRecentVisitsRequestModelInterface {

}

export class GetRecentVisitsResponseModel extends GeneralError implements GetRecentVisitsResponseModelInterface {
    recentVisits: VisitsResponse[];
}
