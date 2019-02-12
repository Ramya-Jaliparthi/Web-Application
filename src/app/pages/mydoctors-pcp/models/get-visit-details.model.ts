import { VisitDetail, MyDoctorsGenericRequestModel } from './my-doctor-module-common.model';
import {
    GetVisitDetailsResponseModelInterface,
    GetVisitDetailsRequestModelInterface
} from './interfaces/get-visit-details-models.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

export class GetVisitDetailsRequestModel extends MyDoctorsGenericRequestModel
    implements GetVisitDetailsRequestModelInterface {
    providerNumber: string; // providerNumberstring  example: 70010000J12136
    providerName: string; // * providerNamestring  example: John Smith MD
}

export class GetVisitDetailsResponseModel extends GeneralError implements GetVisitDetailsResponseModelInterface {
    visitDetails: VisitDetail;
}
