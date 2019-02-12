import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MyplansComponent} from '../myplans.component';

@Component({
  selector: 'app-dialog-terms',
  templateUrl: 'dialogTerms.component.html',
  styleUrls: ['dialogTerms.component.scss']
})
export class DialogTermsComponent {
  constructor( public dialogRef: MatDialogRef<MyplansComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
