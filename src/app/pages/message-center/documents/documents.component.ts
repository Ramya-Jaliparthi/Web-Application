import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { DocumentsService } from './documents.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { ActivatedRoute, Router } from '@angular/router';

import { NoDocumentsFoundComponentModel } from '../modals/message-center.modal';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';
import {
  GetPlansBenefitsListResponseModelInterface,
  GetPlansBenefitsListPlanItemInterface
} from '../modals/interfaces/get-plans-benefits-list-models.interface';
import { GetBenefitCoverageResponseModelInterface, EocPolicyInterface } from '../modals/interfaces/getBenefitCoverage-models.interface';
import { Observable } from 'rxjs/Observable';
import { ConstantsService, AlertService } from '../../../shared/shared.module';
import { AlertType } from '../../../shared/alerts/alertType.model';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  public breadCrumbs: BreadCrumb[];
  public planBenefitsList: GetPlansBenefitsListResponseModelInterface = null;
  public benefitCoverageDocs: GetBenefitCoverageResponseModelInterface = null;
  public policiesInBenefitCoverage: EocPolicyInterface = null;
  public hasContents: boolean;
  private clearAlertOnDestroy: boolean = true;

  fpoHomeTargetUrl: string = this.constants.drupalTestUrl + '/page/mydocuments';
  fpoMyPlanDocumentTargetUrl: string = this.constants.drupalTestUrl + '/page/myplan-documents';
  fpobenefitCoverageListTargetUrl: string = this.constants.drupalTestUrl + '/page/bluecare-documents';
  public no_doc_found_component_mode: NoDocumentsFoundComponentModel = new NoDocumentsFoundComponentModel();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private documentsService: DocumentsService,
    private constants: ConstantsService,
    private alertService: AlertService) {
    this.no_doc_found_component_mode.mode = MessageCenterConstants.flags.documentsMode;
  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 1]);
    // console.log('router', this.router.url.split('/')[this.router.url.split('/').length - 1]);
    try {

      this.policiesInBenefitCoverage = this.route.snapshot.data.policiesInBenefitCoverage;
      this.planBenefitsList = this.route.snapshot.data.planDocuments;
      this.benefitCoverageDocs = this.route.snapshot.data.benefitCoverageDocs;

      if (this.planBenefitsList && this.planBenefitsList.result && this.planBenefitsList.result < 0) {
        this.alertService.setAlert(this.planBenefitsList.displaymessage, ' ', AlertType.Failure);
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.documentsComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  ngOnDestroy(): void {
    this.planBenefitsList = null;
    this.benefitCoverageDocs = null;
    if (this.clearAlertOnDestroy) {
      this.alertService.clearError();
    }
  }

  planDetailsList() {
    this.router.navigate(['/message-center/documents/planDocuments']);
  }

  openBenefitCoverageDocsList(plan: GetPlansBenefitsListPlanItemInterface) {
    this.documentsService.setSelectedPlan(plan);
    this.router.navigate(['/message-center/documents/planDocuments/benefitCoverageList']);
  }

  openOverAllPlanInformation(): void {
    this.router.navigate(['/message-center/documents/document-overall-view']);
  }

  openBenefitCoverage(policy: EocPolicyInterface) {
    this.documentsService.setSelectedPolicy(policy);
    this.router.navigate(['/message-center/documents/documents-list-view']);
  }

  prepareChildBreadCrumbs(folderId) {
    console.log('floderid', folderId, this.breadCrumbs);
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
      // url: ['/message-center', 'documents', folderId]
    });
    this.breadCrumbs.push({
      label: 'My Inbox',
      url: ['/message-center']
      // url: ['/message-center', 'documents', folderId]
    });
    switch (folderId) {
      case 'home':
        this.breadCrumbs.push({
          label: 'My Documents',
          url: ['/message-center/documents/home']
          // url: ['/message-center', 'documents', folderId]
        });
        break;
      case 'planDocuments':
        this.breadCrumbs.push({
          label: 'My Documents',
          // url: ['/message-center', 'documents', folderId]
          url: ['/message-center/documents/home']
        });
        this.breadCrumbs.push({
          label: 'My Plan Documents',
          url: ['/message-center/documents/planDocuments']
          // url: ['/message-center', 'documents', folderId]
        });
        break;
      case 'benefitCoverageList':
        this.breadCrumbs.push({
          label: 'My Documents',
          url: ['/message-center/documents/home']
          // url: ['/message-center', 'documents', 'home']
        });
        this.breadCrumbs.push({
          label: 'My Plan Documents',
          url: ['/message-center/documents/planDocuments']
        });
        this.breadCrumbs.push({
          label: this.documentsService.getSelectedPlan().planName,
          url: ['/message-center/documents/planDocuments/benefitCoverageList']
        });
        break;
      // case 'document-overall-view':
      //   this.breadCrumbs.push({
      //     label: 'My Documents',
      //     url: ['/message-center', 'documents', 'home']
      //   });
      //   this.breadCrumbs.push({
      //     label: 'Plan Documents',
      //     url: ['/message-center', 'documents', folderId]
      //   });
      //   break;
      // case 'document-list-view':
      //   this.breadCrumbs.push({
      //     label: 'My Documents',
      //     url: ['/message-center', 'documents', 'home']
      //   });
      //   this.breadCrumbs.push({
      //     label: 'Benefit Summaries',
      //     url: ['/message-center', 'documents', folderId]
      //   });
      //   break;
      case '601':
        this.breadCrumbs.push({
          label: 'My Documents',
          url: ['/message-center', 'documents', 'home']
        });
        this.breadCrumbs.push({
          label: 'Plan Documents',
          url: ['/message-center', 'documents', '501']
        });
        this.breadCrumbs.push({
          label: 'Blue Care Elect Program',
          url: ['/message-center', 'documents', folderId]
        });
        break;
    }
    console.log('this.breadCrumbs', this.breadCrumbs);
  }
  initBreadcrumbs() {
    this.breadCrumbs = [{
      label: 'Home',
      url: ['/home']
    },
    {
      label: 'My Inbox',
      url: ['/message-center']
    }];
  }
}
