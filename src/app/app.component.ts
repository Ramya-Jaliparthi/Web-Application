import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LayoutService } from './shared/services/layout.service';
import {NavigationEnd, Router, NavigationStart, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import { AuthHttp } from './shared/services/authHttp.service';
import { environment } from '../environments/environment';
import { SpinnerService } from './shared/services/spinner.service';
import { StorageService } from './shared/services/storage.service';
declare let $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'app';
  subject = new Subject<any>();
  showOverlay: boolean = true;
  includeOverlay: boolean = false;
  template = '<div class="row m-0 pd-0 spinner-height-100">' +
    '<div class="col s12 m4 l4 pd-0 spinner-height-0"></div>' +
    '<div class="col s12 m4 l4 pd-0 spinner-height-100 valign-wrapper justify-spinner-center">' +
    '<div class="row web30Spinner">' +
    '<div class="col s1 m1 l1 pd-0 mb-0"></div> <div class="col s1 m1 l1 pd-0 mb-0"></div> ' +
    '<div class="col s1 m1 l1 pd-0 mb-0"></div> <div class="col s1 m1 l1 pd-0 mb-0"></div> ' +
    '<div class="col s1 m1 l1 pd-0 mb-0"></div> <div class="col s1 m1 l1 pd-0 mb-0"></div> ' +
    '<div class="col s1 m1 l1 pd-0 mb-0"></div> <div class="col s1 m1 l1 pd-0 mb-0"></div> ' +
    '<div class="col s1 m1 l1 pd-0 mb-0"></div> <div class="col s1 m1 l1 pd-0 mb-0"></div> ' +
    '<div>Loading....</div>' +
    '</div>' +
    '</div>' +
    '<div class="col s12 l4 m4 pd-0"></div></div>';
  constructor(private router: Router,
    private layoutService: LayoutService,
    private authHttpService: AuthHttp,
    private spinner: SpinnerService,
    private storageService: StorageService) {

    if (!this.spinner.isOpacityUnsetSupported) {
      this.includeOverlay = true;
      this.spinner.setSubject(this.subject);
      this.subject.asObservable().subscribe(message => {
        this.showOverlay = message;
      });
    }
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.layoutService.setPageMeta(this.router.routerState.snapshot.root);
        this.router.navigated = false;
        if (event['url'] && (event['url'].includes('/account')) || (event['url'].includes('/myfinancials'))) {
        } else {
          sessionStorage.removeItem('planInfo');
        }
      }
    });
    // Adobe Dynamic Tagging
    if (environment.dynamicTagLink) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = environment.dynamicTagLink;    // use this for linked script
      script.async = true;
      document.head.appendChild(script);
    }

    // Browser ID implementation
    if (localStorage['browserID']) {
      console.log('current browser id :', localStorage['browserID']);
    } else {
      console.log('current browser id :', this.authHttpService.uuid());
    }

    /*  Storage.prototype.cryptoService = this.storageService;
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      const internalKey = 'bcbsmaTest';
      const internalValueFromSession = this._getItem(internalKey);
      if (this._getItem(internalKey) === null) {
        this._setItem(internalKey, this.cryptoService.intStorage());
      }
      if (key === 'authToken' ||
        key === 'token' ||
        key === 'useridin') {
          this._setItem(key, value);
      } else {
        this._setItem(internalKey, this.cryptoService.setvalue(key, value, internalValueFromSession));
      }
    };
    Storage.prototype._getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      const internalKey = 'bcbsmaTest';
      const internalValueFromSession = this._getItem(internalKey);
      if (key === 'authToken' ||
        key === 'token' ||
        key === 'useridin') {
          return this._getItem(key);
        } else {
          return this.cryptoService.getvalue(key, internalValueFromSession);
        }
    };
    (<any>window).onstorage = function(e) {
      console.log('The ' + e.key + ' key has been changed from ' + e.oldValue + ' to ' + e.newValue + '.');
    };
    sessionStorage.setItem('a', 'a');*/
  }

  ngAfterViewInit() {
    if (!this.spinner.isOpacityUnsetSupported) {
      $('ng4-loading-spinner .spinner').css('background', 'transparent !important');
    }
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.authHttpService.showSpinnerLoading();
        } else if (event instanceof NavigationEnd ||
          event instanceof NavigationCancel) {
          setTimeout(() => { window.scrollTo(0, 0); }, 1);
          this.authHttpService.hideSpinnerLoading();
        } else if (event instanceof NavigationError) {
          setTimeout(() => { window.scrollTo(0, 0); }, 1);
          console.log('Error occcured: ' + event);
          this.authHttpService.hideSpinnerLoading();
        }
      });
  }

  ngOnDestroy() {
    if (this.subject) {
      this.subject.unsubscribe();
    }
  }

}
