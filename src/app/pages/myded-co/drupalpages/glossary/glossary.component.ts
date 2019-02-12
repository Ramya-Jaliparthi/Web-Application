import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav, MatRadioGroup, MatSelectionList, MatSelectionListChange, MatCalendar } from '@angular/material';

@Component({
    selector: 'app-mydedcoglossary',
    templateUrl: './glossary.component.html',
    styleUrls: ['./glossary.component.scss']
})

export class GlossaryComponent implements OnInit {

    isOverallDeductible= true;
    isEffectiveDate= true;
    isExceptionsExclusions= true;
    isOutPocketMaximum= true;
    collapsedHeight: string;
    expandedHeight: string;
    constructor () {
        this.expandedHeight = '44px';
    }

    goBack() {
        window.history.back();
    }
    ngOnInit(): void {
        this.isOverallDeductible = true;
        this.isEffectiveDate = true;
        this.isExceptionsExclusions = true;
        this.isOutPocketMaximum = true;
    }
}
