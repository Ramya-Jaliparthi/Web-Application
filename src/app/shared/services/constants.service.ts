import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Alert} from '../alerts/alert.model';
import {AlertType} from '../alerts/alertType.model';
import {DropDownValue} from '../models/dropDownValue.model';
import {AuthService} from './auth.service';

@Injectable()
export class ConstantsService {
  displayMessage: object;
  tokenbaseurl: string;
  logoutUrl: string;
  memAuthUrl: string;
  verifyAccessCodeUrl: string;
  authWithSsnUrl: string;
  updateMemAuthInfoUrl: string;
  getDemoGraphicInfo: string;
  getmemprofile: string;
  // getMyProfile: string;
  getmempreference: string;
  getBenefitsTextUrl: string;
  getmemberinfo: string;
  sendaccesscodeUrl: string;
  sendfunaccesscodeUrl: string;
  updatememprofile: string;
  updatemempreference: string;
  loginUserUrl: string;
  registerUserUrl: string;
  refreshtokenurl: string;
  verifyUserUrl: string;
  verifyUserAuthUrl: string;
  verifyRestAccessCodeUrl: string;
  verifyResetUrl: string;
  userNameVerify: string;
  identityVerify: string;
  resetPwd: string;
  privacyUrl: string;
  termsAndConditions: string;
  confidentiality: string;
  authStudentIDUrl: string;
  tokensEndPoint: string;
  changepassword: string;
  authLnUrl: string;
  validateLnAnsUrl: string;
  postdesinfoUrl: string;
  sendCommChlAccesscode: string;
  verfiyCommChlAccesscode: string;
  sendUpdateNotification: string;
  memlookupUrl: string;
  memacctmergeUrl: string;
  drupalTestUrl: string;
  drupalMedicationsUrl: string;
  drupalDoctorsUrl: string;
  drupalClaimsUrl: string;
  drupalSliderUrl: string;
  updateDemographicInfoUrl: string;
  drupalClaimsrUrl: string;
  drupalMyPlansListingUrl: string;
  drupalMyPlansInformationUrl: string;
  drupalMyPlansFPOUrl: string;
  drupalMyPlansDetails: string;
  drupalMyPlansDetailsTooltipUrl: string;
  drupalMyBenefitsUrl: string;
  drupalMyBenefitsDetailsUrl: string;
  drupalNoClaimsrUrl: string;
  drupalContentInactiveWithFinancialsUrl: string;
  drupalContentInactiveNoFinancialsUrl: string;
  drupalsecureinquiry: string;

  states: Array<DropDownValue>;
  languages: Array<DropDownValue>;
  ethnicities: Array<DropDownValue>;
  races: Array<DropDownValue>;
  // profileUrl: string;
  serviceUrl: string;
  financeUrl: string;
  cardfrontUrl: string;
  cardbackUrl: string;
  dependentsUrl: string;
  getCardPageurl: string;
  orderIdcardurl: string;
  dependentlistRestrictedUrl: string;
  getPlansBenefitsListUrl: string;
  getPlanBenefitServicesUrl: string;
  getBenefitsCoverageUrl: string;
  getPlanBenefitDetailsUrl: string;
  getLimitationTextUrl: string;
  getFillingTextUrl: string;
  getAuthReferralUrl: string;
  getCOBTextUrl: string;
  getEligibilityTextUrl: string;
  getWordSearchUrl: string;
  getBenefitCoverageUrl: string;
  claimsforproviderUrl: string;
  claimsUrl: string;
  depClaimsUrl: string;
  claimdetailsUrl: string;
  claimProcessingStatusUrl: string;
  benefitsLinkUrl: string;
  claimsdepdetailsUrl: string;
  medicationsUrl: string;
  getMemBasicInfoUrl: string;
  getRequestEstimateUrl: string;
  submitrequestestimatedetailsUrl: string;
  depMedicationsUrl: string;
  claimsdaterangeUrl: string;
  medicationsDetailsUrl: string;
  depMedicationsDetailsUrl: string;
  depedentFrontUrl: string;
  depedentBackUrl: string;
  cardFrontFamily: string;

