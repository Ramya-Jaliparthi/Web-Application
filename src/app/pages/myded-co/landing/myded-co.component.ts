import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {
  FilterInterface, FilterSelectionInterface,
  FilterToggleInterface, FilterCheckboxChangeInterface,
  FilterRadioChangeInterface,
  FilterSelectionItemInterface
} from '../../../shared/components/filter/filter-model.interface';
import {MyDedCoService} from '../myded-co.service';
import {AuthService} from '../../../shared/services/auth.service';
import {
  GetFamilyDeductiblesResponseInterface
} from '../models/interfaces/getFamilyDeductibles-model.interface';
import {ActivatedRoute} from '@angular/router';
import {FilterOption, FilterItem} from '../../../shared/components/filter/filter.model';
import {MemberType, AccumChartType} from '../models/types/myded-co.types';
import {TitleCasePipe} from '@angular/common';
import {MyDedCoSegragatedMemberListModel, DeductiblesAccums} from '../models/myded-co-info.model';
import {LineChartOptionsInterface} from '../../../shared/components/alegeus-line-chart/line-chart.interface';
import {LineChartOptions} from '../../../shared/components/alegeus-line-chart/line-chart.model';
import {InOrOut} from '../models/types/myded-co.types';
import {
  MyDedCoSegragatedMemberListModelInterface,
  OverallDeductablesInterface,
  OverallBenefitInterface,
  OutofpocketInterface,
  CoinsuranceInterface,
  DeductiblesAccumsInterface
} from '../models/interfaces/myded-co-info-model.interface';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {MyDedCoConstants} from '../myded-co.constants';
import {AlertService, ConstantsService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';
import {FpocontentService} from '../../../shared/services/fpocontent.service';

@Component({
  selector: 'app-myded-co',
  templateUrl: './myded-co.component.html',
  styleUrls: ['./myded-co.component.scss']
})
export class MyDedCoComponent implements OnInit, OnDestroy {
  public deductibleAndCoInsuranceData: GetFamilyDeductiblesResponseInterface;
  public headerToolTipVisible: boolean;
  public linkToolTipVisible: boolean;
  public filterConfig: FilterInterface;
  public ismobile: boolean;
  public hideMainContentOnFilterToggleForMobile: boolean = false;
  public hasALG: boolean = false;
  public hasHEQ: boolean = false;
  public accumItem_memberName = '';
  expandedHeight: string;


  private frozenDeductibleAndCoInsuranceData: GetFamilyDeductiblesResponseInterface;
  private filterConfigCopy: FilterInterface;
  private mobileViewPort = 992;
  private educationCenter = this.constants.educationCenter;
  drupalDedCoTooltipUrl: string;
  drupalDedCoTooltipUrlData: object;
  ssoFinancialLink: string = '';
  showFinancialLink: boolean = false;
  showHEQALGFinancialLink: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }

  constructor(private dedcoService: MyDedCoService,
              private authService: AuthService, private route: ActivatedRoute, private title: TitleCasePipe,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
              private alertService: AlertService,
              private constants: ConstantsService,
              private fpocontentService: FpocontentService
  ) {

    this.expandedHeight = '48px';

  }

  ngOnInit() {
    this.headerToolTipVisible = false;
    this.linkToolTipVisible = false;
    this.handleLinksInSideBar();

    // this.frozenDeductibleAndCoInsuranceData = new MyDedCoInfoModel(this.route.snapshot.data.dedcoList[0]);
    this.frozenDeductibleAndCoInsuranceData = Object.freeze(this.route.snapshot.data.dedcoList[0]);

    // this.maindedcoInfo = JSON.parse(JSON.stringify(this.dedcoInfo));
    this.deductibleAndCoInsuranceData = Object.assign({}, this.frozenDeductibleAndCoInsuranceData);
    // this.deductibleAndCoInsuranceData.accums[0].blueChoiceFlag = 'True';
    // this.deductibleAndCoInsuranceData.members = null;
    if (this.frozenDeductibleAndCoInsuranceData.result < 0) {
      const data = this.frozenDeductibleAndCoInsuranceData;
      this.alertService.setAlert(data.displaymessage, ' ', AlertType.Failure);
    }
    this.filterConfig = {
      hasSearch: false,
      items: [
        (new FilterItem()).setType('radio')
          .setDivider(false)
          .setMulti(false)
          .setHeaderText('')
          .setHideToggle(true)
          .setExpanded(true)
          .setDisabled(false)
          .setDisableRipple(false)
          .setCollapsedHeight(null)
          .setExpandedHeight('44px')
          .setTitlecase(false)
          .setHideHeader(true)
          .setClassName('filter-dedco-single-radio-button')
          .setList([(new FilterOption()).setText('Family')
            .setValue(MemberType.Family)
            .setSelected(this.deductibleAndCoInsuranceData.hasFamily === 'True')
            .setDisabled(this.deductibleAndCoInsuranceData.hasFamily === 'False' ? true : false)
            .setClassName('filter-single-checkbox-without-header')
          ])
      ]
    };

    const segragatedMemberList = this.getSegragatedMemberList();
    const medicalMemberList = segragatedMemberList.medicalMembers;
    if (medicalMemberList && medicalMemberList.length > 0) {
      this.filterConfig.items.push(
        (new FilterItem()).setType('radio')
          .setDivider(false)
          .setMulti(true)
          .setHeaderText(medicalMemberList[0].cobundledPlanFlag === 'True' ? 'Medical with Dental' : 'Medical')
          .setHideToggle(false)
          .setExpanded(false)
          .setDisabled(false)
          .setDisableRipple(false)
          .setCollapsedHeight(null)
          .setExpandedHeight('44px')
          .setTitlecase(true)
          .setList(medicalMemberList)
      );
    }
    const dentalMemberList = segragatedMemberList.dentalMembers;
    if (dentalMemberList && dentalMemberList.length > 0) {
      this.filterConfig.items.push(
        (new FilterItem()).setType('radio')
          .setDivider(false)
          .setMulti(true)
          .setHeaderText('Dental')
          .setHideToggle(false)
          .setExpanded(false)
          .setDisabled(false)
          .setDisableRipple(false)
          .setCollapsedHeight(null)
          .setExpandedHeight('44px')
          .setTitlecase(true)
          .setList(dentalMemberList)
      );
    }

    this.filterConfigCopy = JSON.parse(JSON.stringify(this.filterConfig));
    // this.filterConfigCopy = Object.assign({}, this.filterConfig);

    this.handleLinksInSideBar();
    this.getTooltipData();
  }


  getTooltipData() {
    this.fpocontentService.fetchContent(this.constants.drupalDedCoTooltipUrl).subscribe((response) => {
      this.drupalDedCoTooltipUrlData = response;
    });
  }


  private getSegragatedMemberList(): MyDedCoSegragatedMemberListModelInterface {
    this.headerToolTipVisible = false;
    this.linkToolTipVisible = false;

    const medicalMemberFilterOptions: FilterOption[] = [];
    const dentalMemberFilterOptions: FilterOption[] = [];

    if (this.deductibleAndCoInsuranceData.members && this.deductibleAndCoInsuranceData.members.length > 0) {
      this.deductibleAndCoInsuranceData.members.map(member => {
        if (member.coverageType === 'MEDICAL') {
          medicalMemberFilterOptions.push((new FilterOption())
            .setValue(member.name)
            .setSelected(false)
            .setName(member.name)
            .setText(this.title.transform(member.name))
            .setDisabled(false)
            .setMemSuffix(member.memSuffix)
            .setLoggedinUserSuffix(member.loggedinUserSuffix)
            .setSubscriberNo(member.subscriberNo)
            .setCoverageType(member.coverageType)
            .setCobundledPlanFlag(member.cobundledPlanFlag)
          );
        } else if (member.coverageType === 'DENTAL') {
          dentalMemberFilterOptions.push((new FilterOption())
            .setValue(member.name)
            .setSelected(false)
            .setName(member.name)
            .setText(this.title.transform(member.name))
            .setDisabled(false)
            .setMemSuffix(member.memSuffix)
            .setLoggedinUserSuffix(member.loggedinUserSuffix)
            .setSubscriberNo(member.subscriberNo)
            .setCoverageType(member.coverageType)
          );
        }

        if (this.deductibleAndCoInsuranceData && this.deductibleAndCoInsuranceData.hasFamily === 'False') {
          this.accumItem_memberName = member.name;
          sessionStorage.setItem('ded_name', this.accumItem_memberName);
        }
      });
    }
    return (new MyDedCoSegragatedMemberListModel()).setMedicalMembers(medicalMemberFilterOptions)
      .setDentalMembers(dentalMemberFilterOptions);

  }

  public getLineChartOptions(accumItem: CoinsuranceInterface | OverallDeductablesInterface |
    OutofpocketInterface | OverallBenefitInterface, target: AccumChartType): LineChartOptionsInterface {
    const lineChartOptions: LineChartOptionsInterface = new LineChartOptions();

    const isFamily = this.deductibleAndCoInsuranceData.hasFamily === 'True';

    let refinedAccumItem: CoinsuranceInterface | OverallDeductablesInterface |
      OutofpocketInterface | OverallBenefitInterface = null;

    let headerText: string = '';
    let totalValue: number = 0;
    let chartValue: number = 0;
    let altText: string = '';

    switch (target) {
      case AccumChartType.Coinsurance:
        refinedAccumItem = <CoinsuranceInterface>accumItem;
        headerText = 'Co-Insurance Maximum';
        totalValue = Number(refinedAccumItem.coinsuranceMax);
        chartValue = refinedAccumItem.coinsuranceContributed ? Number(refinedAccumItem.coinsuranceContributed) : 0;
        break;

      case AccumChartType.overallDeductables:
        refinedAccumItem = <OverallDeductablesInterface>accumItem;
        headerText = 'Overall Deductible';
        totalValue = Number(refinedAccumItem.overallDeductible);
        chartValue = refinedAccumItem.deductibleContributed ? Number(refinedAccumItem.deductibleContributed) : 0;
        altText = (isFamily) ?
          // tslint:disable-next-line:max-line-length
          'Deductible Requirement for the Family has been met; therefore, the family does not have to meet any further deductible requirement.' :
          `Deductible Requirement for ${this.accumItem_memberName} has been met; therefore, ${this.accumItem_memberName} does not have to meet any further deductible requirement`;
        break;

      case AccumChartType.overallBenefit:
        refinedAccumItem = <OverallBenefitInterface>accumItem;
        headerText = 'Over-All-Benefit Maximum';
        totalValue = Number(refinedAccumItem.overallBenefitMax);
        chartValue = refinedAccumItem.overallBenefitMaxContributed ? Number(refinedAccumItem.overallBenefitMaxContributed) : 0;
        altText = (isFamily) ?
          // tslint:disable-next-line:max-line-length
          'Deductible Requirement for the Family has been met; therefore, the family does not have to meet any further deductible requirement.' :
          `Deductible Requirement for ${this.accumItem_memberName} has been met; therefore, ${this.accumItem_memberName} does not have to meet any further deductible requirement`;
        break;

      case AccumChartType.outOfPocket:
        refinedAccumItem = <OutofpocketInterface>accumItem;
        headerText = 'Out-Of-Pocket Maximum';
        totalValue = refinedAccumItem.outOfPocketMax;
        chartValue = refinedAccumItem.oopMaxContributed ? Number(refinedAccumItem.oopMaxContributed) : 0;
        altText = (isFamily) ?
          // tslint:disable-next-line:max-line-length
          'Out of Pocket Requirement for the Family has been met; therefore, the family does not have to meet any further out of pocket requirement.' :
          `Out of Pocket Requirement for ${this.accumItem_memberName} has been met; therefore, ${this.accumItem_memberName} does not have to meet any further out of pocket requirement`;
        break;

      default:
        break;

    }

    lineChartOptions.setHeaderText(headerText)
      .setTotalValue(totalValue)
      .setChartValue(chartValue)
      .setChartColor('#3DA148')
      .setChartBackgroundColor('#FFFFFF')
      .setChartOption1Text('Contributed')
      .setChartOption2Text('Remaining to Meet')
      .setAltText(altText);

    return lineChartOptions;
  }

  public toggleFilter(event: FilterToggleInterface) {
    this.hideMainContentOnFilterToggleForMobile = !this.hideMainContentOnFilterToggleForMobile;
  }

  public applyFilter(event: FilterSelectionInterface) {
    this.deductibleAndCoInsuranceData.accums = [];
    this.filterData(event);
    this.hideMainContentOnFilterToggleForMobile = false;
  }

  public clearFilter(event: FilterSelectionInterface) {
    this.filterConfig = JSON.parse(JSON.stringify(this.filterConfigCopy));
    this.filterData(event);
    this.hideMainContentOnFilterToggleForMobile = false;
  }

  private filterData(filter: FilterSelectionInterface) {
    this.getData(filter.selections);
  }

  private getData(selectionList: FilterSelectionItemInterface[]) {


    const list = selectionList.filter(selectedList =>
      !!selectedList.filterItemNumber && selectedList.selectedOption && selectedList.selectedOption.selected === true);
    if (list && list.length) {
      list.forEach((selectedList) => {
        this.accumItem_memberName = selectedList.selectedOption.text;
        this.dedcoService.getIndividualDeductiblesAndCoinsuranceInfo(selectedList).subscribe((getIndividualDeductiblesResponse) => {
          if (getIndividualDeductiblesResponse.result && getIndividualDeductiblesResponse.result < 0) {
            this.bcbsmaErrorHandler.logError(getIndividualDeductiblesResponse.errormessage,
              BcbsmaConstants.modules.myDedCoModule,
              MyDedCoConstants.components.myDedCoComponent,
              MyDedCoConstants.methods.getIndividualDeductiblesAndCoinsuranceInfo);
            this.deductibleAndCoInsuranceData.accums.push(new DeductiblesAccums());
            return null;
          }

          if (Array.isArray(getIndividualDeductiblesResponse.accums)) {
            this.deductibleAndCoInsuranceData.accums.push(...getIndividualDeductiblesResponse.accums);
          } else if (!Array.isArray(getIndividualDeductiblesResponse.accums)) {
            this.deductibleAndCoInsuranceData.accums.push(...[getIndividualDeductiblesResponse.accums]);
          }

        });
      });
    } else {
      if (this.deductibleAndCoInsuranceData && this.deductibleAndCoInsuranceData.hasFamily === 'True') {
        this.accumItem_memberName = 'Family';
      }
      this.deductibleAndCoInsuranceData.accums = this.frozenDeductibleAndCoInsuranceData.accums;
    }
  }

  public showToolTip(type: string) {
    switch (type) {
      case 'header':
        this.headerToolTipVisible = !this.headerToolTipVisible;
        break;
      case 'link':
        this.linkToolTipVisible = !this.linkToolTipVisible;
        break;
    }
  }

  public radioChange(event: FilterRadioChangeInterface): void {
    if (event.filterItemNumber === 0) {
      this.unSelectedAllOptionsInList(1);
      this.unSelectedAllOptionsInList(2);
    }
    if (event.filterItemNumber === 1 || event.filterItemNumber === 2) {
      this.unSelectedAllOptionsInList(0);
    }
  }

  unSelectedAllOptionsInList(filterItemNumber: number) {
    if (this.filterConfig.items && this.filterConfig.items[filterItemNumber]
      && this.filterConfig.items[filterItemNumber].list && filterItemNumber !== 0) {
      this.filterConfig.items[filterItemNumber].list.map(item => {
        item.selected = false;
        return item;
      });
    } else if (this.filterConfig.items && this.filterConfig.items[filterItemNumber]
      && this.filterConfig.items[filterItemNumber].list && filterItemNumber === 0) {
      this.filterConfig.items[filterItemNumber].list.map(item => {
        item.selected = false;
        return item;
      });
    }
  }

  public checkboxChange(event: FilterCheckboxChangeInterface): void {
    const filterConfig = JSON.parse(JSON.stringify(this.filterConfig));
    filterConfig.items.forEach((config) => {
      if (config.type !== 'checkbox') {
        config.list.forEach((sList) => {
          sList.disabled = event.selectedOption.option.selected;
          sList.selected = false;
        });
      }
    });
    this.filterConfig = filterConfig;
  }

  public getInOutNetworkText(accumItem: DeductiblesAccumsInterface, inOutNetworkIndicator: InOrOut): string {

    const blueChoicePOSFlag = (accumItem.blueChoiceFlag === 'True');

    switch (inOutNetworkIndicator) {
      case <InOrOut>'In':
        return (blueChoicePOSFlag) ? 'PCP/Plan Approved' : 'In-Network';
      case <InOrOut>'Out':
        return (blueChoicePOSFlag) ? 'Self -Referred' : 'Out-of-Network';
      case <InOrOut>'In/Out':
        return (blueChoicePOSFlag) ? 'PCP/Plan Approved and Self-Referred Combined' : 'In-Network and Out-of-Network Combined';
      default:
        return '';
    }

  }

  private handleLinksInSideBar() {
    const hasALG = this.authService.authToken ? this.authService.authToken.isALG === 'true' : false;
    const hasHEQ = this.authService.authToken ? this.authService.authToken.isHEQ === 'true' : false;

    this.showHEQALGFinancialLink = false;
    this.showFinancialLink = false;
    if (hasALG) {
      if (hasHEQ) {
        // both are true - show 2 links
        this.showHEQALGFinancialLink = true;
        this.showFinancialLink = false;
      } else {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      }
    } else {
      if (hasHEQ) {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      } else {
        // both are false - show no links
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = false;
      }
    }

    this.ssoFinancialLink = hasHEQ ? '/sso/heathequity' : '/sso/alegeus';
  }

  ngOnDestroy() {
    this.alertService.clearError();
    sessionStorage.removeItem('ded_name');
  }

  openSSO(module?) {
    if (module === 'algOrHeq') {
      window.open(this.ssoFinancialLink, '_blank');
    } else if (module === 'alg') {
      window.open( '/sso/alegeus', '_blank');
    } else if (module === 'heq') {
      window.open( '/sso/heathequity' , '_blank');
    }
  }
}
