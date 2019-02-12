import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FinancialsConstants} from '../constants/financials.constants';
import {AlertService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-activate-card',
  templateUrl: './activate-card.component.html',
  styleUrls: ['./activate-card.component.scss']
})
export class ActivateCardComponent implements OnInit {
  cardDetails: any;
  public breadCrumbs: BreadCrumb[];

  constructor(private router: Router,
              private alertService: AlertService) {

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
      expirtyDate: '12/12/2021',
      showActivateButton: true,  // should be false for lost and active cards
      showLostReportButton: true // should be false for lost
    };
  }

  naivagteToCardDetailsPage() {
    try {
      this.router.navigate(['myfinancials/carddetails']);
    } catch (exp) {

    }
  }

  onSubmit() {
    try {
      this.router.navigate(['/myfinancials/cards']).then(() => {
        this.alertService.setAlert('Your card has been activated', '', AlertType.Success);
      });
    } catch (exp) {

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
      url: ['/myfinancials/carddetails']
    }, {
      label: 'Activate Card',
      url: [this.router.url]
    });

  }
}
