import {
    MemberProfileGenericRequestModelInterface,
    MemberProfileGenericListEntityModelInterface,
    BaseDemographicInfoModelInterface
} from './member-profile-generics.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetDemographicInfoRequestModelInterface extends MemberProfileGenericRequestModelInterface {

}

export interface GetDemographicInfoResponseModelInterface extends BaseDemographicInfoModelInterface {
    ethnicityList: MemberProfileGenericListEntityModelInterface[];
    raceList: MemberProfileGenericListEntityModelInterface[];
    languageList: MemberProfileGenericListEntityModelInterface[];
    latinoOriginList: MemberProfileGenericListEntityModelInterface[];
}

