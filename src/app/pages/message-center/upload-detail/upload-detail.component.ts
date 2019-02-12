import { Component, OnInit } from '@angular/core';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { UploadDetailsService } from './upload-details.service';
import { UploadedDocInfoRequestModelInterface, UploadDataItemInterface } from '../modals/interfaces/uploads.interface';
import { UploadDataItem } from '../modals/uploads.modal';
import { MessageCenterSearchService } from '../message-center-search/message-center-search.service';

@Component({
  selector: 'app-upload-detail',
  templateUrl: './upload-detail.component.html',
  styleUrls: ['./upload-detail.component.scss']
})
export class UploadDetailComponent implements OnInit {

  public docInfo: UploadDataItemInterface;
  public messageCenterConstants;

  constructor(
    private route: ActivatedRoute,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private uploadDetailsService: UploadDetailsService,
    private router: Router,
    private messageCenterSearchService: MessageCenterSearchService
  ) {
    this.messageCenterConstants = MessageCenterConstants;
  }

  ngOnInit() {
    try {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap, index: number) => {
          const uploadedDocInfoRequest: UploadedDocInfoRequestModelInterface = {
            'fileId': params.get('fileId')
          };
          return this.uploadDetailsService.getDocumentData(uploadedDocInfoRequest);
        })
      ).subscribe(
        data => {
          this.docInfo = new UploadDataItem();

          if (!data) {
            this.throwInvalidServiceResponseDataErrorInOnInit();
          }
          this.docInfo = data;
        },
        error => {
          this.docInfo = new UploadDataItem();

          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.messageCenterModule,
            MessageCenterConstants.services.uploadsService,
            MessageCenterConstants.methods.getDocumentViewData);
        }
      );

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.uploadDetailComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(MessageCenterConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.messageCenterModule,
      MessageCenterConstants.components.uploadsComponent,
      MessageCenterConstants.methods.ngOnInit
    );
  }

  public navigateToUploadsScreen(): void {
    try {
      this.messageCenterSearchService.isPersistSearchCriteria = true;
      this.router.navigate([`/message-center/uploads`]);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.uploadDetailComponent,
        MessageCenterConstants.methods.navigateToUploadsScreen);
    }
  }

  public downloadCopy(): void {
    try {
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.uploadDetailComponent,
        MessageCenterConstants.methods.downloadCopy);
    }
  }
}