  homepageUrl: string;
  getCommPreferenceUrl: string;
  updateCommPreferenceUrl: string;
  dedcoUrl: string;
  myDoctorListUrl: string;
  myDoctorDetailsUrl: string;
  myDepDoctorListUrl: string;
  myDepDoctorDetailsUrl: string;
  myDoctorInvalidPCPId: string;
  drupalDedCoDiagnosisCodeUrl: string;
  drupalDedCofaclityNPIUrl: string;
  drupalDedCoserviceProviderNPItUrl: string;
  drupalDedCoTooltipUrl: string;
  drupalContentCampaignUrl1: string;
  drupalContentCampaignUrl2: string;
  drupalContentCampaignUrl3: string;
  drupalContentCampaignUrl4: string;
  drupalContentCampaignUrl5: string;
  drupalContentCampaignUrl6: string;
  

  // add/change pcp
  getMemPlanInfo: string;
  getMemPlanDependents: string;
  getCodes: string;
  getPCPInfo: string;
  changePCP: string;
  drupalHomeUrl: string;
  contactus: string;
  educationCenter: string;
  drupalPCPUrl: string;
  pcpTierInfoUrl: string;
  drupalRELUrl: string;

  // Message Center (Inbox)
  msgListingUrl: string;
  msgDetailUrl: string;
  updateMsgListingAndMemAlertsUrl: string;
  getInboxUnreadMsgCountUrl: string;

  // Deductibels
  getfamilydeductiblesUrl: string;
  getindividualdeductiblesUrl: string;

  // Documents
  getDocumentsRiderInfo: string;
  getDocumentsPlanInfo: string;

  // myaccount
  myaccountUrl: string;
  blueGreenUrl: string = 'https://www.fidelity.com/fidelityhsa';
  nurseLineUrl: string = 'https://myblue.bluecrossma.com/tools-resources/find-care/nurse-phone-line';
  cernerEEUrl: string = 'https://healthyblue2.bluecrossma.com/dt/v2/bcbsmaeeindex.asp';
  CernerMedicareUrl: string = 'https://www.ahealthyme-medicare.com/dt/v2/bcbsmamoindex.asp';
  esiUrl: string = 'https://www.express-scripts.com';


  // 3.1 Url's //
  leafLetUrl: string;
  leafLetGecodingVersionUrl: string;
  vitalsApiUrl: string;
  zipCodeSearchUrl: string;
  autoCompleteSearchUrl: string;
  getDoctorProfileUrl: string;
  getFacilityProfileUrl: string;
  getPlanDetailsUrl: string;

  alegeusAccountsSummaryUrl: string;

