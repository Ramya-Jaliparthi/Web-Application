export const FINDADOCTORMENUITEM_TEXT = 'Find a Doctor & Estimate Costs';

export const RIGHTTOPMENU: Object[] = [
  { name: 'Home', url: '/home', img: 'fas fa-home', sso: false },
  {
    name: FINDADOCTORMENUITEM_TEXT, url: '/fad',
    img: 'fas fa-stethoscope', sso: true
  },
  {
    name: 'My Inbox', url: '/message-center', img: 'fas fa-envelope override-fa-icon',
    sso: false
  },
  { name: 'My Account', url: '/myaccount', img: 'fas fa-user-shield', sso: false },
  { name: 'My Cards', url: '/mycards', img: 'fas fa-id-card', sso: false },
  { name: 'My Plans & Benefits', url: '/myplans', img: 'fa fa-shield-alt', sso: false },
  { name: 'My Claims', url: '/myclaims', img: 'fas fa-file-alt', sso: false },
  { name: 'My Deductible & Co-Insurance', url: '/mydedco', img: 'fas fa-clipboard-check', sso: false },
  { name: 'My Doctors', url: '/mydoctors', img: 'fas fa-user-md', sso: false },
  { name: 'My Medications', url: '/mymedications', img: 'fas fa-capsules', sso: false },
  { name: 'Request Written Estimate', url: '/request-estimate', img: 'fas fa-receipt', sso: false },
  { name: 'My Financials', url: '/myfinancials', img: 'fas fa-chart-line', sso: false },
  // { name: 'Notifications', url: '/notification-preferences', img: 'fal fa-cog' }
];

export const RIGHTTOPMENU_INACTIVE: Object[] = [
  { name: 'Home', url: '/home', img: 'fas fa-home', sso: false },
  {
    name: FINDADOCTORMENUITEM_TEXT, url: '/fad',
    img: 'fas fa-stethoscope', sso: true
  },
  {
    name: 'My Inbox', url: '/message-center', img: 'fas fa-envelope override-fa-icon',
    sso: false
  },
  { name: 'My Account', url: '/myaccount', img: 'fas fa-user-shield', sso: false },
  // { name: 'My Plans & Benefits', url: '/myplans', img: 'fa fa-shield-alt', sso: false },
  { name: 'My Claims', url: '/myclaims', img: 'fas fa-file-alt', sso: false },
  // { name: 'My Deductible & Co-Insurance', url: '/mydedco', img: 'fas fa-clipboard-check', sso: false },
  { name: 'My Doctors', url: '/mydoctors', img: 'fas fa-user-md', sso: false },
  { name: 'My Medications', url: '/mymedications', img: 'fas fa-capsules', sso: false },
  // { name: 'Request Written Estimate', url: '/request-estimate', img: 'fas fa-receipt', sso: false },
  // { name: 'My Financials', url: '/pages/maintenance', img: 'fas fa-chart-line' , sso: false },
  // { name: 'Notifications', url: '/notification-preferences', img: 'fal fa-cog' }
];

export const LEFTTOPMENU: Object[] = [
  { name: 'Home', url: 'http://bcbsma.info/member' },
  { name: 'About Us', url: 'https://aboutus.bluecrossma.com/' },
  // { name: 'Need a Plan?', url: 'http://20180329home.bluecrossma.acsitefactory.com/landing' },
];

export const LEFTSECONDMENU: Object[] = [
  { name: 'Looking for a Plan?', url: 'https://myplans.bluecrossma.com/' },
  { name: 'Member', url: 'http://bcbsma.info/member' },
  { name: 'Information about Medicare', url: 'https://medicare.bluecrossma.com/' },
  { name: 'Provider', url: 'https://provider.bluecrossma.com/' },
  { name: 'Broker', url: 'https://broker.bluecrossma.com/' },
  { name: 'Employer', url: 'https://employer.bluecrossma.com/' },
  { name: 'Job Seeker', url: 'https://careers.bluecrossma.com/' }
];
