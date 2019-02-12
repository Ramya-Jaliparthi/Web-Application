import { Component, OnInit, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

declare let $: any;

@Component({
  selector: 'app-logo-dialog',
  templateUrl: './logo-dialog.component.html',
  styleUrls: ['./logo-dialog.component.scss']
})
export class LogoDialogComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<LogoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {  }

  ngOnInit() {
  }

  closeMobileMenu(e) {
    this.thisDialogRef.close('Close');
 }

}
