import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FadMedicalIndexRequestModalInterface } from '../modals/interfaces/fad-medical-index.interface';
import { FadMedicalIndexService } from './fad-medical-index.service';
import { FadMedicalIndexRequestModal } from '../modals/fad-medical-index.modal';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { FadConstants } from '../constants/fad.constants';
import { HashMap } from '../../../shared/models/hash-map.model';
import { FadLandingPageService } from '../fad-landing-page/fad-landing-page.service';
import {
    FadLandingPageSearchControlValuesInterface,
    FadAutoCompleteComplexOptionInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
    FadMedicalIndexParamType,
    FadMedicalIndexPageTitle,
    FadResourceTypeCode
} from '../modals/types/fad.types';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { FadLandingPageSearchControlValues, FadAutoCompleteComplexOption } from '../modals/fad-landing-page.modal';
import { AuthService } from '../../../shared/shared.module';
import { GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface } from '../modals/interfaces/getSearchBySpeciality-models.interface';
@Component({
    selector: 'app-fad-medical-index',
    templateUrl: './fad-medical-index.component.html',
    styleUrls: ['./fad-medical-index.component.scss']
})
export class FadMedicalIndexComponent implements OnInit, AfterViewInit {
    public pageTitle: string;
    public isProcedureList: boolean = false;
    public panelOpenState = false;
    public indexMap: HashMap<GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface[]>
        = new HashMap<GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface[]>();

    constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private fadMedicalIndexService: FadMedicalIndexService,
        private fadLandingPageService: FadLandingPageService,
        private fadSearchResultsService: FadSearchResultsService,
        public authService: AuthService) {

    }

    ngOnInit() {
        this.getIndexData();

        const paramType = this.route.snapshot.paramMap.get(FadConstants.text.type);
        if (!this.authService.isLogin() && paramType === FadMedicalIndexParamType.procedures) {
            this.router.navigate([FadConstants.urls.fadLandingPage]);
        }
    }

    ngAfterViewInit() {
        const expFirstAccordFlag = window.setInterval(() => {
            const matExpPan: HTMLCollectionOf<HTMLElement> =
                <HTMLCollectionOf<HTMLElement>>document.getElementsByTagName('mat-expansion-panel');
            if (matExpPan && matExpPan[0]) {
                const matExpPanHeader: HTMLCollectionOf<HTMLElement>
                    = <HTMLCollectionOf<HTMLElement>>matExpPan[0].getElementsByTagName('mat-expansion-panel-header');
                if (matExpPanHeader && matExpPanHeader[0]) {
                    matExpPanHeader[0].click();
                    window.clearInterval(expFirstAccordFlag);
                }
            }
        }, 100);
    }

    public getIndexData() {
        try {

            this.route.params.flatMap(params => {
                if (params.type === FadMedicalIndexParamType.specialities) {
                    this.pageTitle = FadMedicalIndexPageTitle.allSpecialities;
                } else if (params.type === FadMedicalIndexParamType.procedures) {
                    this.pageTitle = FadMedicalIndexPageTitle.allProcedures;
                    this.isProcedureList = true;
                }
                const fadMedicalIndexRequest: FadMedicalIndexRequestModalInterface =
                    (new FadMedicalIndexRequestModal()).setType(params.type);
                return this.fadMedicalIndexService.fetchMedicalIndex(fadMedicalIndexRequest);
            }).subscribe(data => {
                try {
                    if (data && data.searchSpecialties) {
                        // data.searchSpecialties = this.filterSpecialties(data.searchSpecialties);
                        data.searchSpecialties.map((specialityItem) => {
                            const key: string = specialityItem.name.charAt(0);
                            let specialityItemArray: GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface[];
                            if (this.indexMap.contains(key)) {
                                specialityItemArray = this.indexMap.get(key);
                            } else {
                                specialityItemArray = [];
                            }
                            specialityItemArray.push(specialityItem);
                            specialityItemArray.sort((a, b) => a.name.localeCompare(b.name));
                            this.indexMap.put(key, specialityItemArray);
                        });

                    } else {
                        throw new Error(FadConstants.errorMessages.invalidServiceResponseData);
                    }
                } catch (exception) {
                    this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                        FadConstants.components.fadMedicalIndexComponent,
                        FadConstants.methods.getIndexData);
                }
            },
                error => {
                    this.bcbsmaErrorHandler.handleHttpError(error,
                        BcbsmaConstants.modules.fadModule,
                        FadConstants.services.fadMedicalIndexService,
                        FadConstants.methods.fetchMedicalIndex);
                }
            );

            // this.route.paramMap.pipe(
            //   switchMap((params: ParamMap, index: number) => {
            //     const paramType = params.get(FadConstants.text.type);

            //     if (paramType === FadMedicalIndexParamType.specialities) {
            //       this.pageTitle = FadMedicalIndexPageTitle.allSpecialities;
            //     } else if (paramType === FadMedicalIndexParamType.procedures) {
            //       this.pageTitle = FadMedicalIndexPageTitle.allProcedures;
            //       this.isProcedureList = true;
            //     }
            //     const fadMedicalIndexRequest: FadMedicalIndexRequestModalInterface =
            //       (new FadMedicalIndexRequestModal()).setType(paramType);
            //     return this.fadMedicalIndexService.fetchMedicalIndex(fadMedicalIndexRequest);
            //   })
            // ).subscribe(data => {
            //   try {
            //     if (data && data.searchSpecialties) {
            //       data.searchSpecialties.map((specialityItem) => {
            //         const key: string = specialityItem.name.charAt(0);
            //         let specialityItemArray: string[];
            //         if (this.indexMap.contains(key)) {
            //           specialityItemArray = this.indexMap.get(key);
            //         } else {
            //           specialityItemArray = [];
            //         }

            //         specialityItemArray.push(specialityItem.name);
            //         this.indexMap.put(key, specialityItemArray);
            //       });

            //     } else {
            //       throw new Error(FadConstants.errorMessages.invalidServiceResponseData);
            //     }
            //   } catch (exception) {
            //     this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
            //       FadConstants.components.fadMedicalIndexComponent,
            //       FadConstants.methods.getIndexData);
            //   }
            //   // },
            //   //   error => {
            //   //     this.bcbsmaErrorHandler.handleHttpError(error,
            //   //       BcbsmaConstants.modules.fadModule,
            //   //       FadConstants.services.fadMedicalIndexService,
            //   //       FadConstants.methods.fetchMedicalIndex);
            //   //   }
            // });
        } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                FadConstants.components.fadMedicalIndexComponent,
                FadConstants.methods.ngOnInit);
        }
    }

    public onListItemClicked(speciality: GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface): void {
        try {
            this.bcbsmaErrorHandler.warn(FadConstants.text.medicalIndexToHomeNavWarning, BcbsmaConstants.modules.fadModule,
                FadConstants.components.fadMedicalIndexComponent, FadConstants.methods.onListItemClicked);

            let searchControlValues: FadLandingPageSearchControlValuesInterface = null;
            if (this.fadLandingPageService.getCachedSearchControlState()) {
                searchControlValues = this.fadLandingPageService.getCachedSearchControlState().getValues(this.fadSearchResultsService);
            } else {
                searchControlValues = new FadLandingPageSearchControlValues();
            }

            const selectedSpecialityAutoCompleteOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
            selectedSpecialityAutoCompleteOption.setSimpleText(speciality.name)
                .setSpecialityId(speciality.id)
                .setInfoText(FadConstants.text.speciality)
                .setResourceTypeCode(<FadResourceTypeCode>speciality.resourceTypeCode);

            searchControlValues.setSearchText(selectedSpecialityAutoCompleteOption);
            this.fadLandingPageService.setCachedSearchControlState(searchControlValues);
            if (!this.fadSearchResultsService.getSearchCriteria || !this.fadSearchResultsService.getSearchCriteria()) {
                this.fadSearchResultsService.setSearchCriteria(new FadLandingPageSearchControlValues());
            }
            this.fadSearchResultsService.getSearchCriteria().setSearchText(selectedSpecialityAutoCompleteOption);
            this.fadSearchResultsService.getSearchCriteria().getSearchText().setSpecialityId(speciality.id);
            this.fadSearchResultsService.getSearchCriteria().getSearchText()
                .setResourceTypeCode(<FadResourceTypeCode>speciality.resourceTypeCode);

            this.fadSearchResultsService.setLastSelectedSearchTextOption(
                <FadAutoCompleteComplexOption>this.fadSearchResultsService.getSearchCriteria().getSearchText());

            this.router.navigateByUrl('/fad');
            // this.location.back();
        } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                FadConstants.components.fadMedicalIndexComponent,
                FadConstants.methods.onListItemClicked);
        }
    }
}




