import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { AuthService, ConstantsService } from '../../../shared/shared.module';
import { DocumentsService } from '../documents/documents.service';
import {
  GetBenefitTextResponseModelInterface,
  GetBenefitTextRequestModelInterface
} from '../modals/interfaces/getBenefitText-models.interface';
import { GetBenefitTextRequestModel } from '../modals/getBenefitText.model';
import { MessageCenter_BenefitTextType } from '../modals/types/message-center.types';
import { GetPlansBenefitsListPlanItemInterface } from '../modals/interfaces/get-plans-benefits-list-models.interface';

@Injectable()
export class DocumentDetailService {

  private benefitTextType: MessageCenter_BenefitTextType = null;

  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService,
    private documentsService: DocumentsService) { }

  public getBenefitTextType(): number {
    const cachedBenefitTextType: string = sessionStorage.getItem('messageCenter_BenefitTextType');
    const cachedBenefitTextTypeNumber = cachedBenefitTextType ? Number(cachedBenefitTextType) : null;
    return this.benefitTextType ? this.benefitTextType : cachedBenefitTextTypeNumber;
  }

  public setBenefitTextType(benefitTextType) {

    sessionStorage.setItem('messageCenter_BenefitTextType', benefitTextType);
    this.benefitTextType = benefitTextType;
  }

  public getBenefitTextData():
    Observable<GetBenefitTextResponseModelInterface> {

    const benefitTextResponseRequest: GetBenefitTextRequestModelInterface =
      new GetBenefitTextRequestModel();

    const selectedPlan: GetPlansBenefitsListPlanItemInterface = this.documentsService.getSelectedPlan();

    benefitTextResponseRequest.setUseridin(this.authService.useridin)
      .setPlanName(selectedPlan.planName)
      .setCoveragePackageCode(selectedPlan.coveragePackageCode);

    return this.http.encryptPost(this.constants.getBenefitsTextUrl, benefitTextResponseRequest).map(response => {
      if (response.result < 0) {
        sessionStorage.setItem('messageCenter_GetBenefitTextResponse', null);
        return <GetBenefitTextResponseModelInterface>response;
      } else {
        const getBenefitsTextResponse: GetBenefitTextResponseModelInterface
          = <GetBenefitTextResponseModelInterface>response;
        if (getBenefitsTextResponse.result && getBenefitsTextResponse.result < 0) {
          sessionStorage.setItem('messageCenter_GetBenefitTextResponse', null);
          return;
        } else {
          sessionStorage.setItem('messageCenter_GetBenefitTextResponse', JSON.stringify(getBenefitsTextResponse));
          return getBenefitsTextResponse;
        }
      }
    });
  }

}
