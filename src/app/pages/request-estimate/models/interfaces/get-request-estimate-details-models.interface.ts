import {
    GeneralErrorInterface,
    MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetRequestEstimateDetailsRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

}

export interface GetRequestEstimateDetailsResponseModelInterface extends GeneralErrorInterface {
    subscriberId: string; // example:        9 digit Subscriber Identifier
    isEmployee: boolean; // example: true        Member is Employee of BCBS MA
    emailAddress: string; // example:        Member Email Address
    phoneNumber: string; // example:        Member Phone Number
    address1: string; // example:        Logged-in Member Street Address
    address2: string; // Member Address2
    city: string; // Member City
    state: string; // Member State
    zip: string; // Member Zip Code
}
