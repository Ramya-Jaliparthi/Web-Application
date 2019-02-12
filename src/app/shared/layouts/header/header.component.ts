import { Component, OnInit, OnDestroy, Inject, HostListener, AfterViewInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../shared/services/global.service';
import { FINDADOCTORMENUITEM_TEXT, RIGHTTOPMENU, RIGHTTOPMENU_INACTIVE, LEFTTOPMENU, LEFTSECONDMENU } from './constants/header-constants';
import { MemberInfo } from '../../../shared/models/memberInfo.model';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { HeaderService } from './header.service';
import { HeaderMenu, HeaderInboxUnreadMsgCountReponse } from './models/header.model';
import { AuthService } from './../../services/auth.service';
import * as moment from 'moment-timezone';

declare let $: any;
let collapse = false;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: ISubscription;
  private toggleClick = false;
  private mobileViewPort = 992;
  private time = new Date();
  public memberData: MemberInfo;
  public memberFirstName: string;
  public ismobile: boolean;
  public sideNavStatus: string;
  public leftMenuId: string;
  public unReadMsgCount;
  public leftMenuList = LEFTTOPMENU;
  public leftMenuBottomList = LEFTSECONDMENU;
  public rightMenuList = RIGHTTOPMENU;
  public menuDrupalLinks: HeaderMenu[];
  public noApiLinks: boolean = true;
  public isAuthenticated = true; // isAuthenticated = this.authService.authToken && this.authService.authToken.scopename ? true : false;
  public estGreeting: string = null; // this.time.getHours();
  public showSearchBar: boolean = false;
  public showContactUs: boolean = false;
  public searchText: FormControl = new FormControl();
  public currentScope: string;
  public rweMenuList: any[];
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';
    }
    this.leftMenuId = this.ismobile ? 'slide-out-left' : 'dropdown1';
    this.toggleClick = false;
  }


  constructor(
    private globalService: GlobalService,
    private art: ActivatedRoute,
    private router: Router,
    public headerService: HeaderService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: any) {

    this.subscription = this.globalService.memberData$.subscribe(data => {
      this.memberData = data;
    });

    router.events.subscribe((val) => {
      $('.menu-icon').sideNav('hide');
    });
  }

  ngOnInit() {

    // this.headerService.getESTTime().subscribe(worldClockTimeResponse => {
    //   const estCurrentDateTime: string = worldClockTimeResponse.currentDateTime;
    //   const timeFraction = estCurrentDateTime.split('T')[1];
    //   const hour = Number(timeFraction.substring(0, timeFraction.indexOf(':')));
    const hour = moment.tz(new Date(), 'America/New_York').hour();

    if (this.authService && this.authService.authToken) {
      if (hour < 12) {
        this.estGreeting = 'Good morning';
      } else if (hour >= 12 && hour < 17) {
        this.estGreeting = 'Good afternoon';
      } else {
        this.estGreeting = 'Good evening';
      }
    }

    const minute = moment.tz(new Date(), 'America/New_York').minute();
    const currentTime = parseFloat(parseFloat(`${hour}.${minute}`).toFixed(2));
    const isRtmsUpmode = (currentTime >= 6 && currentTime <= 20) ? true : false;
    if (!isRtmsUpmode) {
      if (!this.authService.getRtmsMode()) {
        this.authService.setRtmsMode();
      }
    } else {
      this.authService.removeRtmsMode();
    }
    // }, err => {
    //   const hour = this.time.getHours();
    //   if (hour < 12) {
    //     this.estGreeting = 'Good Morning';
    //   } else if (hour >= 12 && hour < 17) {
    //     this.estGreeting = 'Good Afternoon';
    //   } else {
    //     this.estGreeting = 'Good Evening';
    //   }
    // });

    // this.memberFirstName = this.globalService.landingPageMemberInfo ? this.globalService.landingPageMemberInfo.memFistName
    //   : sessionStorage.getItem('FirstName');
    //   if (!sessionStorage.getItem('FirstName')) {
    //     sessionStorage.setItem('FirstName', this.memberFirstName);
    //   }
    this.currentScope = this.authService && this.authService.authToken && this.authService.authToken.scopename
      ? this.authService.authToken.scopename : '';

    if (this.currentScope === 'AUTHENTICATED-NOT-VERIFIED') {
      this.memberFirstName = this.authService && this.authService.authToken && this.authService.authToken.firstName
        ? this.authService.authToken.firstName : '';
    } else if (this.currentScope === 'AUTHENTICATED-AND-VERIFIED') {
      this.memberFirstName = this.authService && this.authService.authToken && this.authService.authToken.firstName
        ? this.authService.authToken.firstName : '';
    } else {
      this.memberFirstName = '';
    }


    this.ismobile = window.innerWidth <= this.mobileViewPort ? true : false;
    this.leftMenuId = this.ismobile ? 'slide-out-left' : 'dropdown1';
    if (this.art.snapshot.data.menu === undefined) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = this.art.snapshot.data.menu;
    }

    const init = function () {

      $('.menu-icon').sideNav({
        menuWidth: '100%', edge: 'right', onOpen: () => { $('body').removeAttr('style'); }
      });
      $('.mobile-square-logo').sideNav({ menuWidth: '100%', onOpen: () => $('body').removeAttr('style') });

      $('.dropdown-button').dropdown({
        closeOnClick: false
      });
    };

    if (this.isAuthenticated) {
      // To load the drupal menu items
      this.setMenuItems();
      if (!this.headerService.unReadMsgCount) {
        this.setInboxUnreadMsgCount();
      }
    }


    $(document).ready(init);
    // setTimeout(() => $(document).ready(init), 1000);

    // preparing rweMenuList;
    this.rweMenuList = JSON.parse(JSON.stringify(RIGHTTOPMENU));
    this.rweMenuList.pop();
  }

  ngAfterViewInit() {
    setTimeout(() => $('.collapsible').collapsible(), 1000);
  }

  getRightMenu() {

    let val = RIGHTTOPMENU;
    if (this.authService.authToken && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      if (!(this.authService.authToken.isALG === 'true' || this.authService.authToken.isHEQ === 'true')) {
        val = val.filter((item) => (item['name'] !== 'My Financials'));
      }
    }

    if (this.authService.authToken && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      if (this.authService.authToken.isHEQ === 'true' && this.authService.authToken.isALG === 'true') {
        val.forEach((item) => {
          if (item['name'] === 'My Financials') {
            item['url'] = '/sso/alegeus';
          }
        });
      } else if (this.authService.authToken.isALG === 'true') {
        val.forEach((item) => {
          if (item['name'] === 'My Financials') {
            item['url'] = '/sso/alegeus';
          }
        });
      } else if (this.authService.authToken.isHEQ === 'true') {
        val.forEach((item) => {
          if (item['name'] === 'My Financials') {
            item['url'] = '/sso/heathequity';
          }
        });
      }
    }

    if (this.authService.authToken && this.authService.authToken.scopename !== 'AUTHENTICATED-AND-VERIFIED') {
      val = this.updateFindADoctorUrl(val);
    } else if (this.authService.authToken && this.authService.authToken.HasActivePlan === 'false'
      && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      val = RIGHTTOPMENU_INACTIVE;
    } else if (this.authService.authToken && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED'
      && (this.authService.authToken.HasActivePlan && this.authService.authToken.HasActivePlan.toLowerCase() === 'true')
      && (this.authService.authToken.userType === 'MEDICARE' ||
        (this.authService.authToken.planTypes && this.authService.authToken.planTypes['medical'] !== 'true')
      )) {
      val = this.rweMenuList.filter((item) => item.url !== '/request-estimate');
    }

    if (
        this.authService.authToken &&
        this.authService.authToken.scopename !== 'AUTHENTICATED-AND-VERIFIED') {
          if (val) {
            val = val.filter((item) => item['url'] !== '/myplans');
          } else {
            val = this.rweMenuList.filter((item) => item.url !== '/myplans');
          }
    }
    return val;
  }


  public setMenuItems() {
    // this.menuDrupalLinks$ = this.headerService.getMenuItems();
    this.rightMenuList = this.globalService.landingPageMemberInfo && this.globalService.landingPageMemberInfo.userState === 'InActive'
      ? RIGHTTOPMENU_INACTIVE : RIGHTTOPMENU;
    if (!this.headerService.menuItems) {
      this.headerService.getMenuItems().subscribe(apiData => {
        //  apiData = null;
        if (apiData && apiData.length) {
          this.noApiLinks = false;
          this.menuDrupalLinks = apiData;
          // console.log(this.menuDrupalLinks);
          this.headerService.menuItems = apiData;
          const url = apiData[0].absolute;
          this.headerService.searchUrlTarget = url.substring(0, url.lastIndexOf('com') + 3);
        }
      });
    } else {
      this.menuDrupalLinks = this.headerService.menuItems;
    }
  }


  updateFindADoctorUrl(listItems) {
    const currentScope = this.authService && this.authService.authToken && this.authService.authToken.scopename
      ? this.authService.authToken.scopename : '';

    if (currentScope !== 'AUTHENTICATED-AND-VERIFIED' && listItems && listItems.length > 0) {
      const findADoctorIndex = listItems.findIndex((item) => item.name === FINDADOCTORMENUITEM_TEXT);
      if (findADoctorIndex > -1) {
        listItems[findADoctorIndex].url = 'https://myblue.bluecrossma.com/health-plan/find-doctor-provider-dentist';
        listItems[findADoctorIndex].sso = false;
      }
    }
    return listItems;
  }

  public redirectToMenuPage(event, url: string): void {
    event.preventDefault();
    if (url) {
      // this.document.location.href = url;
      this.router.navigate([url]);
    }
  }

  public leftMenuSelect(): void {
    this.leftMenuId = this.ismobile ? 'slide-out-left' : 'dropdown1';
    this.toggleClick = !this.toggleClick;
  }


  public signOut(): void {
    this.globalService.logout();
  }

  public closeMobileMenu(e): void {
    collapse = false;
    $(e.target).sideNav('hide');
    this.toggleClick = false;
  }

  public closeMobileMenuForNavigatetoSamePage(e, menu, navigateFlag?: boolean): void {
    e.preventDefault();
    if (menu.url === this.router.url) {
      collapse = false;
      $(e.target).sideNav('hide');
    }
    if (navigateFlag) {
      if (/http[s]?:\/\//.test(menu.url)) {
        // if the link points to an external url do the required redirect
        window.location.href = menu.url;
      } else {
        // if the link points to an route url do the neccessary routing
        if (menu.url === '/fad') {
          window.open('/fad', '_blank');
          $('.menu-icon').sideNav('hide');
        } else if ((menu.url === '/sso/alegeus') && this.authService.authToken &&
          this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
          window.open('/sso/alegeus', '_blank');
          $('.menu-icon').sideNav('hide');
        } else if ((menu.url === '/sso/heathequity') && this.authService.authToken &&
          this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
          window.open('/sso/heathequity', '_blank');
          $('.menu-icon').sideNav('hide');
        } else  {
          this.router.navigate([menu.url]);
        }
      }
    }
  }


  public menuCollapse(e): void {
    if (!this.ismobile) {
      collapse = true;
    } else {
      collapse = false;
    }
  }

  public toggleCollapse(e): void {
    if (($('#collapsible' + 'li') || $('#collapsible1' + 'li')) && collapse === true) { // || this.rightMenuList.sso === false
      e.stopPropagation();
    }
    collapse = false;
  }

  /**
   *
   *
   * @param {*} [oSearch]
   * @memberof HeaderComponent
   */
  public redirectToGetSearchResults(oSearch?: any): void {

    const url = this.headerService.searchUrlTarget + `/search/node?keys=`,
      searchTextValue = this.searchText.value;

    let trimmedSearchText;

    if (searchTextValue) {
      trimmedSearchText = searchTextValue.trim();
      if (trimmedSearchText) {
        if (!oSearch || (oSearch && oSearch.which === 13)) {
          // Redirect to myblue website to get the search results
          this.document.location.href = `${url}${trimmedSearchText}`;
        }
      }
    }
  }

  public clearSearch(): void {
    this.searchText.setValue('');
  }

  public clickSearchBar(e): void {
    this.showContactUs = false;
    this.showSearchBar = !this.showSearchBar;
    if (this.showSearchBar) {
      this.document.body.style.overflowX = 'hidden';
    } else {
      this.document.body.removeAttribute('style');
    }
  }

  public toggleContactUs(): void {
    this.showSearchBar = false;
    this.showContactUs = !this.showContactUs;
  }


  private setInboxUnreadMsgCount() {
    this.headerService.unReadMsgCount = this.authService.authToken ? Number(this.authService.authToken.unreadMsgCount) : 1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

