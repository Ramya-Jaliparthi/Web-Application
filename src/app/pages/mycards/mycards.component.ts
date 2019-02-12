import { Component, ElementRef, EventEmitter, HostListener, OnInit,  ViewChild, OnDestroy } from '@angular/core';
import { DependantsService } from '../../shared/services/dependant.service';
import { GlobalService } from '../../shared/services/global.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatRadioGroup, MatSidenav, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../shared/services/auth.service';
import { CardComponent } from './card/card.component';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { MyCardsService } from '../../shared/services/mycards/mycards.service';
import { DependentsModelInterface } from '../myclaims/models/interfaces/dependants-model.interface';
import { GetMemBasicInfoResponseModelInterface } from '../../pages/medications/models/interfaces/get-member-basic-info-model.interface';
import { DependentsModel } from '../myclaims/models/dependants.model';
import { environment } from '../../../environments/environment';
import { ConstantsService } from '../../shared/shared.module';
import { AlertService } from '../../shared/shared.module';
import { AlertType } from '../../shared/alerts/alertType.model';

@Component({
    templateUrl: './mycards.component.html',
    styleUrls: ['./mycards.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            state('out', style({
                transform: 'translate3d(-100%,0,0)',
                display: 'none'
            })),
            transition('in => out', animate('100ms ease-in-out')),
            transition('out => in', animate('100ms ease-in-out'))
        ])
    ]
})

export class MycardsComponent implements OnInit, OnDestroy {
    @ViewChild('cardfrontCanvas') canvasFrontRef: ElementRef;
    @ViewChild('cardbackCanvas') canvasBackRef: ElementRef;
    @ViewChild('cardsContainer') cardContainer: ElementRef;
    @ViewChild('cards') card: CardComponent;
    @ViewChild('members') members: MatSelectionList;

