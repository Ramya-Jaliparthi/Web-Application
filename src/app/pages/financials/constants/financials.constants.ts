export const FinancialsConstants = Object.freeze({
  buttons: {
    search: 'Search'
  },

  text: {
    landingPageTitle: 'My Financials',
    landingPageTransactionTitle: 'All Transactions',
    collectionHeaderTitle: 'Account(s)',
    collectionlinkTitle: 'Quick Links',
    accountDetailTitle: 'About Accounts',
    acountDetailsDateTitle: 'Effective Date',
    chart1: 'Chart1',
    chart2: 'Chart2',
    chartHeader1: 'Available Balance',
    chart1Param1Text: 'Available',
    chart1Param2Text: 'Spent',
    chart1Param3Text: 'Available RollOver',
    chartHeader2: 'Annual Election',
    chart2Param1Text: 'Payroll Deposits YTD',
    chart2Param2Text: 'Remaining Payroll Deposits',
    chart2BarColor: '#8FBE48',
    remainingValueColor: '#BADEBE',
    accountDetailRightTopAccordionHeader: 'Family Details',
    accountDetailRightTopAccordionContent: 'The following family members are linked to this account.',
    accountDetailRightDeductibleAccordionHeader: 'Deductible Status',
    accountDetailRightDeductibleAccordionContent1: 'Deductible',
    accountDetailRightDeductibleAccordionContent2: 'Deductible Applied',
    accountDetailRightDeductibleAccordionContent3: 'Deductible Remaining',
    accountDetailRightBottomAccordionHeader: 'Deadlines',
    accountDetailRightBottomAccordionContent1: 'Plan Start Date',
    accountDetailRightBottomAccordionContent2: 'Last Day for Spending',
    accountDetailRightBottomAccordionContent3: 'Last Day to Submit Claims',
    allTransactionsTitle: 'All Transactions',
    allTransactionActionitems: 'Action Item(s)',
    allTransactionPending: 'Pending',
    allTransactionCompleted: 'Completed',
    allTransactionOthers: 'Others',
    paymentsAmountPaid: 'Amount PAID',
    whatYouOwe: 'What You Owe',
    dateOfTransaction: 'Date of Transaction:',
    claimNo: 'ClaimNo.',
    transactionDetailTitle: 'Transaction Details',
    makePayment: 'Make Payment',
    actionDescTransactDetails: 'This is a description that supports the status of a claim. Typically it is associated with a denied claim.',
    dateOfService: 'Date of Service:',
    totalBillingBreakdown: 'Total Billing Breakdown',
    amountChargedByHealthcareProvider: 'Amount charged by health care provider',
    amountAllowed: 'Amount allowed',
    amountCovered: 'Amount covered',
    yourTotalResponsibility: 'Your total responsibility',
    amountYouPaidoutOfPocket: 'Amount you paid Out-of-Pocket',
    amountYourBenefitAccountPaid: 'Amount your benefit account paid',
    billingBreakdownByService: 'Billing Breakdown By Service',
    serviceType: 'Service Type',
    pleaseConfirmountofPocketPaidAmount: 'Please confirm your Out-of-Pocket Paid Amount',
    PaymentDetailsAdjudication: 'Payment Details (Adjudication)',
    paymentDetails: 'Payment Details',
    payment: 'Payment:',
    account: 'Account',
    provider: 'Provider',
    serviceDateMoreThanDay: 'Service date covers more than 1 day',
    previouslyPaid: 'Previously Paid',
    paidTo: 'Paid To',
    paymentDate: 'Payment Date',
    paymentMethod: 'Payment Method',
    checkTrace: 'Check/Trace #',
    adjudicationDetails: 'Adjudication Details',
    totalCharges: 'Total Charges',
    pended: 'Pended',
    denied: 'Denied',
    excluded: 'Excluded',
    eligible: 'Eligible',
    appiledtoUpFrontDeductible: 'Appiled to Up Front Deductible',
    offset: 'Offset',
    employeePaid: 'Employee Paid',
    onHold: 'On Hold',
    approved: 'Approved',
    viewClaims: 'View in My Claims',
    partiallyPaid: 'This claim is partially paid',
    reimbursementDate: 'Reimbursement Date',
    reimbursementMethod: 'Payment Method',
    hsaType: 'HSA Type',
    hsaPositingDate: 'HSA Posting Date',
    schedulePaymentTitle: 'Schedule Payment',
    makePaymentTitle: 'Make Payment',
    whatDoYouWantToPay: 'Who do you want to pay?*',
    whenDoYouWantToSubmit: 'When do you want to submit it?*',
    now: 'Now',
    later: 'Later',
    payMe: 'Myself',
    payAProvider: 'Provider',
    cantFindProvider: 'Can’t find your provider?',
    addProvider: 'Add a Provider',
    accountNumberWithProvider: 'Account Number with Provider',
    reimbursementMthd: 'Reimbursement Method',
    paymentAmount: 'Payment Amount *',
    member: 'Member *',
    nameSample: 'John Sample',
    makePaymentServiceType: 'Service Type *',
    serviceStartDate: 'Service Start Date *',
    serviceEndDate: 'Service End Date *',
    serviceDate: 'Service Date *',
    dateFormat: 'mm/dd/yyyy',
    paymentComments: 'Comments',
    note: 'Note',
    addReciept: 'Add Receipt',
    takeOrUploadPhoto: 'Take or upload a photo',
    paymentDisclaimerText: 'By clicking “Submit”, I agree and certify that these expenses have been incurred by me, my spouse or my eligible dependent and I agree to the ',
    termsAndConditionsLink: 'Terms & Conditions of Alegeus.',
    requiredFields: '* indicates a required field',
    preferDirectDeposit: 'Prefer Direct Deposit?',
    addBankAccount: 'Add Bank Account',

    reimbursementAmount: 'Reimbursement Amount *',
    billedAmount: 'Billed Amount *',
    amountAllowedByInsurance : 'Amount Allowed by Insurance *',
    insurancePaidAmount : 'Insurance Paid Amount *',
    paidNonRimbursable : 'Paid Non-Reimbursable *',
    myResponsibility: 'My Responsibility',
    reimbursedFromMyAccounts : 'Reimbursed From My Accounts',

    thankYouTitle: 'Thank You!',
    reimbursementTitle: 'Reimbursement Confirmed',
    concernsText: 'Should you have any questions or concerns please feel free to contact our Member Service Department at 855-279-4176.',
    transactionDetails: 'Transaction Details',
    paymentTypeLabel: 'Type:',
    paymentType: 'Check',
    claimLabel: 'Claim No.:  ',
    memberName: 'Member Name',
    providerFacility: 'Provider/Facility',
    providerOrFacility: 'Provider or Facility',
    confirmPaymentComment: 'Comment:',
    reimbursmentTitle: ''

  },

  quickLinks: [
    {
      'text': 'Make Payment',
      'url': '/myfinancials/paymentoptions'
    },
    {
      'text': 'Manage Bank Accounts',
      'url': ''
    },
    {
      'text': 'Manage Debit Cards',
      'url': '/myfinancials/cards'
    },
  ],

  statesList : [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'District of Columbia', value: 'DC' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' }
  ],

  components: {
    financialComponent: 'FinancialsComponent',
    financialAccountDetailComponent: 'FinancialAccountDetailComponent',
    allTransactionsComponent: 'AllTransactionsComponent',
    filterSearchAllTransactionComponent: 'FilterSearchAllTransactionsComponent',
    documentsComponent: 'NoTransactionFound',
    transactionsDetailComponent: 'TransactionDetailsComponent',
  },


  labels: {},

  messages: {},

  flags: {
    transactionMode: 'transaction',
    noSearchResultsMode: 'noSearchResultsMode',
    All: 'ALL'
  },

  methods: {
    onSearch: 'onSearch',
    constructor: 'constructor',
    clearCache: 'clearCache',
    ngOnInit: 'ngOnInit',
    ngOnChanges: 'ngOnChanges',
    getAccountSummary: 'getAccountSummary',
    navigateToAllTransaction: 'navigateToAllTransactionnavigateToAllTransaction',
    accountDetail: 'accountDetail',
    getAccountDetail: 'getAccountDetail',
    getAllTransactionsSummary: 'getAllTransactionsSummary',
    convertAccountDetailIntoLineChartOptions: 'convertAccountDetailIntoLineChartOptions',
    createSearchCriteria: 'createSearchCriteria',
    showTransactionDetails: 'showTransactionDetails',
    navigateToTransactionDetail: 'navigateToTransactionDetail',
    getTransactionDetail: 'getTransactionDetail',
    financialSummaryInfo: 'financialSummaryInfo'
  },

  errorMessages: {
    invalidParamInFunctionCall: 'Function call uses invalid parameter',
    possibleInvalidParamInFunctionCall: 'Possible invalid parameters in function call',
    invalidFolderLocation: 'Invalid Folder Location',
    invalidMethodCall_invalidObj: 'Invalid method call - object is invalid',
    invalidMethodCall_invalidObjOrInstance: 'Invalid method call - object or instance param is invalid',
    invalidServiceResponseData: 'Invalid Service Response Data',
    noDocsFound_InvalidComponentModeError:
      'Invalid component mode in NoDocumentsFoundComponent. Should be one of uploads/documents/messages',
    noTransactionFound: 'No Transactions Found'
  },

  services: {
    financialsLandingPageService: 'FinancialsLandingPageService',
    financialAccountDetailService: 'FinancialAccountDetailService',
    alltransactionsService: 'AlltransactionsService',
    transactionDetailsService: 'TransactionDetailsService',
    financialResolverService: 'FinancialResolverService',
  },

  filters: {
    sortByFilters: {
      mostRecent: 'Most Recent',
      oldestFirst: 'Oldest First',
      unreadFirst: 'Unread First'
    },
    dateFilters: {
      last30Days: 'Last 30 Days',
      last60Days: 'Last 60 Days',
      last90Days: 'Last 90 Days',
      yearToDate: 'Year-to-date',
      allDates: 'All dates',
      customDateRange: 'Custom Date Range'
    }
  },

  urls: {
    accountDetailsUrl: '/participant/accounts/details',
    accountSummaryUrl: '/participant/accounts/summary',
    getAllTransactionsUrl: '/participant/transactions/recent?participantId=050754447&flexaccountkey=3820',
    getTransactionDetailsUrl: '/participant/transactions/getAlegeusTransactionsSummary',
  },

  jsonurls: {
    accountDetailsUrl: '/assets/data/financials/getAccountDetails.json',
    accountSummaryUrl: '/assets/data/financials/financialSummarySwagger.json',
    getAllTransactionsUrl: '/assets/data/financials/getAlegeusTransactionsSummary_22Aug.json',
    getTransactionDetailsUrl: '/assets/data/financials/getAlegeusTransactionsDetailTransaction.json',
    makePaymentDetailsUrl: '/assets/data/alegeus/makeapayment.json',
    schedulePaymentDetailsUrl: '/assets/data/alegeus/makeapayment.json',
  },


  api: {
    switchToApiUrlFromJsonFile: false,
    Url: 'https://myblueapi.us-east-1.elasticbeanstalk.com',
  },


});
