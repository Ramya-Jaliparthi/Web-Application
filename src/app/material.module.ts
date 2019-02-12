import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule,
    MatCardModule, MatMenuModule, MatExpansionModule, MatDialogModule,
    MatFormFieldModule, MatCheckboxModule, MatRadioModule, MatListModule,
    MatListItem, MatDatepickerModule, MatCalendar, MatNativeDateModule, MatInputModule, MatTabsModule, MatSelectModule, MatAutocompleteModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatExpansionModule,
        MatDialogModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatTabsModule,
        MatSelectModule,
        MatAutocompleteModule
    ],
    exports: [
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatExpansionModule,
        MatDialogModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule,
        MatDatepickerModule,
        MatListItem,
        MatCalendar,
        MatNativeDateModule,
        MatInputModule,
        MatTabsModule,
        MatSelectModule,
        MatAutocompleteModule
    ]
})

export class MaterialModule {

}
