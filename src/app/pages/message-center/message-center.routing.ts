import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { MsgListingComponent } from './msg-listing/msg-listing.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { UploadsComponent } from './uploads/uploads.component';
import { UploadDetailComponent } from './upload-detail/upload-detail.component';
import { DocumentsComponent } from './documents/documents.component';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { DocumentsListViewComponent } from './documents-list-view/documents-list-view.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { DocumentsResolverService } from './documents/documents.resolver';
import { BenefitCoverageListResolverService } from './documents/benefit-coverage-list.resolver';
import { DocumentsListViewResolverService } from './documents-list-view/document-list-view.resolver';
import { DocumentsOverallViewComponent } from './documents-overall-view/documents-overall-view.component';
import { DocumentDetailResolverService } from './document-detail/document-detail.resolver';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';

const MESSAGE_CENTER_ROUTER: Routes = [
    {
        path: '',
        component: AuthenticatedLayoutComponent,
        children: [
            {
                path: '',
                component: InboxComponent
            },
            {
                path: 'messages',
                component: MsgListingComponent,
                data: {
                    breadcrumb: 'Messages'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'message-detail',
                component: MessageDetailComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'documents/home',
                component: DocumentsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'documents/planDocuments',
                component: DocumentsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    planDocuments: DocumentsResolverService
                },
            },
            {
                path: 'documents/planDocuments/benefitCoverageList',
                component: DocumentsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    benefitCoverageDocs: BenefitCoverageListResolverService
                },
            },
            {
                path: 'documents/document-view',
                component: DocumentDetailComponent,
                canActivate: [AuthGuard],
                resolve: {
                    benefitText: DocumentDetailResolverService
                }
            },
            {
                path: 'documents/document-overall-view',
                component: DocumentsOverallViewComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'uploads',
                component: UploadsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'upload-detail/:fileId',
                component: UploadDetailComponent,
                canActivate: [AuthGuard]
            }
          ],
    },
    {
        path: 'documents/documents-list-view',
        // component: AuthCentralLayoutComponent,
        component: AuthenticatedLayoutComponent,
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            component: DocumentsListViewComponent,
            resolve: {
                policy: DocumentsListViewResolverService
            }
          }
        ],
    }
];

export const MessageCenterRouter = RouterModule.forChild(MESSAGE_CENTER_ROUTER);