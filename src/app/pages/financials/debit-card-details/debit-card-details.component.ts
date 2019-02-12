import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';
@Component({
  selector: 'app-debit-card-details',
  templateUrl: './debit-card-details.component.html',
  styleUrls: ['./debit-card-details.component.scss']
})
export class DebitCardDetailsComponent implements OnInit {
  cardDetails = null;
  public breadCrumbs: BreadCrumb[];

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
    this.cardDetails = {
      status: 'Active',
      number: 'xxxxxx - 1234',
      name: 'John Sample',
      issueStatus: 'Sent',
      mailedDate: '12/12/2018',
      activationDate: '12/12/2018',
      expirtyDate: '12/12/2021',
      showActivateButton: true,  // should be false for lost and active cards
      showLostReportButton: true // should be false for lost
    };
  }

  navigateToActivatePage() {
    try {
      this.router.navigate(['myfinancials/activatecard']);
    } catch (e) {

    }
  }

  navigateToReportCardPage() {
    try {
      this.router.navigate(['/myfinancials/reportcard']);
    } catch (e) {

    }
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
      url: ['/myfinancials/cards']
    }, {
      label: 'Card Details',
      url: [this.router.url]
    });

  }
}
