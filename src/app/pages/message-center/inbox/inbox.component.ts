import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { HeaderService } from '../../../shared/layouts/header/header.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';
import { ConstantsService } from '../../../shared/shared.module';
import { AuthService } from '../../registration/registration.module';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  public unreadMsgCount: number;
  public breadCrumbs: BreadCrumb[];
  fpoTargetUrl: string = this.constants.drupalTestUrl + '/page/myinbox-landingscreen';

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public headerService: HeaderService,
    private router: Router,
    private constants: ConstantsService,
  public authService: AuthService) {

  }

  ngOnInit() {
    this.initBreadcrumbs();
    // console.log(this.headerService.inbox.unreadMessageCount);
    // this.unreadMsgCount = this.headerService.inbox.unreadMessageCount;
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

  goToDocumentsHome() {
    this.router.navigate(['/message-center/documents/home']);
  }

  public openComponent(targetComponent: string): void {
    try {
      switch (targetComponent) {
        case 'messages':
          this.router.navigate([`/message-center/messages`]);
          break;
        case 'chats':
          break;
        default:
          break;
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.inboxComponent,
        MessageCenterConstants.methods.openComponent);
    }
  }

}
