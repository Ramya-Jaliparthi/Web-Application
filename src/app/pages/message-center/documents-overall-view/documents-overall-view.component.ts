import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../documents/documents.service';
import { EocPolicyInterface } from '../modals/interfaces/getBenefitCoverage-models.interface';
import { DocumentDetailService } from '../document-detail/document-detail.service';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-documents-overall-view',
  templateUrl: './documents-overall-view.component.html',
  styleUrls: ['./documents-overall-view.component.scss']
})
export class DocumentsOverallViewComponent implements OnInit {

  public parentFolderName: string;
  public breadCrumbs: BreadCrumb[];

  constructor(private router: Router,
    private documentDetailService: DocumentDetailService,
    private documentsService: DocumentsService) {

  }

  ngOnInit() {
    this.parentFolderName = this.documentsService.getSelectedPlan().planName;
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 1]);
  }

  public displayBenefitText(benefitTextType: number) {
    this.documentDetailService.setBenefitTextType(benefitTextType);
    this.router.navigate(['/message-center/documents/document-view']);
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
      // document-list-view
      case 'document-overall-view':
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
          label: this.documentsService.getSelectedPlan().planName ,
          url: ['/message-center/documents/planDocuments/benefitCoverageList']
        });
        this.breadCrumbs.push({
          label: 'Overall Plan Information',
          url: ['/message-center', 'documents', folderId]
        });
        break;
    }
  }
}


