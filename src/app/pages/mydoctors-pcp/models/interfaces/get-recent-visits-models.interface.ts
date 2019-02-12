
import { VisitsResponseInterface, MyDoctorsGenericRequestModelInterface } from './my-doctor-module-common-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetRecentVisitsRequestModelInterface extends MyDoctorsGenericRequestModelInterface {

}

export interface GetRecentVisitsResponseModelInterface extends GeneralErrorInterface {
    recentVisits: VisitsResponseInterface[];
}
