import { BaseRecentRxResponseModel } from './my-medications-generic.models';
import { RecentRxRequestModelInterface, RecentRxResponseModelInterface } from './interfaces/recent-rx-model.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class RecentRxRequestModel extends MyBlueGeneralAPIRequestModel implements RecentRxRequestModelInterface {

}

// tslint:disable-next-line:no-empty-interface
export class RecentRxResponseModel extends BaseRecentRxResponseModel implements RecentRxResponseModelInterface {

}


