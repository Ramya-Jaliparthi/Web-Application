import {
    MemberProfileGenericRequestModel,
    BaseDemographicInfoModel,
    MemberProfileGenericListEntityModel
} from './member-profile-generics.model';
import {
    GetDemographicInfoRequestModelInterface,
    GetDemographicInfoResponseModelInterface
} from './interfaces/get-demographic-info.interface';

// tslint:disable-next-line:no-empty-interface
export class GetDemographicInfoRequestModel extends MemberProfileGenericRequestModel
    implements GetDemographicInfoRequestModelInterface {

}

export class GetDemographicInfoResponseModel extends BaseDemographicInfoModel
    implements GetDemographicInfoResponseModelInterface {
    ethnicityList: MemberProfileGenericListEntityModel[];
    raceList: MemberProfileGenericListEntityModel[];
    languageList: MemberProfileGenericListEntityModel[];
    latinoOriginList: MemberProfileGenericListEntityModel[];
}

