import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/shared.module';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-debit-cards',
  templateUrl: './debit-cards.component.html',
  styleUrls: ['./debit-cards.component.scss']
})
export class DebitCardsComponent implements OnInit, OnDestroy {
  cards: any;
  mobileViewPort = 992;
  ismobile: boolean;
  cardStatusCodes = {
    1: 'New',
    2: 'Active',
    3: 'Temporarily Inactive',
    4: 'Permanently Inactive',
    5: 'Lost/Stolen'
  };
  public breadCrumbs: BreadCrumb[];
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }

  constructor(private router: Router,
              private http: AuthHttp,
              private alertService: AlertService) {

  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
    this.http.get('/assets/data/alegeus/alegeuscardslist.json').subscribe((res) => {
      console.log(res['cardListInfo']);
      this.cards = res['cardListInfo'];
    });
    // this.cards = [
    //   {status: 'Active', number: 'xxxxxx - 1234', name: 'John Sample'},
    //   {status: 'Active', number: 'xxxxxx - 1234', name: 'John Sample'},
    //   {status: 'Active', number: 'xxxxxx - 1234', name: 'John Sample'},
    //   {status: 'New', number: 'xxxxxx - 5678', name: 'John Sample'},
    //   {status: 'Pending', number: 'xxxxxx - 5678', name: 'John Sample'}
    // ];
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  navigateToDetails() {
    try {
      this.router.navigate(['myfinancials/carddetails']);
    } catch (e) {

    }

  }

  getCardStatus(cardStatusCode) {
    return this.cardStatusCodes[cardStatusCode] ? this.cardStatusCodes[cardStatusCode] : 'Other';
  }

  prepareChildBreadCrumbs(folderId) {
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
    });
    this.breadCrumbs.push({
      label: 'My Financials',
      url: ['/myfinancials']
    }, {
      label: 'Manage Debit Cards',
      url: [this.router.url]
    });

  }
}
