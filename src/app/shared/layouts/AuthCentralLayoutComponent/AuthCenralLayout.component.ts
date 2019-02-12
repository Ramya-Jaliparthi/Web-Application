import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authcentrallayout-home',
  templateUrl: './AuthCenralLayout.component.html',
  styleUrls: ['./AuthCenralLayout.component.scss']
})
export class AuthCentralLayoutComponent implements OnInit {
  isLogin = false;
  currentYear: any = '';
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getScopeName() === 'AUTHENTICATED-AND-VERIFIED' ? this.isLogin = true : this.isLogin = false;
    this.currentYear = (new Date()).getFullYear();
  }
}
