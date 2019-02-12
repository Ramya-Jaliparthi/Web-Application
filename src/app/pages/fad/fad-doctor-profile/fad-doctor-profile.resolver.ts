import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { FadDoctorProfileService } from './fad-doctor-profile.service';
import {
  FadProfessionalResponseModelInterface,
  FadDoctorProfileRequestModelInterface
} from '../modals/interfaces/fad-doctor-profile-details.interface';
import { FadDoctorProfileRequestModel } from '../modals/fad-doctor-profile-details.model';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';

@Injectable()
export class FadDoctorProfileResolver<T> implements
  Resolve<Promise<FadProfessionalResponseModelInterface>> {
  constructor(private fadSearchResultsService: FadSearchResultsService,
    private fadDoctorProfileService: FadDoctorProfileService,
    private errorHandler: BcbsmaerrorHandlerService,
    private router: Router,
    private doctorProfileService: FadDoctorProfileService) { }

  async resolve(): Promise<FadProfessionalResponseModelInterface> {

    try {
      const searchCriteria: FadLandingPageSearchControlValuesInterface = this.fadSearchResultsService.getSearchCriteria();

      // tslint:disable-next-line:radix
      const professionalId = parseInt(sessionStorage.getItem('professionalId'));
      // this.doctorProfileService.doctorProfile;
      const networkId = (searchCriteria && searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
        searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId;
      const geoLocation = (searchCriteria && searchCriteria.getZipCode() && searchCriteria.getZipCode().geo) ?
        searchCriteria.getZipCode().geo : FadConstants.defaults.geo;

      const fadDoctorProfileRequestParams: FadDoctorProfileRequestModelInterface = new FadDoctorProfileRequestModel();
      fadDoctorProfileRequestParams.setGeoLocation(geoLocation)
        .setProfessional(professionalId)
        .setNetworkId(networkId);

      return await this.fadDoctorProfileService.getFadGetprofessionalprofileDetails(fadDoctorProfileRequestParams).toPromise();
    } catch (exception) {
      this.errorHandler.logError(exception, BcbsmaConstants.modules.fadModule, FadConstants.services.fadDoctorProfileResolver
        , FadConstants.methods.resolve);
    }
    return null;
  }
}
