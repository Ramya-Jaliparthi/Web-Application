import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orderidcard-layout',
  templateUrl: './OrderIdCardLayout.component.html',
  styleUrls: ['./OrderIdCardLayout.component.scss']
})
export class OrderIdCardLayoutComponent implements OnInit {
  isLogin = false;
  currentYear: any = '';
  isRtmsUpmode: boolean;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getScopeName() === 'AUTHENTICATED-AND-VERIFIED' ? this.isLogin = true : this.isLogin = false;
    this.currentYear = (new Date()).getFullYear();
    this.isRtmsUpmode = this.authService.getRtmsMode();
  }
}
