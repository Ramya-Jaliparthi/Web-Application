import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LogoDialogComponent } from "../logo-dialog/logo-dialog.component";
import { MenuDialogComponent } from "../menu-dialog/menu-dialog.component";
import { GlobalService } from '../services/global.service';

declare let $: any;


@Component({
  selector: 'app-core-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {
  
  games : [{
      game: string,
      platform : string,
      release : string
  }];
  // isActive: boolean;
  constructor(private globalService: GlobalService, private router: Router,public dialog: MatDialog) {
    // router.events.subscribe((data: any) => {
    //   if (data.url === '/claims') {
    //     this.isActive = false;
    //   } else {
    //    this.isActive = true;
    //   }
    // });
//Will be moving the below data to constant file later
    
    this.games = [{
        game : "Deus Ex: Mankind Divided",
        platform: " Xbox One, PS4, PC",
        release : "August 23"
    },
    {
        game : "Hue",
        platform: " Xbox One, PS4, Vita, PC",
        release : "April 23"
    },
    {
        game : "The Huntsman: Winter's Curse",
        platform: "PS4",
        release : "December 23"
    },
    {
        game : "The Winter's Soldier",
        platform: "PS4",
        release : "May 23"
    }]
  }
  //menuDropDown = MENULIST;
  time = new Date(); 
  hour = this.time.getHours();
  
  
  ngOnInit() {
    const init = function () {
      $('.mobile-icon').sideNav({ menuWidth: '100%', edge: 'right'});
      $('.dropdown-button').dropdown();
    };
    $(document).ready(init);
  }

  signOut(e) {
    $(e.target).sideNav('hide');
    this.globalService.logout();
  }

  medicareNav() {
    $('#medicareWebsite').modal('open');
  }

  closeMobileMenu(e) {
     $(e.target).sideNav('hide');
  }

  openDialog(): void{

    let dialogRef = this.dialog.open(MenuDialogComponent,{
      width: '30%',
      height: '100%',
      panelClass: 'menu-dialog'
    });

    dialogRef.updatePosition({ top: '0px', left: '60.25%' });
  }

  openBlueDialog(): void{

  let dialogRef = this.dialog.open(LogoDialogComponent,{
      width: '30%',
      height: '80%',
      panelClass: 'logo-dialog'
    });

    dialogRef.updatePosition({ top: '0px', right: '62.5%' });
  }

}
