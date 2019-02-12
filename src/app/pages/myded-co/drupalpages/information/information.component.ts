import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-mydedcoinformation',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})

export class InformationComponent {
    goBack() {
        window.history.back();
    }
}