  constructor() {
    this.tokenbaseurl = environment.tokenbaseurl;
    this.serviceUrl = environment.serviceUrl;
    this.drupalHomeUrl = environment.drupalHomeUrl;
    this.privacyUrl = environment.privacyUrl;
    this.tokensEndPoint = environment.tokensEndPoint;
    this.drupalTestUrl = environment.drupalTestUrl;
    this.contactus = `${environment.contactus}?scopename=`;
    this.educationCenter = environment.educationCenter;
    this.drupalsecureinquiry = environment.drupalsecureinquiry;

    this.getBenefitsTextUrl = `${this.serviceUrl}plans/getbenefittext`;

    this.getfamilydeductiblesUrl = `${this.serviceUrl}coinsurancedeductibles/getfamilydeductibles`;
    this.getindividualdeductiblesUrl = `${this.serviceUrl}coinsurancedeductibles/getindividualdeductibles`;

    this.medicationsUrl = `${this.serviceUrl}medication/getrecentrx`;
    this.depMedicationsUrl = `${this.serviceUrl}medication/getdependentrecentrx`;
    this.medicationsDetailsUrl = `${this.serviceUrl}medication/getrxdetails`;
    this.depMedicationsDetailsUrl = `${this.serviceUrl}medication/getdependentrxdetails`;

    this.drupalDoctorsUrl = `${this.drupalTestUrl}/page/home-mydoctors`;
    this.drupalMedicationsUrl = `${this.drupalTestUrl}/page/home-mymedication`;
    this.drupalClaimsUrl = `${this.drupalTestUrl}/page/home-myclaims`;
    this.drupalSliderUrl = `${this.drupalTestUrl}/page/home-leaderboard-slider`;
    this.drupalClaimsrUrl = `${this.drupalTestUrl}/page/myclaims-listingpage`;
    this.drupalNoClaimsrUrl = `${this.drupalTestUrl}/page/myclaims-noclaimsresult`;
    this.drupalMyPlansListingUrl = `${this.drupalTestUrl}/page/planlistingspage`;
    this.drupalMyPlansInformationUrl = `${this.drupalTestUrl}/page/myplans-information`;
    this.drupalMyPlansFPOUrl = `${this.drupalTestUrl}/page/myplans-FPO-placeholder`;
    this.drupalMyPlansDetails = `${this.drupalTestUrl}/page/plan-details-page`;
    this.drupalMyPlansDetailsTooltipUrl = `${this.drupalTestUrl}/page/plandetails-hovertooltipcontent`;
    this.drupalMyBenefitsUrl = `${this.drupalTestUrl}/page/plan-benefits-page`;
    this.drupalMyBenefitsDetailsUrl = `${this.drupalTestUrl}/page/benefits-details-page`;
    this.drupalPCPUrl = `${this.drupalTestUrl}/page/mydoctors-change-add-pcp-screens`;
    this.drupalRELUrl = `${this.drupalTestUrl}/page/Information-hyperlink`;
    this.drupalDedCoDiagnosisCodeUrl = `${this.drupalTestUrl}/page/request-estimate-screen-diagnosis-code-1-tooltip`;
    this.drupalDedCofaclityNPIUrl = `${this.drupalTestUrl}/page/request-estimate-screen-facility-npi-tooltip`;
    this.drupalDedCoserviceProviderNPItUrl = `${this.drupalTestUrl}/page/request-estimate-screen-provider-npi-tooltip`;
    this.drupalDedCoTooltipUrl = `${this.drupalTestUrl}/page/mydeductible-and-co-insurance-screen`;
    this.drupalContentInactiveWithFinancialsUrl = `${this.drupalTestUrl}/page/homepage-inactive-with-myfinancials`;
    this.drupalContentInactiveNoFinancialsUrl = `${this.drupalTestUrl}/page/homepage-inactive`;
    this.drupalContentCampaignUrl1 = `${this.drupalTestUrl}/page/campaign1`;
    this.drupalContentCampaignUrl2 = `${this.drupalTestUrl}/page/campaign2`;
    this.drupalContentCampaignUrl3 = `${this.drupalTestUrl}/page/campaign3`;
    this.drupalContentCampaignUrl4 = `${this.drupalTestUrl}/page/campaign4`;
    this.drupalContentCampaignUrl5 = `${this.drupalTestUrl}/page/campaign5`;
    this.drupalContentCampaignUrl6 = `${this.drupalTestUrl}/page/campaign6`;

    this.registerUserUrl = `${this.serviceUrl}access/registermem`;
    this.loginUserUrl = `${this.serviceUrl}access/memberlogin`;
    this.logoutUrl = `${this.serviceUrl}access/logout`;
    this.memAuthUrl = `${this.serviceUrl}authentication/getmemauthinfo`;
    this.updateMemAuthInfoUrl = `${this.serviceUrl}authentication/updatememauthinfo`;
    this.authWithSsnUrl = `${this.serviceUrl}authentication/authwithssn`;
    this.authStudentIDUrl = `${this.serviceUrl}authentication/authwithstudentid`;
    this.authLnUrl = `${this.serviceUrl}authentication/authwithln`;
    this.validateLnAnsUrl = `${this.serviceUrl}authentication/validatelnanswers`;
    this.postdesinfoUrl = `${this.serviceUrl}authentication/postdestinationinfo`;
    this.sendaccesscodeUrl = `${this.serviceUrl}common/sendaccesscode`;
    this.verifyAccessCodeUrl = `${this.serviceUrl}common/verifyaccesscode`;
    this.sendCommChlAccesscode = `${this.serviceUrl}common/sendcommchlacccode`;
    this.verfiyCommChlAccesscode = `${this.serviceUrl}common/verifycommchlacccode`;
    this.sendUpdateNotification = `${this.serviceUrl}common/sendupdatenotification`;
    this.memlookupUrl = `${this.serviceUrl}usermigration/memlookup`;
    this.memacctmergeUrl = `${this.serviceUrl}usermigration/memacctmerge`;

    this.getDemoGraphicInfo = `${this.serviceUrl}profile/getdemographicinfo`;
    this.getmemprofile = `${this.serviceUrl}profile/getmemprofile`;
    this.getmempreference = `${this.serviceUrl}info/getmempreference`;
    this.getmemberinfo = `${this.serviceUrl}info/getmemberinfo`;

    this.updatememprofile = `${this.serviceUrl}profile/updatememprofile`;
    this.updatemempreference = `${this.serviceUrl}info/updatemempreference`;
    this.refreshtokenurl = `${this.serviceUrl}access/refreshtoken`;
    this.verifyUserUrl = `${this.serviceUrl}access/verifyfpuser`;
    this.verifyUserAuthUrl = `${this.serviceUrl}access/verifyfphintanswer`;
    this.verifyRestAccessCodeUrl = `${this.serviceUrl}access/verifyfunaccesscode`;
    this.verifyResetUrl = `${this.serviceUrl}access/verifyresetac`;
    this.userNameVerify = `${this.serviceUrl}access/verifyfunuser`;
    this.identityVerify = `${this.serviceUrl}access/verifyfunauthuser`;
    this.sendfunaccesscodeUrl = `${this.serviceUrl}access/resendaccesscode`;
    this.resetPwd = `${this.serviceUrl}access/resetpassword`;
    this.termsAndConditions = `${this.privacyUrl}termsandconditions`;
    this.confidentiality = `${this.privacyUrl}privacypolicy`;
    this.updateDemographicInfoUrl = `${this.serviceUrl}profile/updatedemographicinfo`;

    // memchangePassword and changepassword were tried. Both are giving errors
    // this.changepassword = `${this.serviceUrl}profile/memChangePassword';
    this.changepassword = `${this.serviceUrl}profile/changepassword`; // 'info/changepassword';
    this.financeUrl = `${this.serviceUrl}homepage/getfinancebalance`;
    this.cardfrontUrl = `${this.serviceUrl}cards/getcardfront`;
    this.cardbackUrl = `${this.serviceUrl}cards/getcardback`;
    this.dependentsUrl = `${this.serviceUrl}meminfo/getdependents`;
    this.depedentFrontUrl = `${this.serviceUrl}cards/getdepcardfront`;
    this.depedentBackUrl = `${this.serviceUrl}cards/getdepcardback`;
    this.cardFrontFamily = `${this.serviceUrl}cards/getcardfrontfamily`;
    this.getCardPageurl = `${this.serviceUrl}cards/getcardpage`;
    this.orderIdcardurl = `${this.serviceUrl}cards/orderidcard`;
    this.dependentlistRestrictedUrl = `${this.serviceUrl}meminfo/getdependentsrestricted`;

    // this.getPlansBenefitsListUrl = `${this.serviceUrl}plansandbenefits/getplansbenefitslistservice/getplansbenefitslist';
    // this.getPlanBenefitServicesUrl =
    // 'https://virtserver.swaggerhub.com/web_API_team/plansAndBenefits-getPlansandBenefitServices/1.0.0/getplanbenefitservices';

    this.getPlansBenefitsListUrl = `${this.serviceUrl}plans/getplansbenefitslist`;
    this.getPlanBenefitServicesUrl = `${this.serviceUrl}plans/getplansbenefitsservices`;
    this.getBenefitsCoverageUrl = `${this.serviceUrl}plans/getsubscribercert`;
    this.getPlanBenefitDetailsUrl = `${this.serviceUrl}plans/getplanbenefitdetails`;
    this.getLimitationTextUrl = `${this.serviceUrl}plans/getlimitationtext`;
    this.getFillingTextUrl = `${this.serviceUrl}plans/getfillingtext`;
    this.getAuthReferralUrl = `${this.serviceUrl}plans/getauthreferral`;
    this.getCOBTextUrl = `${this.serviceUrl}plans/getcobtext`;
    this.getEligibilityTextUrl = `${this.serviceUrl}plans/geteligibilitytext`;
    this.getWordSearchUrl = `${this.serviceUrl}plans/getwordsearch`;
    this.getBenefitCoverageUrl = `${this.serviceUrl}plans/getbenefitcoverage`;


    this.claimsforproviderUrl = `${this.serviceUrl}claimsinfo/getclaimsforprovider`;

    // start : temporary code change kalagi01
    this.claimsUrl = `${this.serviceUrl}claims/getclaimssummary`;
    // this.claimsUrl = 'https://virtserver.swaggerhub.com/BCBSMA96/MyblueClaimsAPI/1.0.0/getclaimssummaryservice/v1/getclaimssummary';
    // 'https://virtserver.swaggerhub.com/BCBSMA96/MyblueClaimsAPI/1.0.0/getclaimdetailsservice/v1/getclaimdetails';
    // end: temporary code change

    this.depClaimsUrl = `${this.serviceUrl}depclaimsinfo/getdepclaims`;
    this.claimdetailsUrl = `${this.serviceUrl}claims/getclaimdetails`;
    this.claimProcessingStatusUrl = `${this.serviceUrl}claims/getclaimprocessingstatus`;
    this.benefitsLinkUrl = `${this.serviceUrl}claims/getclaimbenefitslink`;
    this.claimsdepdetailsUrl = `${this.serviceUrl}depclaimsinfo/getdepclaimsforICN`;
    this.getMemBasicInfoUrl = `${this.serviceUrl}meminfo/getmembasicinfo`;


    this.getRequestEstimateUrl = `${this.serviceUrl}costestimate/getrequestestimatedetails`;
    this.submitrequestestimatedetailsUrl = `${this.serviceUrl}costestimate/submitrequestestimatedetails`;

    this.claimsdaterangeUrl = `${this.serviceUrl}claimsinfo/getclaimsfordaterange`;
    this.homepageUrl = `${this.serviceUrl}homepage/gethomepageinfo`;


    this.getCommPreferenceUrl = `${this.serviceUrl}preference/getcommstatus`;
    this.updateCommPreferenceUrl = `${this.serviceUrl}preference/updatecommstatus`;

    this.dedcoUrl = `${this.serviceUrl}homepage/getdeductiblesandcoins`;
    this.myDoctorListUrl = `${this.serviceUrl}doctors/getrecentvisits`;
    this.myDoctorDetailsUrl = `${this.serviceUrl}doctors/getvisitdetails`;
    this.myDepDoctorListUrl = `${this.serviceUrl}doctors/getdependentrecentvisits`;
    this.myDepDoctorDetailsUrl = `${this.serviceUrl}doctors/getdependentvisitdetails`;
    this.myDoctorInvalidPCPId = '70010000ZP0745';
    this.pcpTierInfoUrl = 'http://www.bluecrossma.com/memberportal/disclaimer/ingenix/learn-more-about-provider-tiers3T.html';
    // add/change pcp
    this.getMemPlanInfo = `${this.serviceUrl}pcp/getmemplaninfo`;
    // 'https://virtserver.swaggerhub.com/vijayin26/pcp-service/1.0.0/getmemplaninfoservice/v1/getmemplaninfo';
    // tslint:disable-next-line:max-line-length
    this.getMemPlanDependents = `${this.serviceUrl}pcp/getmemplandependents`;
    this.getCodes = `${this.serviceUrl}pcp/getcodes`;
    this.getPCPInfo = `${this.serviceUrl}pcp/getpcpinfo`;
    this.changePCP = `${this.serviceUrl}pcp/changepcp`;

    // Message Center (Inbox)
    this.msgListingUrl = `${this.serviceUrl}memnotifications/getinboxmessages`;
    this.msgDetailUrl = `${this.serviceUrl}memnotifications/getmessagedetail`;
    this.updateMsgListingAndMemAlertsUrl = `${this.serviceUrl}memnotifications/updatememalerts`;
    // this.getInboxUnreadMsgCountUrl = 'https://virtserver.swaggerhub.com/tamilnathan/Inbox_Unread/1.0.0/getinboxunreaddatainfo';

    // Documents
    this.getDocumentsRiderInfo = this.serviceUrl + +'plans/getsubscribercert';
    this.getDocumentsPlanInfo = this.serviceUrl + 'plans/getbenefittext';

    // my account
    this.myaccountUrl = `${this.serviceUrl}/homepage/myaccountinfo`;

    this.states = [
      new DropDownValue('KS', 'Kansas'),
      new DropDownValue('CA', 'California')
    ];
    this.languages = [
      new DropDownValue('EN', 'English'),
      new DropDownValue('ES', 'Espanol')
    ];
    this.races = [
      new DropDownValue('AMERICAN', 'American'),
      new DropDownValue('ASIAN', 'ASIAN')
    ];
    this.ethnicities = [
      new DropDownValue('AMERICAN', 'American'),
      new DropDownValue('ASIAN', 'ASIAN')
    ];

    this.displayMessage = {
      'Sorry, the access code you entered does not match our records, please try again.':
        new Alert('That code doesn\'t match. Please check it, and try again.', '', AlertType.Failure),
      'User Found is undefined': new Alert('Username or password is incorrect.', '', AlertType.Failure),
      'ERROR DURING LOGIN OPERATION': new Alert('Username or password is incorrect.', '', AlertType.Failure),
      '[LDAP: error code 49 - Invalid Credentials]': new Alert('Username or password is incorrect.', '', AlertType.Failure),
      '[LDAP: error code 53 - Error, Account is locked]':
        new Alert('Please call Member Service at , <a href="javascript:void(0)" '
          + 'class="black-text underline">866-822-0570</a> 8:00 AM - 9:00 PM ET, Monday - Friday.', 'Your account is locked'
          , AlertType.Failure),
      'User already exist': new Alert('An account already exists with this email. Please check your entries or sign in.',
        '', AlertType.Failure),
      'ERROR DURING ADD USER OPERATION': new Alert('An account already exists with this email. Please check your entries or sign in.',
        '', AlertType.Failure),
      'Sorry, based on the information you have provided, we could not find your member record':
        new Alert('Sorry, based on the information you have provided, we could not find your member record', '', AlertType.Failure),
      'Sorry, the maximum authentication attempts limit has been reached.':
        new Alert('Please call Member Service at , <a href="javascript:void(0)" '
          + 'class="black-text underline">866-822-0570</a> 8:00 AM - 9:00 PM ET, Monday - Friday.', 'We cannot give you access at this time'
          , AlertType.Failure),
      'Fault: ErrorResponseCode': new Alert('Internal Server Error', '', AlertType.Failure),
      'Sorry we can\'t find user with that ID.Please try with correct user id.':
        new Alert('Sorry, we can\'t find an account with that username. Please try again.', '', AlertType.Failure),
      // tslint:disable-next-line:max-line-length
      'Sorry password is invalid.Password must have 8-16 character and have atleast 1 upper case,atleast 1 lower case,atleast 1 special char,atleast 1 number and no space.':
        new Alert('Incorrect Username or Password. Please try again.', '', AlertType.Failure),
      'Sorry User id already used.Please try other user id.':
        new Alert('An account already exists with this email address.<a href="/login" '
          + 'class="link-error">Log in</a>  or try again with a new email.', '', AlertType.Failure),
      'Sorry,System Error. Please try again later.':
        new Alert('An account already exists with this mobile number.<a href="/login" '
          + 'class="link-error">Log in</a>  or try again a new mobile number.',
          'Error', AlertType.Failure),
      'Invalid User Name or Date of Birth.  Please try again.':
        new Alert('We couldn\'t find your information in our records. Please try again.',
          'Error', AlertType.Failure),
      'No user found with that email address or mobile phone number.  Please try again.':
        new Alert('The information you entered does not match our records. Please try again.'
          + 'If you do not have a username <a href="/register" href="javascript:void(0)" class="link-error">Register Now</a>',
          'Error', AlertType.Failure),
      // tslint:disable-next-line:max-line-length
      'We were unable to identify your account with the information provided. Please try again, or call Member Service at 1-888-772-1722, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.':
        new Alert('We were unable to identify your account with the information provided. Please try again, or call Member Service at <a href="javascript:void(0)" '
          + 'class="black-text underline">1-888-772-1722</a> , Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.', ''
          , AlertType.Failure),
      'We couldn\'t find your information. Please try again. If you don\'t have an account, Register Now.':
        new Alert('We couldn\'t find your information. Please try again. If you don\'t have an account, ' +
          '<a href="/register" href="javascript:void(0)" class="link-error">Register Now.</a>', '', AlertType.Failure),
    };

    this.leafLetUrl = environment.leafLetUrl;
    this.leafLetGecodingVersionUrl = this.leafLetUrl + 'geocoding/v5/mapbox.places';
    this.vitalsApiUrl = 'http://biibd01vr.bcbsma.com:8085/';
    this.zipCodeSearchUrl = this.vitalsApiUrl + 'web/vitalscities/v1/postSearchByCities';
    this.autoCompleteSearchUrl = this.vitalsApiUrl + 'web/vitalsprovidersearch/v1/postProviderSearch';
    this.getDoctorProfileUrl = this.vitalsApiUrl + 'web/vitalsprovidersearch/v1/postProviderSearch';
    this.getFacilityProfileUrl = this.vitalsApiUrl + 'web/vitalsprovidersearch/v1/postProviderSearch';
    this.getPlanDetailsUrl = this.vitalsApiUrl + 'web/vitals/v1/plans/getplans';

    this.alegeusAccountsSummaryUrl = `${this.serviceUrl}alegeus/alegeusaccountssummary`;
  }


}
