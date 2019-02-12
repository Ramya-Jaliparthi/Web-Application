/*
The file contents for the current environment will overwrite these during build.
The build system defaults to the dev environment which uses `environment.ts`, but if you do
`ng build --env=prod` then `environment.prod.ts` will be used instead.
The list of which env maps to which file can be found in `.angular-cli.json`.
*/

export const environment = {
  uitxnid: true,
  production: true,
  dynamicTagLink: '//assets.adobedtm.com/launch-EN0e269b54f5fc4526a20f825a12ecedb7-development.min.js',
  screenNavigationSLA: 3000,
  tokenbaseurl: 'https://mobilememberstage.bluecrossma.com',
  tokensEndPoint: '/memwebapi1_test/mobilekeyservice/v1/gettokens',
  // Mobile app url
  // serviceUrl: 'https://bcbsma-test.apigee.net/member/v1/',
  // tokensEndPoint: '/memapi_test/mobilekeyservice/v1/gettokens',
  serviceUrl: 'https://bcbsma-test.apigee.net/member/web/v1/',
  privacyUrl: 'https://myblueapi.bluecrossma.com/page/',
  drupalTestUrl: 'https://games.bluecrossma.com',
  drupalTestHttpUrl: 'http://myblueapi.test-bluecrossma.acsitefactory.com',
  appversion: '3.1.4.5',
  enableconsolelog: true,
  drupalHomeUrl: 'https://myblue.bluecrossma.com/',
  contactus: 'https://myblue.bluecrossma.com/contact-us',
  educationCenter: 'https://myblue.bluecrossma.com/health-plan/plan-education-center',
  drupalsecureinquiry: 'http://20181010myblue.bluecrossma.acsitefactory.com/inquiry',
  leafLetUrl : 'https://api.mapbox.com/',
};
