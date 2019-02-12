import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { LineChartOptions } from '../../../shared/components/alegeus-line-chart/line-chart.model';
import { switchMap } from 'rxjs/operator/switchMap';
import { Filter, FilterToggle, FilterSelection } from '../../../shared/components/filter/filter.model';
import { FilterComponentConstants } from '../../../shared/components/filter/filter.constants';
import { FadCostBreakdownService } from '../fad-cost-breakdown/fad-cost-breakdown.service';
import { LineChartOptionsInterface } from '../../../shared/components/alegeus-line-chart/line-chart.interface';
import { FilterInterface } from '../../../shared/components/filter/filter-model.interface';

@Component({
  selector: 'app-fad-cost-breakdown',
  templateUrl: './fad-cost-breakdown.component.html',
  styleUrls: ['./fad-cost-breakdown.component.scss']
})
export class FadCostBreakdownComponent implements OnInit {

  public fadConstants = FadConstants;
  public hideMainContentOnFilterToggleForMobile: boolean = false;
  public filterConfig: FilterInterface;
  public totalCostbreakDownData: any;
  public costBreakdownData: any;

  constructor(private router: Router, private route: ActivatedRoute,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private fadCostBreakdownService: FadCostBreakdownService) {
    this.getCostBreakDownData();
  }

  ngOnInit() {

    // this.filterConfig = {
    //   items: [
    //     {
    //       list: [
    //         {
    //           text: 'John Sample',
    //           value: 'John Sample',
    //           selected: false,
    //           disabled: false,
    //           cobundledPlanFlag: 'yes'
    //         },
    //         {
    //           text: 'Jane Sample',
    //           value: 'Jane Sample',
    //           selected: false,
    //           disabled: false,
    //           cobundledPlanFlag: 'yes'
    //         },
    //         {
    //           text: 'George Sample',
    //           value: 'George Sample',
    //           selected: false,
    //           disabled: false,
    //           cobundledPlanFlag: 'yes'
    //         },
    //         {
    //           text: 'Family',
    //           value: 'Family',
    //           selected: false,
    //           disabled: false,
    //           cobundledPlanFlag: 'yes'
    //         }
    //       ],
    //       type: 'radio',
    //       divider: false,
    //       multi: false,
    //       headerText: 'Member',
    //       hideToggle: false,
    //       expanded: false,
    //       disabled: false,
    //       disableRipple: false,
    //       collapsedHeight: null,
    //       expandedHeight: '44px',
    //       titlecase: false,
    //     }
    //   ],
    //   hasSearch: false,
    // };

  }

  public getCostBreakDownData() {
    // this.selectedProfessionID = this.fadSearchListService.getSelectedId();
    this.fadCostBreakdownService.getCostBreakDown()
      .subscribe((data) => {
        if (data && Object.keys(data).length > 0) {
          this.totalCostbreakDownData = data;
          this.costBreakdownData = this.totalCostbreakDownData.professionals[0].costBreakdown;
        }
      }, error => {
        this.bcbsmaErrorHandler.handleHttpError(error, BcbsmaConstants.modules.fadModule,
          this.fadConstants.services.fadCostBreakDownService,
          this.fadConstants.methods.getCostBreakDownData);
      }
      );
  }

  public costBreakdownAsLineChartOptions(chartNumber = FadConstants.text.chart1) {

    const linechartOption: LineChartOptionsInterface = new LineChartOptions();
    try {
      switch (chartNumber) {
        case FadConstants.text.chart1:
          linechartOption.headerText = FadConstants.text.chart1HeaderText;
          linechartOption.chartOption1Text = FadConstants.text.chart1Param1Text;
          linechartOption.chartOption2Text = FadConstants.text.chart1Param2Text;
          linechartOption.chartOption3Text = FadConstants.text.chart1Param3Text;
          linechartOption.totalValue = this.costBreakdownData.overall_deductible;
          linechartOption.chartValue = this.costBreakdownData.overall_spend;
          linechartOption.chartOption3Value = this.costBreakdownData.overall_this_procedure;
          linechartOption.showOption3 = true;
          linechartOption.chartOption3BackgroundColor = FadConstants.text.chart2BarColorRemaining;
          break;
        case FadConstants.text.chart2:
          linechartOption.headerText = FadConstants.text.chart2HeaderText;
          linechartOption.chartOption1Text = FadConstants.text.chart2Param1Text;
          linechartOption.chartOption2Text = FadConstants.text.chart2Param2Text;
          linechartOption.chartColor = FadConstants.text.chart2BarColor;
          linechartOption.totalValue = this.costBreakdownData.out_pocket_max_usage;
          linechartOption.chartValue = this.costBreakdownData.out_spend;
          break;
        default:
          break;
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadCostBreakdownComponent,
        FadConstants.methods.costBreakdownAsLineChartOptions);
    }

    return linechartOption;
  }

  // Methods to convert Transaction amount into decimal values
  public convertAmountToBaseValue(value) {
    return Math.trunc(value);
  }

  public convertAmountToDecimalValue(value) {
    const int_part = Math.trunc(value);
    const float_part = Number((value - int_part).toFixed(2));
    const decimal: string[] = float_part.toString().split('.');
    if (!decimal[1]) {
      const zero = '00';
      return zero;
    }
    return decimal[1];
  }

  toggleFilter(event: FilterToggle) {
    this.hideMainContentOnFilterToggleForMobile = !this.hideMainContentOnFilterToggleForMobile;
  }

  applyFilter(event: FilterSelection) {
    const newLocal = this.hideMainContentOnFilterToggleForMobile = false;
  }

  clearFilter(event: FilterSelection) {
    this.hideMainContentOnFilterToggleForMobile = false;
  }

}
