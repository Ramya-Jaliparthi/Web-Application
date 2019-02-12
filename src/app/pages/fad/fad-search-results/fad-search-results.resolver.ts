import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { FadSearchResultsService } from './fad-search-results.service';
import {
  GetSearchByProfessionalRequestModelInterface,
  GetSearchByProfessionalResponseModelInterface
} from '../modals/interfaces/getSearchByProfessional-models.interface';
import { GetSearchByProfessionalRequestModel } from '../modals/getSearchByProfessional.model';
import { FadConstants } from '../constants/fad.constants';
import { FadResouceTypeCodeConfig } from '../modals/types/fad.types';
import {
  GetSearchByFacilityRequestModelInterface,
  GetSearchByFacilityResponseModelInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { GetSearchByFacilityRequestModel } from '../modals/getSearchByFacility.model';
import {
  FadLandingPageSearchControlValuesInterface,
  FadAutoCompleteComplexOptionInterface
} from '../modals/interfaces/fad-landing-page.interface';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
// import { FadAutoCompleteComplexOption } from '../modals/fad-landing-page.modal';

@Injectable()
export class FadSearchResultsResolver<T> implements
  Resolve<Promise<GetSearchByProfessionalResponseModelInterface | GetSearchByFacilityResponseModelInterface>> {
  constructor(private fadSearchResultsService: FadSearchResultsService,
    private errorHandler: BcbsmaerrorHandlerService, private router: Router) { }

  async resolve(): Promise<GetSearchByProfessionalResponseModelInterface | GetSearchByFacilityResponseModelInterface> {

    try {
      const searchCriteria: FadLandingPageSearchControlValuesInterface = this.fadSearchResultsService.getSearchCriteria();
      if (searchCriteria && searchCriteria.getSearchText()) {
        const searchTextOption: FadAutoCompleteComplexOptionInterface = searchCriteria.getSearchText();
        if (searchTextOption.getInfoText() === 'speciality') {

          if (searchTextOption.getResourceTypeCode() === FadResouceTypeCodeConfig.professional) {
            const vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface
              = new GetSearchByProfessionalRequestModel();
            vitalsSearchRequestbyProfessional
              .setGeoLocation(searchCriteria.getZipCode().geo) // '42.402311000000026,-71.12037000000004')
              .setLimit(FadConstants.defaults.limit)
              .setName('')
              .setPage(FadConstants.defaults.page)
              .setRadius(FadConstants.defaults.radius)
              .setNetworkId((searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
                searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId)
              .setSearchSpecialtyId(searchTextOption.getSpecialityId());
            return await this.fadSearchResultsService.getFadProfileSearchResults(vitalsSearchRequestbyProfessional).toPromise();
          } if (searchTextOption.getResourceTypeCode() === FadResouceTypeCodeConfig.facility) {
            const vitalsSearchRequestbyFacility: GetSearchByFacilityRequestModelInterface = new GetSearchByFacilityRequestModel();
            const searchName = searchTextOption.getSpecialityId() ? '' : searchTextOption.getSimpleText();
            vitalsSearchRequestbyFacility.setGeoLocation(searchCriteria.getZipCode().geo)
              .setLimit(FadConstants.defaults.limit)
              .setName(searchName)
              .setPage(FadConstants.defaults.page)
              .setRadius(FadConstants.defaults.radius)
              .setNetworkId((searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
                searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId)
              .setSearchSpecialtyId(searchTextOption.getSpecialityId());
            return await this.fadSearchResultsService.getFadFacilitySearchResults(vitalsSearchRequestbyFacility).toPromise();
          }
        } else if (searchTextOption.getResourceTypeCode() === FadResouceTypeCodeConfig.professional) {

          let searchName = searchTextOption.getSimpleText();
          if (searchName && searchName.trim && searchName.trim().indexOf(FadConstants.text.allDoctorOptionText) >= 0) {
            searchName = searchName.replace(FadConstants.text.allDoctorOptionText, '').replace(/["']/g, '');
          }

          const vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface
            = new GetSearchByProfessionalRequestModel();
          vitalsSearchRequestbyProfessional.setGeoLocation(searchCriteria.getZipCode().geo) // '42.402311000000026,-71.12037000000004')
            .setLimit(FadConstants.defaults.limit)
            .setName(searchName)
            .setPage(FadConstants.defaults.page)
            .setRadius(FadConstants.defaults.radius)
            .setNetworkId((searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
              searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId)
            .setSearchSpecialtyId(searchTextOption.getSpecialityId());

          return await this.fadSearchResultsService.getFadProfileSearchResults(vitalsSearchRequestbyProfessional).toPromise();
        } else if (searchTextOption.getResourceTypeCode() === FadResouceTypeCodeConfig.facility) {

          let searchName = searchTextOption.getSimpleText();

          if (searchName && searchName.trim && searchName.trim().indexOf(FadConstants.text.allHospitalsOrFacilitiesText) >= 0) {
            searchName = searchName.replace(FadConstants.text.allHospitalsOrFacilitiesText, '').replace(/["']/g, '');
          }

          const vitalsSearchRequestbyFacility: GetSearchByFacilityRequestModelInterface = new GetSearchByFacilityRequestModel();
          // alternate geolocation value format that is allowed '42.402311000000026,-71.12037000000004')
          // searchCriteria.zipCode ||
          vitalsSearchRequestbyFacility.setGeoLocation(searchCriteria.getZipCode().geo)
            .setLimit(FadConstants.defaults.limit)
            .setName(searchName)
            .setPage(FadConstants.defaults.page)
            .setRadius(FadConstants.defaults.radius)
            .setNetworkId((searchCriteria.getPlanName() && searchCriteria.getPlanName().getNetworkId()) ?
              searchCriteria.getPlanName().getNetworkId() : FadConstants.defaults.networkId)
            .setSearchSpecialtyId(searchTextOption.getSpecialityId());

          return await this.fadSearchResultsService.getFadFacilitySearchResults(vitalsSearchRequestbyFacility).toPromise();
        }
      } else {
        this.router.navigate([FadConstants.urls.fadLandingPage]);
      }
    } catch (exception) {
      this.errorHandler.logError(exception, BcbsmaConstants.modules.fadModule, FadConstants.services.fadSearchResultsResolver
        , FadConstants.methods.resolve);
    }
    return null;
  }
}