    dependentList: DependentsModelInterface = new DependentsModel();
    res = [];
    cards: any[];
    membersList = [];
    isFrontView: boolean;
    currentView: string;
    memberName: string;
    dependant: string;
    sideNavHeight: string;
    sideNavStatus: string;
    sideNavMode: string;
    index: number;
    isSidenavOpened: boolean;
    ismobile: boolean;
    collapsedHeight: string;
    expandedHeight: string;
    mobileViewPort = 992;
    filterWidth: string;
    isexpanded: boolean;
    bHasDependents: boolean;
    aSelectedList = [];
    userString: string;
    isDataLoaded = false;
    showClearLink = false;
    memberFrontCard: any[];
    memberBackCard: any[];
    dependentBackCard: any[];
    dependentFrontCard: any[];
    changedCheckbox: boolean;
    contactNumber: any;
    downloadFileName: string;
    cardData: boolean =  false;
    public basicMemInfo: GetMemBasicInfoResponseModelInterface;
    fpoTargetUrl = environment.drupalTestUrl + '/page/mycards';
    myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
    @ViewChild('searchDrpContainer') searchDrpContainer;
    @ViewChild('sideNavContainer') elementView: ElementRef;
    @ViewChild('filterWidth') filterElementView: ElementRef;
    @ViewChild('searchInput') searchInput;
    @ViewChild('sidenav') sideNav: MatSidenav;
    @ViewChild('dependantFilter') dependantFilterComponent: MatRadioGroup;
    contactus = this.constants.contactus + this.authService.authToken.scopename;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth <= this.mobileViewPort) {
            this.ismobile = true;
        } else {
            this.ismobile = false;
            this.sideNavStatus = 'in';
        }
    }

    constructor(public dependantsService: DependantsService,
        private cardService: MyCardsService,
        private alertService: AlertService,
        public authService: AuthService,
        public globalService: GlobalService,
        public authHttp: AuthHttp,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private constants: ConstantsService) {
        this.res = this.activatedRoute.snapshot.data.cardsInfo;
        this.sideNavMode = 'side';
        this.index = -1;
        this.isSidenavOpened = false;
        this.collapsedHeight = '32px';
        this.expandedHeight = '40px';
        this.isexpanded = true;
        this.sideNavHeight = '600';
        this.bHasDependents = false;
        this.dependentBackCard = [];
        this.dependentFrontCard = [];
        this.userString = '';
        this.cards = [];
        this.changedCheckbox = false;


        if (window.innerWidth <= this.mobileViewPort) {
            this.ismobile = true;
        }
        this.sideNavStatus = this.ismobile ? 'out' : 'in';
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        this.isFrontView = true;
        this.currentView = 'View Back';
        this.memberName = '';
        // this.dependentList = [];//this.authService.getDependentsList();
    }
        ngOnDestroy() {
        this.alertService.clearError();
        }
    ngOnInit() {

        // if (this.authService.authToken.planTypes && this.authService.authToken.planTypes.medical === 'false') {
        //     this.router.navigate(['/orderreplacement']);
        //     return;
        // }
        // this.dependant = this.userString;
        // this.dependentList = this.res[0];
        if (this.res[0] && this.res[0].result && this.res[0].result < 0) {
            this.cardData = false;
            this.alertService.setAlert(this.res[0]['displaymessage'], '', AlertType.Failure);
        } else if (this.res[1] && this.res[1].result && this.res[1].result < 0) {
          this.cardData = false;
          this.alertService.setAlert(this.res[1]['displaymessage'], '', AlertType.Failure);
        } else {
            this.memberFrontCard = this.res[0];
            this.memberBackCard = this.res[1];

            if (this.memberBackCard !== undefined) {
                this.contactNumber = this.memberBackCard.find(backCard => backCard.CopyLoc === 'Para4');
            }

            if (this.memberFrontCard && this.memberBackCard) {
              this.cardData = true;
            //   this.bHasDependents = this.memberFrontCard && this.memberFrontCard.length > 1;
              this.membersList = this.getMembersList();
              this.bHasDependents = this.membersList && ((this.membersList.length - 1) > 1);
            }
            // const dependentListObject: any = Object.assign({}, this.dependentList);
        }


        // // if (this.bHasDependents) {
        //     this.cardService.getDependentBackData$().subscribe((data) => {
        //         this.dependentBackCard = data;

        //     });
        //     this.cardService.getDependentFrontData$().subscribe((data) => {
        //         this.dependentFrontCard = data;

        //     });

        // }
        // const dependentsInfo = this.authService.getDependentsList();
        // if (dependentsInfo && dependentsInfo.dependents && dependentsInfo.dependents.length > 0
        //     && this.res[0].length > 0) {   // && this.res[0][0].length > 0
        //     // this.res[0] = this.res[0][0].concat(dependentsInfo);
        //     this.res[0] = this.res[0].concat(dependentsInfo);
        // }
        // this.memberName = this.res[0][0].MemName;
        // this.bHasDependents = this.res[0][0].hasDependents && (this.dependentList && !!this.dependentList.dependents.length);
        // if (this.bHasDependents) {
        //     this.res.push(...this.dependentList.dependents);

        // } else {
        //     this.applyFilter(true);
        // }

        // this.cards = [{
        //     cardType: 'Medical',
        //     memberCardFrontData: this.memberFrontCard[0],
        //     memberCardBackData: this.memberBackCard
        // }];
        this.applyFilter(true);

        console.log('Cards Data', this.cards);
    }

    getMembersList() {
        const membersListItems = [];
        const memberSuffItems = [];
        // membersListItems.push(
        //     {
        //         value: this.userString,
        //         selected: true || this.dependant === 'All',
        //         name: this.memberFrontCard[0].MemName
        //     });

        // if (this.dependentList && this.dependentList.dependents) {
        this.memberFrontCard.forEach((member) => {
            // if suffix is there then condition is
            // if(member.MemSuff === this.res[2].rxSummary.memSuff)
            if (memberSuffItems.indexOf(member.MemSuff) !== -1) {
                return;
            }
            memberSuffItems.push(member.MemSuff);
            let memName = '';
            if (this.res[2].rxSummary && this.res[2].rxSummary.memMiddleInitial) {
                memName = this.res[2].rxSummary.memFirstName + ' ' + this.res[2].rxSummary.memMiddleInitial + ' ' + this.res[2].rxSummary.memLastName;
            } else {
                memName = this.res[2].rxSummary.memFirstName + ' ' + this.res[2].rxSummary.memLastName;
            }
            if (member.MemName === memName || member.MemSuff.includes(this.res[2].rxSummary.suffix)) {
                this.userString = member.RowNum.toString();
                membersListItems.push({
                    value: member.MemSuff, // member.RowNum.toString(),
                    selected: true,
                    name: member.MemName,
                    relationship: member.relationship
                });
            } else {
                membersListItems.push({
                    value: member.MemSuff, // member.RowNum.toString(),
                    selected: false,
                    name: member.MemName,
                    relationship: member.relationship
                });
            }
        });
        // }
        membersListItems.push({
            value: 'All',
            selected: this.dependant === 'All',
            name: 'All Members'
        });

        // const uniqueMemName = this.membersList.filter(uniqueMemeber => uniqueMemeber.)
        return membersListItems;
    }

    getSelectedMembers() {
        return this.members.selectedOptions.selected;
    }

    getCanvasElement() {
        return this.cardContainer.nativeElement.children[0];
    }

    toggleFilter(toggleStatus) {
        this.isSidenavOpened = !this.isSidenavOpened;
        this.sideNavStatus = this.sideNavStatus === 'out' ? 'in' : 'out';
        if (toggleStatus) {
            this.sideNavStatus = toggleStatus;
        }
        if (window.innerWidth <= 992) {
            this.sideNavMode = 'over';
        } else {
            this.sideNavMode = 'side';
        }
    }

    closeSideNavigation() {
        this.isSidenavOpened = false;
    }

    closeFilter() {
        if (this.ismobile) {
            this.sideNavStatus = 'out';
            this.isSidenavOpened = false;
        }
    }

    // ngAfterViewInit() {
    //     this.drawUserCard();
    // }

    clearFilter() {
        // this.dependant = 'User';
        let memName = '';
        if (this.res[2].rxSummary && this.res[2].rxSummary.memMiddleInitial) {
            memName = this.res[2].rxSummary.memFirstName + ' ' + this.res[2].rxSummary.memMiddleInitial + ' ' + this.res[2].rxSummary.memLastName;
        } else {
            memName = this.res[2].rxSummary.memFirstName + ' ' + this.res[2].rxSummary.memLastName;
        }

        this.membersList = this.membersList.map((member) => {
            member.selected = member.name === memName || member.value.includes(this.res[2].rxSummary.suffix);
            return member;
        });

        this.showClearLink = false;
        // this.setShowClearLink();
        this.applyFilter(false);
    }

    setShowClearLink() {
        this.showClearLink = ((this.aSelectedList.length > 1) || (this.aSelectedList.length === 1 &&
            this.aSelectedList[0].value !== this.userString));
    }

    getDependentsCardData() {
        let count = 0;
        this.aSelectedList.forEach((selectedMember) => {
            if (selectedMember.value !== 'User' && selectedMember.value !== 'All' && !this.checkDependentData(selectedMember.value)) {
                count = count + 1;
                this.cardService.getDependentBackData$(selectedMember.value).subscribe((data) => {
                    if (data) {
                        this.dependentBackCard.push({ depId: selectedMember.value, data: data });
                    }

                });
                this.cardService.getDependentFrontData$(selectedMember.value).subscribe((data) => {
                    if (data) {
                        this.dependentFrontCard.push({ depId: selectedMember.value, data: data });
                    }
                    count = count - 1;
                    if (!count) {
                        this.displaySelectedDependantData();
                    }


                });
            }
            if (!count) {
                this.displaySelectedDependantData();
            }

        });
    }

    applyFilter(bApplyFilter: boolean) {
        this.closeFilter();
        this.closeSideNavigation();
        this.aSelectedList = this.getSelectedMembers();
        if (!bApplyFilter) {
            this.displaySelectedDependantData();
            // this.cards = [{
            //     cardType: 'Medical',
            //     memberCardFrontData: this.memberFrontCard[0],
            //     memberCardBackData: this.memberBackCard
            // }];
            return;
        }
        if (this.changedCheckbox && (!this.aSelectedList.length || (this.dependant === 'All' && this.aSelectedList.length === 1))) {
            this.clearFilter();
            return;
        }
        // this.getDependentsCardData();
        this.displaySelectedDependantData();
        this.setShowClearLink();
    }

    displaySelectedDependantData() {
        // if (this.res && this.memberFrontCard[0] && this.res[0].length > 0) {
        // if (this.aSelectedList.length) {
        const aTotalCards = [];
        let memberFrontData;
        this.downloadFileName = '';
        // let dependentBackData;
        // const dependentFrontCard = (this.dependentFrontCard && this.dependentFrontCard.length) ? this.dependentFrontCard : [];
        // const dependentBackCard = (this.dependentBackCard && this.dependentBackCard.length) ? this.dependentBackCard : [];
        this.membersList.forEach((oMembers) => {
            if (oMembers.value !== 'All' && oMembers.selected) {
                this.downloadFileName = this.downloadFileName ? 'All' : oMembers.name;
                memberFrontData = this.memberFrontCard.filter(member => member.MemSuff === oMembers.value);

                // if (oMembers.value !== 'User') {
                //     dependentFrontData = dependentFrontCard.length &&
                //         dependentFrontCard.find(dependentInfo => dependentInfo.depId.toString() === oMembers.value.toString());
                //     dependentBackData = dependentBackCard.length &&
                //         dependentBackCard.find(dependentInfo => dependentInfo.depId.toString() === oMembers.value.toString());
                // }
                memberFrontData.forEach((memberData) => {
                    aTotalCards.push.apply(aTotalCards, [{
                        cardType: 'Medical',
                        memberCardFrontData: memberData ? memberData : [],
                        memberCardBackData: this.contactNumber ? [this.contactNumber] : []
                    }]);
                });
            }
        });
        this.cards = aTotalCards;

        // } else {
        // this.cards = [];
        // }
        // }
    }

    downloadPdf() {
        // this.card.downloadPdf(this.cardContainer.nativeElement, this.dependant);
        const dependent = this.membersList.filter(member => member.selected === true);
        const SFileName = dependent && dependent.length === 1 ? dependent[0].name : 'All';
        if (!this.cardData) {
          this.alertService.setAlert('This feature is not currently available. Please try again later.', '', AlertType.Failure);
        }
        this.card.downloadPdf(this.cardContainer.nativeElement, this.downloadFileName);
    }
    checkDependentData(value) {
        const dependentObj = this.dependentFrontCard.find(dependentData => dependentData.depId.toString() === value.toString());
        return !!dependentObj;

    }

    onMemberSelectionChange(selectionListChange: MatSelectionListChange) {
        this.changedCheckbox = true;
        const changeEvent = selectionListChange.option;
        this.dependant = changeEvent.value;
        this.aSelectedList = this.getSelectedMembers();
        this.selectAllMembers(changeEvent.selected, changeEvent.value);
    }


    selectAllMembers(select: boolean, dependent: string) {
        this.membersList = this.membersList.map((member) => {
            if (dependent === 'All') {
                member.selected = select ? select : member.value === this.userString ? true : select;
            } else {
                member.selected = member.value.toString() === dependent ? select : member.selected;
            }

            if (dependent !== 'All' && !select && member.value === 'All' && member.selected) {
                member.selected = false;
            }
            if (this.aSelectedList.length === this.membersList.length - 1 &&
                dependent !== 'All' && select && member.value === 'All' && !member.selected) {
                member.selected = true;
            }
            return member;
        });
    }
    navigateToContactUs() {
        window.open(this.contactus, '_self');
    }
}
