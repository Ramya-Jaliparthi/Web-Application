import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FooterService } from './footer.service';
import { FooterGlobalModel } from '../../models/footerGlobalModel';
import { MultiLingualFooterModel } from '../../models/multilingual-footer.model';
import { FooterLinkModel } from '../../models/footerLinkModel';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public isAuthenticated = true;
  isLogin = false;
  currentYear: any = '';
  langTranslation: any;
  footerGlobalLinks: FooterGlobalModel;
  multiLingualFooter: MultiLingualFooterModel;
  footerLinks: FooterLinkModel[];
  drupalUrl: string = environment.drupalTestUrl;
  // tslint:disable-next-line:max-line-length
  langFooterText: Object;

  constructor(private authService: AuthService,
    private footerService: FooterService,
    private art: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.authService.getScopeName() === 'AUTHENTICATED-AND-VERIFIED' ? this.isLogin = true : this.isLogin = false;
    this.currentYear = (new Date()).getFullYear();
    if (this.art.snapshot.data.menu === undefined) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = this.art.snapshot.data.menu;
    }

    this.setGlobalFooter();
    this.setMultiLanguageFooter();
    this.setFooterLinks();
  }


  public setGlobalFooter(): void {
    // get global footer links
    if (!this.footerService.globalFooterData) {
      this.footerService.getGlobalFooter().subscribe(data => {
        if (data && data.length) {
          this.footerGlobalLinks = data[0];
          this.footerService.globalFooterData = data[0];
        }
      });
    } else {
      this.footerGlobalLinks = this.footerService.globalFooterData;
    }
  }

  public setMultiLanguageFooter(): void {
    // get multiLanguage Footer Content MultiLingualFooterModel
    if (!this.footerService.multiLingualFooterData) {
      this.footerService.getMultiLingualFooter().subscribe(data => {
        if (data && data.length) {
          this.footerService.multiLingualFooterData = data;
          this.langTranslation = data;
          this.multiLingualFooter = this.langTranslation.find(lang => {
            return Object.values(lang).includes('English') ? lang : '';
          });
          this.langFooterText = this.multiLingualFooter.Footertext;
        }
      });
    } else {
      this.langTranslation = this.footerService.multiLingualFooterData;
      this.multiLingualFooter = this.langTranslation.find(lang => {
        return Object.values(lang).includes('English') ? lang : '';
      });
      this.langFooterText = this.multiLingualFooter.Footertext;
    }
  }



  public setFooterLinks(): void {

    // get footer links
    if (!this.footerService.footerLinksData) {
      this.footerService.getFooterLinks().subscribe(footerdata => {
        if (footerdata && footerdata.length) {
          this.footerLinks = footerdata;
          this.footerService.footerLinksData = footerdata;
        }
      });
    } else {
      this.footerLinks = this.footerService.footerLinksData;
    }
  }

  // get selected Language for Footer Text
  public selectLang(link) {
    this.langFooterText = link.Footertext;
  }
}
