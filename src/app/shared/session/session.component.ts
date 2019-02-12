import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { AuthHttp } from '../services/authHttp.service';
import { GlobalService } from '../services/global.service';
declare let $: any;


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  logout = false;

  ngOnInit() {
    $('#session-modal').modal({ dismissible: true });
  }

  constructor(private router: Router, private idle: Idle,
    private keepalive: Keepalive, private globalService: GlobalService,
    private authService: AuthService, private alertService: AlertService,
    private authHttp: AuthHttp) {

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(780);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(120);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      // popup close
      // this.idleState = 'No longer idle.'
      // $('#session-modal').modal('close');
    });

    idle.onTimeout.subscribe(() => {
      // console.log('time out attempt');
      if (this.authService.useridin && this.authService.useridin !== 'undefined') {
        // prevent the user from timing out in case of anonymous login, eg in case of fad
        // console.log('time out attempt -> denied ');
        this.idle.watch();
        this.timedOut = false;
        this.authService.getUpdatedTokens()
          .subscribe(token => {
            this.authService.cryptoToken = token;
            this.authService.persistSession();
          });
        return;
      }

      // login url
      // this.idleState = 'Timed out!';
      this.timedOut = true;
      if (!this.logout) {
        this.close();
      }
      // this.router.navigate(['../login']);
    });



    idle.onIdleStart.subscribe(() => {
      // this.idleState = 'You\'ve gone idle!'
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      // open popup
      // const isConfirm = confirm('Press a button!');
      // if (isConfirm) {
      //   this.reset();
      // }else {
      //   this.router.navigate(['../login']);
      // }
      if (this.authService.useridin && this.authService.useridin !== 'undefined') {
        // prevent the user from timing out in case of anonymous login, eg in case of fad
        return;
      }
      $('#session-modal').modal('open');
      this.idleState = 'You session will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();

  }

  close() {
    this.logout = true;
    $('#session-modal').modal('close');
    this.authHttp.hideSpinnerLoading();
    this.globalService.logout();
    this.alertService.clearError();
  }

  reset() {
    this.idle.watch();
    // this.idleState = 'Started.';
    $('#session-modal').modal('close');
    this.timedOut = false;
  }
}
