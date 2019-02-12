import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  menuListItem1, menuListItem2, menuListItemMobile, menuListItemRegisteredUser,
  menuListItem1_inactive, menuListItemMobile_inactive, menuListItemRegisteredUser_inactive
} from './myaccount-menu-constants';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from '../../shared/services/alert.service';
import {MyAccountService} from './myaccount.service';
import {HomePageInfoModel} from '../landing/landing.model';
import {ConstantsService} from '../../shared/services/constants.service';
import {TitleCasePipe} from '@angular/common';


@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyAccountComponent implements OnInit {
  public menuListItem1;
  public menuListItem2;
  public menuListItemMobile;
  public isInActive: boolean;
  public menuListItemRegisteredUser = menuListItemRegisteredUser;
  public accountInfo: any;
  mobileViewPort = 992;
  ismobile: boolean;
  esiUrl: string = this.constantsService.esiUrl;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }

  constructor(private authService: AuthService,
              private router: Router,
              private r: ActivatedRoute,
              private titleCase: TitleCasePipe,
              private myAccountService: MyAccountService,
              private constantsService: ConstantsService,
              private alertService: AlertService) {
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }

  }

  ngOnInit() {
    this.isInActive = false;
    const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
    const userState = this.authService.fetchUserState();
    if (scopename === 'AUTHENTICATED-NOT-VERIFIED' || scopename === 'AUTHENTICATED-AND-VERIFIED'
      || scopename === 'INACTIVE-AUTHENTICATED-AND-VERIFIED') {
      this.menuListItem2 = JSON.parse(JSON.stringify(menuListItem2));
      this.menuListItemRegisteredUser = null;
      if (userState && userState.toLowerCase() === 'inactive') {
        this.isInActive = true;
        this.menuListItem1 = menuListItem1_inactive;
        this.menuListItemMobile = menuListItemMobile;
        this.menuListItemMobile = this.menuListItemMobile.filter((item) => !(item.icon === 'estimate' ||
          item.icon === 'cards' || item.icon === 'plans' || item.icon === 'coinsurance'
        ));
        this.menuListItem2.splice(0, 1);
        this.menuListItem2.pop();
      } else {
        this.menuListItem1 = JSON.parse(JSON.stringify(menuListItem1));
        this.menuListItemMobile = menuListItemMobile;
        if (this.authService.authToken.userType === 'MEDICARE') {
          this.menuListItem1.pop();
          this.menuListItemMobile = this.menuListItemMobile.filter((item) => item.icon !== 'estimate');
        } else if (this.authService.authToken && this.authService.authToken.planTypes
          && this.authService.authToken.planTypes['medical'] === 'true') {
        } else {
          this.menuListItem1.pop();
        }
      }

    } else {
      this.menuListItemRegisteredUser = userState &&
      userState.toLowerCase() === 'inactive' ?
        menuListItemRegisteredUser_inactive : menuListItemRegisteredUser;
    }
    this.removeFinancialLinkForAlgUsers();
    this.alertService.clearError();

    if (this.r.snapshot.data && this.r.snapshot.data.myAccountData && this.r.snapshot.data.myAccountData) {
      const memberInfo = this.r.snapshot.data.myAccountData;
      this.accountInfo = memberInfo;
    }
  }

  public openFolder(folderItem: MyAccountMenu) {
    try {
      if (folderItem.url === '/sso/alegeus') {
        this.router.navigate(['/myfinancials']);
        // window.open('/sso/alegeus', '_blank');
      } else if (folderItem.url === '/sso/heathequity') {
        this.router.navigate(['/myfinancials']);
        // window.open('/sso/heathequity', '_blank');
      } else {
        this.router.navigate([`${folderItem.url}`]);
      }
    } catch (exception) {

    }
    return;
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  removeFinancialLinkForAlgUsers() {
    const isAlg = !!(this.authService && this.authService.authToken && this.authService.authToken.isALG && this.authService.authToken.isHEQ
      && (this.authService.authToken.isALG === 'true' || this.authService.authToken.isHEQ === 'true'));
    if (!isAlg && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      this.menuListItem1 = this.menuListItem1.filter((item) => item.icon !== 'financials');
      this.menuListItemMobile = this.menuListItemMobile.filter((item) => item.icon !== 'financials');
    } else if (this.authService.authToken.isHEQ === 'true' && this.authService.authToken.isALG === 'true') {
      this.menuListItem1.forEach((item) =>  {
        if (item['alertShortTxt'] === 'My Financials') {
          item['url'] = '/sso/alegeus';
        }
      });
      this.menuListItemMobile.forEach((item) =>  {
        if (item['alertShortTxt'] === 'My Financials') {
          item['url'] = '/sso/alegeus';
        }
      });
    } else if (this.authService.authToken.isHEQ === 'true') {
      this.menuListItem1.forEach((item) => {
        if (item['alertShortTxt'] === 'My Financials') {
          item['url'] = '/sso/heathequity';
        }
      });
      this.menuListItemMobile.forEach((item) => {
        if (item['alertShortTxt'] === 'My Financials') {
          item['url'] = '/sso/heathequity';
        }
      });
    }
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  stopEventPropagation(event) {
    event.stopPropagation();
  }


}

export interface MyAccountMenu {
  icon: string;
  unReadDocs: number;
  alertShortTxt: string;
  isFirstMenu: boolean;
  url: string;
  needPadding: boolean;
}
