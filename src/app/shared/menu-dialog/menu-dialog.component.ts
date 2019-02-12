import { Component, OnInit, Inject } from '@angular/core';
import { MaterialModule } from "../../material.module";
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from "@angular/material";

declare let $: any;

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {
  welcome : string;
  games : [{
      game: string,
      platform : string,
      release : string
  }];
  constructor(public thisDialogRef : MatDialogRef<MenuDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { 

    this.welcome = "Display List using ngFor in Angular 2"

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
        game : "The Winter's Curse",
        platform: "PS4",
        release : "May 23"
    }]

  }

  ngOnInit() {
  }

  onCloseConfirm()  {
    this.thisDialogRef.close('Confirm');
  }

  onCloseCancel(){
    this.thisDialogRef.close('Cancel');
  }

  closeMobileMenu(e) {
    this.thisDialogRef.close('Close');
 }
}
