import {
  Component, OnInit, Output, Input, EventEmitter,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import {
  FadFacilityListComponentInputModelInterface,
  FadFacilityListComponentOutputModelInterface
} from '../modals/interfaces/fad-search-list.interface';
import { FadFacilityListComponentOutputModel } from '../modals/fad-search-list.modal';
import { FadNoSearchResultsPageConsumer, StarRatingComponentConsumer, FadFacilityCardConsumer } from '../modals/interfaces/fad.interface';
import { FadNoDocsPageInputDataModelInterface } from '../modals/interfaces/fad-no-docs-page.interface';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import * as leafLet from 'leaflet';
import { Subscription } from 'rxjs/Subscription';
import { FadFacilityListService } from './fad-facility-list.service';
import { FadFacilityCardComponent } from '../fad-facility-card/fad-facility-card.component';
import { FadProfileCardComponentInputModel, FadFacilityCardComponentInputModel } from '../modals/fad-profile-card.modal';
import {
  //  FadVitalsProfessionalsSearchResponseModelInterface,
  FadZipCodeSearchResponseModelInterface
} from '../modals/interfaces/fad-vitals-collection.interface';
// import { FVProSRProfessionalInSearchEntity } from '../modals/fad-vitals-professionals-search-response.model';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { FadLandingPageService } from '../fad-landing-page/fad-landing-page.service';
import { FadProfileCardComponentMode } from '../modals/types/fad.types';
import {
  FadProfileCardComponentOutputModelInterface,
  FadFacilityCardComponentOutputModelInterface
} from '../modals/interfaces/fad-profile-card.interface';

import { objectEquals } from 'object-equals';
import { Router } from '@angular/router';
import {
  GetSearchByFacilityResponseModelInterface,
  FadFacilityInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { FZCSRCity } from '../modals/fad-vitals-collection.model';

@Component({
  selector: 'app-fad-facility-list',
  templateUrl: './fad-facility-list.component.html',
  styleUrls: ['./fad-facility-list.component.scss']
})
export class FadFacilityListComponent implements OnInit, OnChanges,
  FadNoSearchResultsPageConsumer, FadFacilityCardConsumer {

  @Output('componentOutput') componentOutput: FadFacilityListComponentOutputModelInterface
    = new EventEmitter<FadFacilityListComponentOutputModel>();

  @Input('componentInput') componentInput: FadFacilityListComponentInputModelInterface;

  @ViewChild('profileCardList') profileCardList: ElementRef;


  public isDisplayBanner: boolean = false;

  // No search results page consumption requirement
  public noSearchResultsPageData: FadNoDocsPageInputDataModelInterface;
  public isNoSearchResults: boolean = false;
  // End: No search results page consumption requirement

  public filteredSearchResponse: GetSearchByFacilityResponseModelInterface;
  public searchResponse: GetSearchByFacilityResponseModelInterface;
  public facilityList: FadFacilityInterface[] = null;
  public selectedProfessionals: FadFacilityInterface[] = [];

  private mapInstance: leafLet.Map;
  private cachedAllZipCodeInfo: FadZipCodeSearchResponseModelInterface;
  public idValues: number[];
  public list: number[] = [];

  constructor(private router: Router, private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private fadSearchListService: FadFacilityListService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector, private appRef: ApplicationRef,
    private fadSearchResultsService: FadSearchResultsService,
    private landingPageService: FadLandingPageService,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef
  ) { }


  // Show banner section on window scroll to clear and delete message listing
  @HostListener('window:scroll', ['$event'])
  showBannerOnWindowScroll($event) {

    const fadSearchListPos = this.el.nativeElement.offsetTop,
      windowScrollPos = window.pageYOffset;

    if (windowScrollPos > fadSearchListPos) {
      this.isDisplayBanner = true;
    } else {
      this.isDisplayBanner = false;
    }
  }
  ngOnInit() {
    try {
      this.cachedAllZipCodeInfo = this.landingPageService.vitalsZipCodeInfo;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.componentInput = changes.componentInput.currentValue;
      if (this.componentInput) {
        this.searchResponse = this.componentInput.facilityResults;
        if (this.searchResponse) {
          this.facilityList = this.searchResponse.facilities;
          this.isNoSearchResults = false;
        } else {
          this.isNoSearchResults = true;
        }
        this.cdRef.detectChanges();
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.ngOnChanges);
    }
  }

  // FadProfileCardConsumer consumption requirement
  public getProfileCardInput(facility: FadFacilityInterface): FadFacilityCardComponentInputModel {
    return new FadFacilityCardComponentInputModel(facility);
  }

  public onProfileCardComponentInteraction(facilityCardCompOutput: FadFacilityCardComponentOutputModelInterface) {
    if (facilityCardCompOutput.isSelected) {
      // add selected professional
      this.selectedProfessionals.push(facilityCardCompOutput.facility);
    } else {
      // remove selected professional
      const remainingSelectedProfessionals: FadFacilityInterface[] =
        this.selectedProfessionals.filter(selectedProfessional => {
          if (!objectEquals(selectedProfessional, facilityCardCompOutput.facility)) {
            return selectedProfessional;
          }
        });
      this.selectedProfessionals = remainingSelectedProfessionals;
    }
  }

  // end: FadProfileCardConsumer consumption requirement

  public compareSelectedProfiles() {

    for (let i = 0; i < this.selectedProfessionals.length; i++) {
      // kalagi01 - CAUTION ************ DO NOT DELETE ********************
      // a replacement to the id attribute has to be identified and the following code has to be modified
      // this.list[i] = this.selectedProfessionals[i].id;
    }
    this.fadSearchListService.setSelectedId(this.list);
    this.router.navigate([FadConstants.urls.fadCompareTablePage]);
  }

  public clearProfileSelections() {
    this.selectedProfessionals = [];
    const checkBoxList: NodeListOf<Element> = this.profileCardList.nativeElement.querySelectorAll('[type="checkbox"]');
    Array.from(checkBoxList).forEach((checkBox) => {
      const chkBox = (<HTMLInputElement>checkBox);
      chkBox.removeAttribute('checked');
      chkBox.checked = false;
    });
  }

  public onTabSelectionChange(selectedIndex) {
    let selectedLatitude: number;
    let selectedLongitude: number;

    try {
      if (selectedIndex === 0) {
        this.bcbsmaErrorHandler.devLog('List tab selected');
      } else if (selectedIndex === 1) {
        this.bcbsmaErrorHandler.devLog('Map tab selected');
        if (!this.fadSearchResultsService.getSearchCriteria()) {
          if (this.mapInstance && this.mapInstance.remove) {
            this.mapInstance.off();
            this.mapInstance.remove();
          }
          return;
        }

        const zipCodeInSearch: FZCSRCity = this.fadSearchResultsService.getSearchCriteria().getZipCode();
        let targetIndex: number = -1;
        this.cachedAllZipCodeInfo.cities.some((city, index) => {
          if (zipCodeInSearch && zipCodeInSearch.zip.indexOf(city.zip) >= 0) {
            targetIndex = index;
            return true;
          }
        });

        if (targetIndex < 0) {
          const fadLastSelectedCityZip = <FZCSRCity>JSON.parse(localStorage.getItem('fadLastSelectedCityZip'));
          if (fadLastSelectedCityZip && zipCodeInSearch.zip === fadLastSelectedCityZip.zip) {
            selectedLatitude = Number(fadLastSelectedCityZip.lat);
            selectedLongitude = Number(fadLastSelectedCityZip.lng);
          } else {
            throw new Error('Invalid zipcode');
          }
        } else {
          selectedLatitude = Number(this.cachedAllZipCodeInfo.cities[targetIndex].lat);
          selectedLongitude = Number(this.cachedAllZipCodeInfo.cities[targetIndex].lng);
        }

        const onMapCreatedEventWatcher: Subscription = this.fadSearchListService.onMapContainerCreated().subscribe(data => {
          this.createInteractiveMap(FadConstants.elementRef.fadSearchListMapContent, [selectedLatitude, selectedLongitude], 13);
          onMapCreatedEventWatcher.unsubscribe();
        });
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.onTabSelectionChange);
    }
  }

  private createInteractiveMap(mapContainerId: string, coords: leafLet.LatLngExpression, zoomLevel: number) {
    try {
      if (this.mapInstance && this.mapInstance.remove) {
        this.mapInstance.off();
        this.mapInstance.remove();
      }
      this.mapInstance = leafLet.map(mapContainerId).setView(coords, zoomLevel);
      leafLet.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
      <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoib3ppbmlzbGUiLCJhIjoiY2ppYWJoaGR3MHp3ZTNxa3p3dnNnM2NiaCJ9.6k4AQo0CenMExQL9iObioQ'
      }).addTo(this.mapInstance);

      this.addMarkers();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.createInteractiveMap);
    }
  }

  private addMarkers() {
    try {

      this.facilityList.map((professional) => {
        professional.locations.map((location) => {
          // const lattitude: number = location.address.latitude;
          // const longitude: number = location.address.longitude;
          // const latLng: leafLet.LatLngExpression = [lattitude, longitude];

          // const marker: leafLet.Marker = leafLet.marker(latLng).addTo(this.mapInstance);
          // marker.bindPopup(this.fetchPopupContent(professional));
        });
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.addMarkers);
    }
  }

  private fetchPopupContent(facility: FadFacilityInterface): HTMLElement {
    try {
      const cmpFactory = this.resolver.resolveComponentFactory(FadFacilityCardComponent);
      const fadFacilityCardComponenttRef = cmpFactory.create(this.injector);
      fadFacilityCardComponenttRef.instance.componentInput = new FadFacilityCardComponentInputModel(facility);
      fadFacilityCardComponenttRef.instance.componentInput.mode = <FadProfileCardComponentMode>'MapItem';

      this.appRef.attachView(fadFacilityCardComponenttRef.hostView);

      return fadFacilityCardComponenttRef.location.nativeElement;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchListComponent,
        FadConstants.methods.fetchPopupContent);
    }
  }

  // private popup(marker: leafLet.Marker, link: string) {
  //   const cmpFactory = this.resolver.resolveComponentFactory(FadProfileCardComponent);
  //   const componentRef = cmpFactory.create(this.injector);
  //   componentRef.instance.link = link;
  //   this.appRef.attachView(componentRef.hostView);
  //   const markerElement = marker.getElement();
  //   markerElement.parentElement.appendChild(componentRef.location.nativeElement);

  //   const markerPos = leafLet.DomUtil.getPosition(markerElement);
  //   const markerClass = leafLet.DomUtil.getClass(markerElement);
  //   leafLet.DomUtil.setTransform(componentRef.location.nativeElement, markerPos);
  //   leafLet.DomUtil.setClass(componentRef.location.nativeElement, markerClass);
  // }


}
