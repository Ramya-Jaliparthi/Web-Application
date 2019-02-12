import {Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {DependantsService} from '../../shared/services/dependant.service';
import {GlobalService} from '../../shared/services/global.service';
import {OrderreplacementService} from '../../shared/services/orderreplacement/orderreplacement.service';
import {AuthService} from '../../shared/shared.module';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../shared/shared.module';
import {AlertType} from '../../shared/alerts/alertType.model';
import {OrderreplacementModel} from './orderreplacement.model';
import {DependentsResponseModelInterface} from '../myclaims/models/interfaces/dependants-model.interface';
import {DependentsResponseModel} from '../myclaims/models/dependants.model';

@Component({
  templateUrl: './orderreplacement.component.html',
  styleUrls: ['./orderreplacement.component.scss']
})
export class OrderreplacementComponent implements OnInit, OnDestroy {
  memberList: Array<any>;
  message: string;
  isEligible: boolean;
  isRtmsUpmode: boolean;
  public ismobile: any;
  mobileViewPort = 992;
  isReviewed: boolean;
  isSubmitted: boolean;
  submissionMessageHeader: string;
  submissionMessage: string;
  reviewMessage: string;
  submittedSuccessfully: boolean;
  sideNavStatus: string;
  header: string;
  res: any;
  isMemberText: boolean;
  userString: 'User' = 'User';
  dependant: string;
  dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  selectedMemberList = [];
  submittedMembersList: any[];
  subscriberAddress: any = {};
  successList: any[];
  failureList: any[];
  authTokenDetailsJson: any;
  orderIdCardsData: boolean = true;
  memberData: OrderreplacementModel = new OrderreplacementModel().deserialize({});

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';

    }
  }

  constructor(public authService: AuthService,
              private alertService: AlertService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public dependantsService: DependantsService,
              public orderreplacementService: OrderreplacementService,
              public globalService: GlobalService) {
    this.memberList = [];
    this.message = '';
    this.isEligible = true;
    this.isReviewed = false;
    this.isSubmitted = false;
    this.submittedMembersList = [];
    this.successList = [];
    this.failureList = [];
    this.submissionMessageHeader = '';
    this.submissionMessage = '';
    this.reviewMessage = 'Our records indicate you\'ve placed an order in the past 14 days. ' +
      'If you haven\'t received your card, call Member Service at ' +
      '<a href="tel:+18002622583" class="underline">1-800-262-BLUE (2583)</a>.';
    this.submittedSuccessfully = false;
    this.header = 'Order ID Card';
    this.isMemberText = true;
    this.dependentList = this.authService.getDependentsList();
    this.res = this.activatedRoute.snapshot.data.cardsData;
    console.log('Order Id cards Data', this.res);
    this.handleError(this.res);
    // need to move to this to guard
    // this.orderreplacementService.getCardPage().subscribe(data => {
    //   console.log(data);
    //   if (data.SubscriberAddress) {
    //     this.subscriberAddress = data.SubscriberAddress;
    //   }
    //   if (data.MemberDetails && data.MemberDetails.length) {
    //     // this.memberData = new MemberInfo().deserialize(data.MemberDetails[0]);
    //     this.memberList = this.getMembersList(data.MemberDetails);
    //     this.includeCardTypesForMember();
    //   }
    // });
  }

  handleError(errRes) {
    try {
      if (errRes && errRes['result'] && errRes['result'] < 0) {
        const displayMessage = errRes['displaymessage'] ? errRes['displaymessage'] : 'We\'re sorry, there\'s been a system error. Please try again.';
        this.alertService.setAlert(displayMessage, '', AlertType.Failure);
        this.orderIdCardsData = false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit() {
    if (this.authService.getRtmsMode()) {
      this.isRtmsUpmode = true;
    } else {
      this.isRtmsUpmode = false;
    }
    const data = this.res;
    if (data) {
      if (data.SubscriberAddress) {
        this.subscriberAddress = data.SubscriberAddress;
      }
      if (data.MemberDetails && data.MemberDetails.length) {
        // this.memberData = new MemberInfo().deserialize(data.MemberDetails[0]);
        this.memberList = this.getMembersList(data.MemberDetails);
        this.includeCardTypesForMember(data.MemberDetails);
      }
    }
    this.dependant = this.userString;
    const authTokenDetails = sessionStorage.getItem('authToken');
    if (authTokenDetails && authTokenDetails !== 'undefined') {
      this.authTokenDetailsJson = JSON.parse(authTokenDetails);
    }
    // if (authTokenDetailsJson && authTokenDetailsJson.planTypes && authTokenDetailsJson.userType === 'MEMBER'
    //   && (authTokenDetailsJson.planTypes.medical === 'false'
    //     || authTokenDetailsJson.planTypes.medical === false))
    // let aDependentList = this.authService.getDependentsList();
    // if (!this.dependentList) {
    //   this.dependantsService.getDependentsList().subscribe((response) => {
    //     this.dependantsService.setDependentList(response);
    //     this.dependentList = this.authService.getDependentsList();
    //     this.memberList = this.getMembersList();
    //     this.includeCardTypesForMember();
    //   });
    // } else {
    //   this.memberList = this.getMembersList();
    //   // this.includeCardTypesForMember();
    // }
  }

  includeCardTypesForMember(totalMembers) {
    this.memberList = this.memberList.map((member) => {
      const cardTypes = [];
      let isFirstPlanChecked = 0;
      const filteredMemebers = totalMembers.filter(totalMember => totalMember.MemberID === member.value);
      filteredMemebers.sort((filterMemberA, filterMemberB) =>
        (filterMemberA.PlanType > filterMemberB.PlanType) ? -1 : ((filterMemberB.PlanType > filterMemberA.PlanType) ? 1 : 0));
      filteredMemebers.forEach((filterdMember, sIndex) => {
        if (filterdMember.RequestIDcardEligibilityIndicator !== 'false' && !isFirstPlanChecked) {
          isFirstPlanChecked = sIndex + 1;
        }
        cardTypes.push({
          type: filterdMember.PlanType,
          planName: filterdMember.PlanName,
          groupNumber: filterdMember.GroupNumber,
          isChecked: isFirstPlanChecked === sIndex + 1,
          isEligible: filterdMember.RequestIDcardEligibilityIndicator
        });
        if (filterdMember.DateEligibilityIndicator === 'false' && !this.isReviewed) {
          this.isReviewed = true;
        }
      });

      // if (member.planType) {
      //   if (Object.prototype.toString.call(member.planType).indexOf('Array') !== -1) {
      //     member.planType.forEach((planType) => {
      //       cardTypes.push({ type: planType, isChecked: false });
      //     });
      //   } else {
      //     cardTypes.push({
      //       type: member.planType,
      //       isChecked: true
      //     });
      //   }
      // }

      return {
        ...member,
        cardTypes
      };
    });
  }

  // memberData.fullMemInfo
  getMembersList(data) {
    const membersListItems = [];
    let memberData: OrderreplacementModel;
    const memberSuffItems = [];
    let isRequestCardEligible = false;
    data.forEach((member) => {
      if (memberSuffItems.indexOf(member.MemberID) !== -1) {
        return;
      }
      const isEligible = data.find(eligibleMember =>
        (eligibleMember.MemberID === member.MemberID && eligibleMember.RequestIDcardEligibilityIndicator === 'true'));
      memberSuffItems.push(member.MemberID);
      memberData = new OrderreplacementModel().deserialize(member);
      if (member.Relationship === 'subscriber') {
        this.memberData = memberData;
      }
      membersListItems.push({
        ...memberData,
        value: member.MemberID,
        selected: !isRequestCardEligible && !!(isEligible),  // && member.Relationship === 'subscriber'
        name: memberData.fullMemInfo,
        aliasName: memberData.fullName,
        requestIdCardElegible: !!isEligible
      });
      if (!!isEligible) {
        isRequestCardEligible = true;
      }
    });
    // membersListItems.push(
    //   {
    //     ...this.memberData,
    //     value: this.userString,
    //     selected: this.dependant.includes(this.userString) || this.dependant === 'All',
    //     name: this.memberData.fullMemInfo
    //     // planType: this.memberData.planType

    //     // depRelationship: this.memberData.relationship
    //   });
    // if (this.dependentList) {
    //   this.dependentList.forEach((oDependent) => {
    //     membersListItems.push({
    //       value: oDependent.depId,
    //       selected: this.dependant.includes(oDependent.depId) || this.dependant === 'All',
    //       name: oDependent.MemName,
    //       // depRelationship: oDependent.depRelationsip
    //     });
    //   });
    // }
    return membersListItems;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  preparesuccessResponse(resultset) {
    // this.submittedMembersList
    const memberList = this.selectedMemberList && this.selectedMemberList.length ? this.selectedMemberList : this.memberList;
    resultset.forEach((result) => {
      const selectedMember = memberList.find(member => member.memberId === result.memberID);
      if (selectedMember) {
        result.result.toString() === '0' ? this.successList.push(selectedMember) : this.failureList.push(selectedMember);
      }
    });

  }

  submit() {
    const selectedMemberList = this.getSelectedMembersList();
    this.isSubmitted = true;
    this.orderreplacementService.submitCard(selectedMemberList).subscribe((resultset) => {
      const errorList = resultset.filter(result => result.result < 0);
      if (errorList && errorList.length === resultset.length) {
        this.alertService.setAlert(''  , 'Error!', AlertType.Failure);
        this.submissionMessageHeader = errorList.length > 1 ? 'We Can\'t Complete Your Order' : 'We Can\'t Complete Your Order';
        this.submissionMessage = resultset[0]['displayMessage'] || this.reviewMessage;
      } else {
        // this.setSubmittedMembers(response.subscriberNumber);
        this.alertService.setAlert('', 'Success!', AlertType.Success);
        this.submissionMessageHeader = 'We Received Your Order';
        this.submittedSuccessfully = true;
        this.preparesuccessResponse(resultset);
        // this.submissionMessage = resultset[0]['displayMessage'] || 'Your ID Cards will be issued for the following members: ';
        this.header = 'We\'ve received your order!';
      }
    });
    // this.updateSelectedMemberList();
    // if (!this.isReviewed) {
    //   this.reviewCard(false);
    //   return;
    // }
    // if (this.isReviewed) {
    //   this.isSubmitted = true;
    //   if (this.checkAuthorized()) {
    //     this.alertService.setAlert('', 'Success!', AlertType.Success);
    //     this.submissionMessageHeader = 'We have received your card!';
    //     this.submissionMessage = 'Your ID Cards will be issued for the following members: ';
    //     this.submittedSuccessfully = true;
    //     this.header = 'We\'ve received your order!';
    //   } else {
    //     this.alertService.setAlert('', 'Error', AlertType.Failure);
    //     this.submissionMessageHeader = 'We cant process  your card!';
    //     this.submissionMessage = this.reviewMessage;
    //   }

    // }
  }

  checkAuthorized() {
    return true;
  }

  reviewCard(bReview) {
    this.message = this.reviewMessage;
    this.isEligible = !bReview;
    this.isReviewed = true;
    this.isMemberText = false;
  }

  disbaledSubmitButton() {
    return this.memberList.every((member) => {
      if (member.selected) {
        return member.cardTypes.every((card) => !card.isChecked);
      } else {
        return true;
      }
    });
  }

  onCardCheckedStatusChange(changeEvent, memberId) {
    const selectedMember = this.memberList.find((member) => member.value === memberId);
    if (selectedMember) {
      const selectedCardType = selectedMember.cardTypes.find((card) => card.groupNumber === changeEvent.source.value);
      if (selectedCardType) {
        selectedCardType.isChecked = changeEvent.checked;
      }
      // uncheck parent if all the card types are unchecked
      const cardsWithCheck = selectedMember.cardTypes.find((card) => card.isChecked === true);
      if (!cardsWithCheck) {
        selectedMember.selected = false;
      }

    }
  }

  onUserCheckedStatusChange(changeEvent) {
    const selectedMember = this.memberList.find((member) => member.value === changeEvent.source.value);
    selectedMember.selected = changeEvent.checked;
    // if (!changeEvent.checked) {
    let isFirstPlanChecked = 0;
    if (selectedMember) {
      selectedMember.cardTypes.map((card, sIndex) => {
        if (card.isEligible !== 'false' && !isFirstPlanChecked) {
          isFirstPlanChecked = sIndex + 1;
        }
        card.isChecked = (changeEvent.checked && isFirstPlanChecked === sIndex + 1) ? changeEvent.checked : !changeEvent.checked;
        return card;
      });
    }
    // }
  }

  getSelectedMembersList() {
    const selectedMemberList = [];
    for (const member of this.memberList) {
      const selectedCards = member.cardTypes.filter((card) => card.isChecked);
      if (member.selected) { // && selectedCards.length > 0
        this.submittedMembersList.push(member);
        selectedMemberList.push({
          groupNumber: member.groupNumber,
          idCardIndicator: 'Y',                        // this.memberList.length === 1 ? 'Y' : 'F',
          subscriberNumber: member.subscriberNumber,
          memberID: member.memberId

          // name: member.name,
          // cards: selectedCards.map((card) => card.type),
          // count: selectedCards.length
        });
      }
    }
    return selectedMemberList;
    // console.log(this.selectedMemberList);
  }
}
