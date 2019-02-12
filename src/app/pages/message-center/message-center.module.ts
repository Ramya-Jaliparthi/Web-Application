import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageCenterService } from './message-center.service';
import { NoDocumentsFoundComponent } from './no-documents-found/no-documents-found.component';
import { InboxComponent } from './inbox/inbox.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageCenterRouter } from './message-center.routing';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { authHttpFactory } from '../../shared/utils/authHttp.factory';
import { AuthService, ConstantsService } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { UploadsComponent } from './uploads/uploads.component';
import { UploadDetailComponent } from './upload-detail/upload-detail.component';
import { DocumentsComponent } from './documents/documents.component';

import { DocumentsService } from './documents/documents.service';
import { MaterialModule } from '../../material.module';
import { DocumentsListViewComponent } from './documents-list-view/documents-list-view.component';
import { UploadsService } from './uploads/uploads.service';
import { UploadDetailsService } from './upload-detail/upload-details.service';
import { MsgListingComponent } from './msg-listing/msg-listing.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { MsgListingService } from './msg-listing/msg-listing.service';
import { MessageCenterSearchComponent } from './message-center-search/message-center-search.component';
import { MessageCenterSearchService } from './message-center-search/message-center-search.service';
import { MessageDetailService } from './message-detail/message-detail.service';
import { DocumentsResolverService } from './documents/documents.resolver';
import { BenefitCoverageListResolverService } from './documents/benefit-coverage-list.resolver';
import { DocumentsListViewResolverService } from './documents-list-view/document-list-view.resolver';
import { DocumentsOverallViewComponent } from './documents-overall-view/documents-overall-view.component';
import { DocumentDetailService } from './document-detail/document-detail.service';
import { DocumentDetailResolverService } from './document-detail/document-detail.resolver';

@NgModule({
  imports: [
    CommonModule,
    MessageCenterRouter,
    SharedModule,
    MaterialModule
  ],
  exports: [],
  declarations: [
    NoDocumentsFoundComponent,
    InboxComponent,
    MessageDetailComponent,
    UploadsComponent,
    UploadDetailComponent,
    DocumentsComponent,
    DocumentsOverallViewComponent,
    DocumentsListViewComponent,
    MsgListingComponent,
    DocumentDetailComponent,
    MessageCenterSearchComponent
  ],
  providers: [
    AuthGuard,
    {
      'provide': AuthHttp,
      'useFactory': authHttpFactory,
      'deps': [HttpClient, AuthService, ConstantsService, AuthHttp],
    },
    MessageCenterService,
    DocumentsService,
    UploadsService,
    UploadDetailsService,
    MsgListingService,
    MessageCenterSearchService,
    MessageDetailService,
    AuthHttp,
    DocumentsResolverService,
    BenefitCoverageListResolverService,
    DocumentsListViewResolverService,
    DocumentDetailService,
    DocumentDetailResolverService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MessageCenterModule { }
