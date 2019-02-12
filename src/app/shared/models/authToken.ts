export class AuthToken {
  access_token: string;
  access_token_expires: string;
  scopename: string;
  refresh_token: string;
  issued: string;
  refresh_token_expires: string;
  refresh_count: number;
  HasActivePlan: string;
  migrationtype: string;
  userType: string;
  destinationURL: string;
  isALG: string;
  isHEQ: string;
  planTypes: any;
  unreadMsgCount: string;
  hasDependents: string;
  firstName: string;
  syntheticID: string;

  constructor(authToken: any) {
    this.access_token = authToken.access_token;
    this.access_token_expires = authToken.access_token_expires;
    this.scopename = authToken.scopename;
    this.refresh_token = authToken.refresh_token;
    this.HasActivePlan = authToken.HasActivePlan;
    this.migrationtype = authToken.migrationtype;
    this.userType = authToken.userType;
    this.destinationURL = authToken.destinationURL;
    this.issued = authToken.issued;
    this.isALG = authToken.isALG;
    this.isHEQ = authToken.isHEQ;
    this.planTypes = authToken.planTypes;
    this.hasDependents = authToken.hasDependents;
    this.unreadMsgCount = authToken.unreadMsgCount;
    this.refresh_token_expires = authToken.refresh_token_expires;
    this.refresh_count = parseInt(authToken.refresh_count, 10);
    this.firstName = authToken.firstName;
    this.syntheticID = authToken.syntheticID;
  }
}
