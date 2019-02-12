import {
    GetRequestEstimateDetailsResponseModelInterface,
    GetRequestEstimateDetailsRequestModelInterface
} from './interfaces/get-request-estimate-details-models.interface';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class GetRequestEstimateDetailsRequestModel extends MyBlueGeneralAPIRequestModel
    implements GetRequestEstimateDetailsRequestModelInterface {

}

export class GetRequestEstimateDetailsResponseModel extends GeneralError implements GetRequestEstimateDetailsResponseModelInterface {
    subscriberId: string; // example: 9 digit Subscriber Identifier
    isEmployee: boolean; // example: true Member is Employee of BCBS MA
    emailAddress: string; // example: Member Email Address
    phoneNumber: string; // example: Member Phone Number
    address1: string; // example: Logged-in Member Street Address
    address2: string; // Member Address2
    city: string; // Member City
    state: string; // Member State
    zip: string; // Member Zip Code
}
