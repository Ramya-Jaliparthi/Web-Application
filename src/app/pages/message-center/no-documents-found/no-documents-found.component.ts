import { Component, OnInit, Input } from '@angular/core';
import { MessageCenterNoDocsFoundPageModelInterface } from '../modals/interfaces/message-center.interface';
import {
  MessageCenterNoUploadsFoundPageModel,
  MessageCenterNoMessagesFoundPageModel,
  MessageCenterNoDocumentsFoundPageModel,
  MessageCenterNoPlanDocumentsFoundPageModel,
  NoDocumentsFoundComponentModel,
  MessageCenterNoSearchResultsFoundPageModel
} from '../modals/message-center.modal';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';

@Component({
  selector: 'app-no-documents-found',
  templateUrl: './no-documents-found.component.html',
  styleUrls: ['./no-documents-found.component.scss']
})
export class NoDocumentsFoundComponent implements OnInit {

  @Input('componentMode') componentMode: NoDocumentsFoundComponentModel;
  searchView;
  @Input() fpoUrl: string;

  public messageCenterNoDocsFoundPageModel: MessageCenterNoDocsFoundPageModelInterface;
  public noSearchResultsMode: boolean = false;

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService) { }

  ngOnInit() {
    // this.searchView = this.componentMode.searchCriteria.keywordToSearch;

    try {
      if (this.componentMode.mode === MessageCenterConstants.flags.messagesMode) {
        this.messageCenterNoDocsFoundPageModel = new MessageCenterNoMessagesFoundPageModel();
      } else if (this.componentMode.mode === MessageCenterConstants.flags.documentsMode) {
        this.messageCenterNoDocsFoundPageModel = new MessageCenterNoDocumentsFoundPageModel();
      } else if (this.componentMode.mode === MessageCenterConstants.flags.uploadsMode) {
        this.messageCenterNoDocsFoundPageModel = new MessageCenterNoUploadsFoundPageModel();
      } else if (this.componentMode.mode === MessageCenterConstants.flags.noSearchResultsMode) {
        this.messageCenterNoDocsFoundPageModel = new MessageCenterNoSearchResultsFoundPageModel();
        this.noSearchResultsMode = true;


      } else {
        throw new Error(MessageCenterConstants.errorMessages.noDocsFound_InvalidComponentModeError);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.noDocumentsFoundComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  public triggerFilterComponentClearButtonClick(event): void {
    try {
      event.target.closest('body').querySelector('div.filter-container div.filter-buttons button.clear-filter-button').click();
    } catch (exception) {
      // do nothing and fail silent
    }
  }
}

