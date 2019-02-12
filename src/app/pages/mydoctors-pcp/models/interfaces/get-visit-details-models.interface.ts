import { MyDoctorsGenericRequestModelInterface, VisitDetailInterface } from './my-doctor-module-common-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface GetVisitDetailsRequestModelInterface extends MyDoctorsGenericRequestModelInterface {
    providerNumber: string; // providerNumberstring  example: 70010000J12136
    providerName: string; // * providerNamestring  example: John Smith MD
}

export interface GetVisitDetailsResponseModelInterface extends GeneralErrorInterface {
    visitDetails: VisitDetailInterface;
}
