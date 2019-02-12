import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';
import { FadFacilityProfileService } from './fad-facility-profile.service';
import {
  FadFacilityProfileRequestModelInterface,
  FadFacilityResponseModelInterface
} from '../modals/interfaces/fad-facility-profile-details.interface';
import { FadFacilityProfileRequestModel } from '../modals/fad-facility-profile-details.model';

@Injectable()
export class FadFacilityProfileResolver<T> implements
  Resolve<Promise<FadFacilityResponseModelInterface>> {
  constructor(private fadSearchResultsService: FadSearchResultsService,
    private errorHandler: BcbsmaerrorHandlerService,
    private router: Router,
    private fadFacilityProfileService: FadFacilityProfileService) { }

  async resolve(): Promise<FadFacilityResponseModelInterface> {

    try {
      const searchCriteria: FadLandingPageSearchControlValuesInterface = this.fadSearchResultsService.getSearchCriteria();
      // tslint:disable-next-line:radix
      const facilityProfileId = parseInt(sessionStorage.getItem('facilityProfileId'));
      // this.fadFacilityProfileService.facilityProfile;
      const networkId = (searchCriteria && searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
        searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId;
      const geoLocation = (searchCriteria && searchCriteria.getZipCode() && searchCriteria.getZipCode().geo) ?
        searchCriteria.getZipCode().geo : FadConstants.defaults.geo;

      const fadDoctorProfileRequestParams: FadFacilityProfileRequestModelInterface = new FadFacilityProfileRequestModel();
      fadDoctorProfileRequestParams.setGeoLocation(geoLocation)
        .setfacilityId(facilityProfileId)
        .setNetworkId(networkId);
      return await this.fadFacilityProfileService.getFadGetprofessionalprofileDetails(fadDoctorProfileRequestParams).toPromise();
    } catch (exception) {
      this.errorHandler.logError(exception, BcbsmaConstants.modules.fadModule, FadConstants.services.FadFacilityProfileResolver
        , FadConstants.methods.resolve);
    }
    return null;
  }
}
