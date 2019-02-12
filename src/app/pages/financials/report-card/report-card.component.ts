import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FinancialsConstants} from '../constants/financials.constants';
import {AlertService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {
  reportStolen: string = 'No';
  public breadCrumbs: BreadCrumb[];

  constructor(private router: Router,
              private alertService: AlertService) {

  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
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
        this.alertService.setAlert('Your card reported has stolen', '', AlertType.Success);
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
      label: 'Lost/Stolen Cards',
      url: [this.router.url]
    });

  }

}
