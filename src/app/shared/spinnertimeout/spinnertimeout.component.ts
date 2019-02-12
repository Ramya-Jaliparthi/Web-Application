import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared.module';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from '../../shared/services/authHttp.service';

@Component({
  selector: 'app-spinnertimeout',
  templateUrl: './spinnertimeout.component.html',
  styleUrls: ['./spinnertimeout.component.scss']
})
export class SpinnertimeoutComponent implements OnInit {

  watchSpinner: Observable<any>;
  constructor(private router: Router,
    private authService: AuthService,
    private authHttp: AuthHttp) {
    this.watchSpinnerActions();
  }

  ngOnInit() {
  }

  watchSpinnerActions() {
    setInterval(() => {
      const spinnerEnd: number = Number.parseInt(sessionStorage.getItem('spinnerEnd'));
      if (this.authHttp.spinnerStarted === true) {
        const currentTime = Date.now();
        if (currentTime >= spinnerEnd) {
          this.authHttp.hideSpinnerLoading();
          // this.router.navigate(['/mymedications']); -->Drop4 to decide this logic
        }
      }
    }, 500);
  }

}
