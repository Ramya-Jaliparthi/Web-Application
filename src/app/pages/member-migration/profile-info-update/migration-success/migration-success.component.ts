import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MigrationService } from '../../migration.service';

declare let $: any;

@Component({
    selector: 'app-migration-success',
    templateUrl: './migration-success.component.html',
    styleUrls: ['./migration-success.component.scss']
})

export class MigrationSuccessComponent implements OnInit {

    public userid: string = localStorage['login-user'];

    constructor(private location: Location,
        private router: Router,
        public migrationService: MigrationService) { }

    ngOnInit() {
    }

    exploreNew(): void {
        this.router.navigate(['/login']);
    }

}

