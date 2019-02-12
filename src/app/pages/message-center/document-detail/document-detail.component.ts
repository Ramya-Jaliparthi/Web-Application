import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageCenterSearchService } from '../message-center-search/message-center-search.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { GetBenefitTextResponseModelInterface } from '../modals/interfaces/getBenefitText-models.interface';
import { MessageCenter_BenefitTextType } from '../modals/types/message-center.types';
import { DocumentDetailService } from './document-detail.service';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';
import { DocumentsService } from '../documents/documents.service';


@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {

  public benefitText: GetBenefitTextResponseModelInterface;
  public benefitTextType: MessageCenter_BenefitTextType;
  public benefitTypeText: string;
  public breadCrumbs: BreadCrumb[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private documentDetailService: DocumentDetailService,
    private documentsService: DocumentsService) { }

  ngOnInit() {
    this.breadCrumbs = [];
    this.benefitText = this.route.snapshot.data.benefitText;
    this.benefitTextType = this.documentDetailService.getBenefitTextType();
    if (this.benefitTextType === 0) {
      this.benefitTypeText = 'Eligibility Provisions';
    } else if (this.benefitTextType === 1) {
      this.benefitTypeText = 'Claims Filling Limit';
    } else if (this.benefitTextType === 2) {
      this.benefitTypeText = 'Coordination of Benefits';
    } else if (this.benefitTextType === 3) {
      this.benefitTypeText = 'Overall Plan Limitations & Exclusions';
    }
    // sessionStorage.getItem('MsgCenter_Doc_BenefitType') ? sessionStorage.getItem('MsgCenter_Doc_BenefitType')
    // sessionStorage.setItem('MsgCenter_Doc_BenefitType', this.benefitTypeText);
    this.benefitTypeText = this.benefitTypeText;
    console.log('Benefit type init', this.benefitTypeText);
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 1]);
  }

  // public backToMsgListing(): void {
  //   try {
  //     this.messageCenterSearchService.isPersistSearchCriteria = true;
  //     this.location.back();
  //     // this.router.navigate(['/message-center/messages']);
  //   } catch (exception) {
  //     this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
  //       MessageCenterConstants.components.documentDetailComponent,
  //       MessageCenterConstants.methods.backToMsgListing);
  //   }
  // }

  prepareChildBreadCrumbs(folderId) {
    console.log('floderid', folderId, this.breadCrumbs);
    console.log('Benefit type func', this.benefitTypeText);
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
      // url: ['/message-center', 'documents', folderId]
    });
    this.breadCrumbs.push({
      label: 'My Inbox',
      url: ['/message-center']
    });
    switch (folderId) {
      case 'document-view':
        this.breadCrumbs.push({
          label: 'My Documents',
          url: ['/message-center/documents/home']
        });
        this.breadCrumbs.push({
          label: 'My Plan Documents',
          url: ['/message-center/documents/planDocuments']
        });
        this.breadCrumbs.push({
          label: this.documentsService.getSelectedPlan().planName ,
          url: ['/message-center/documents/planDocuments/benefitCoverageList']
        });
        this.breadCrumbs.push({
          label: 'Benefit Summaries',
          url: ['/message-center/documents/document-overall-view']
        });
        this.breadCrumbs.push({
          label: this.benefitTypeText,
          url: ['/message-center', 'documents', folderId]
        });
        break;
    }
  }

}
