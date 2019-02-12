
import { MemberProfileGenericResponseModel, BaseDemographicInfoModel } from './member-profile-generics.model';
import {
    UpdateDemographicInfoResponseModelInterface,
    UpdateDemographicInfoRequestModelInterface
} from './interfaces/update-demographic-info.interface';


// tslint:disable-next-line:no-empty-interface
export class UpdateDemographicInfoRequestModel extends BaseDemographicInfoModel
    implements UpdateDemographicInfoRequestModelInterface {

}

// tslint:disable-next-line:no-empty-interface
export class UpdateDemographicInfoResponseModel extends MemberProfileGenericResponseModel
    implements UpdateDemographicInfoResponseModelInterface {

}
