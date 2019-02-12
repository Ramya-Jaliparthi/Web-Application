
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ConstantsService } from '../../services/constants.service';
import { AuthHttp } from '../../services/authHttp.service';
import { GlobalService } from '../../services/global.service';
import { HeaderMenu, HeaderInboxUnreadMsgCountRequest, HeaderInboxUnreadMsgCountReponse } from './models/header.model';
import { environment } from '../../../../environments/environment';
import { WorldClockApiResponseModel } from '../../models/worldClockResponse.model';

@Injectable()
export class HeaderService {
  public menuItems: HeaderMenu[];
  public searchUrlTarget: string;
  public inbox: HeaderInboxUnreadMsgCountReponse;
  public drupalsecureinquiry: string; // used in header.html

  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService,
    private globalService: GlobalService) {
    this.inbox = new HeaderInboxUnreadMsgCountReponse();
    this.drupalsecureinquiry = this.constants.drupalsecureinquiry;
  }


  // To get the drupal header menu items
  public getMenuItems(): Observable<HeaderMenu[]> {
    const url = environment.drupalTestUrl + '/api/menu_items/main?_format=json';
    return this.http.get<HeaderMenu[]>(url)
      .pipe(
        retry(3)
      );
  }

  public getESTTime(): Observable<WorldClockApiResponseModel> {
    const worldESTClockUrl = 'http://worldclockapi.com/api/json/est/now';
    return this.http.get<WorldClockApiResponseModel>(worldESTClockUrl);
  }

    set unReadMsgCount(count: any) {
        sessionStorage.setItem('inboxUnreadMsgCount', count);
    }

    get unReadMsgCount() {
        return sessionStorage.getItem('inboxUnreadMsgCount');
    }

    /*public getInboxUnreadMsgCount(): Observable<HeaderInboxUnreadMsgCountReponse> {
      const inboxUnreadMsgCountReqParams: HeaderInboxUnreadMsgCountRequest = new HeaderInboxUnreadMsgCountRequest();
      inboxUnreadMsgCountReqParams.useridin = this.authService.useridin;
      return this.http.encryptPost(this.constants.getInboxUnreadMsgCountUrl, inboxUnreadMsgCountReqParams).
        map(response => <HeaderInboxUnreadMsgCountReponse>response);
    }
  
    public updateInboxMsgUnreadCount(oInbox: HeaderInboxUnreadMsgCountReponse) {
      //    this.inboxUnreadMsgCount.next(oInbox);
    }*/

}
