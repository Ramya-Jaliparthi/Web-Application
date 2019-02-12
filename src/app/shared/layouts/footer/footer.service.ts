import { Inject, Injectable } from '@angular/core';
import { AuthHttp } from '../../services/authHttp.service';
import { ConstantsService } from '../../services/constants.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { FooterGlobalModel } from '../../models/footerGlobalModel';
import { FooterLinkModel } from '../../models/footerLinkModel';
import { MultiLingualFooterModel } from '../../models/multilingual-footer.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FooterService {
  public globalFooterData;
  public multiLingualFooterData;
  public footerLinksData: any;

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    public authService: AuthService) { }

  getGlobalFooter(): Observable<FooterGlobalModel[]> {
    const targetUrl = environment.drupalTestUrl + '/global/footer';
    return this.http.get<FooterGlobalModel[]>(targetUrl);
  }

  getMultiLingualFooter(): Observable<MultiLingualFooterModel[]> {
    const targetUrl = environment.drupalTestUrl + '/multilingual-footer';
    return this.http.get<MultiLingualFooterModel[]>(targetUrl);
  }

  getFooterLinks(): Observable<FooterLinkModel[]> {
    const targetUrl = environment.drupalTestUrl + '/api/menu_items/footer?_format=json';
    return this.http.get<FooterLinkModel[]>(targetUrl);
  }
}
