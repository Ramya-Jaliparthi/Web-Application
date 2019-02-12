export class RegisterConstants {

  public static userMismatchMsg = `An account already exists with this userid.
  <a href="/login" class="link-error">Log in</a> or try again with a new userid.`;

  public static infoMismatchMsg = `The information you entered doesn't match our records.
   Please try again, or call Member Service at
    <a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.`;

  public static memIdMsg = 'An account already exists for this member ID number. Please <a href="/login" '
    + 'class="link-error">sign in</a> or try again with a new number.';

  public static lockOutMsg = 'You\'ve exceeded the maximum number of attempts to verify your account. ' +
    'Try again in 24 hours, or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' +
    'Monday through Friday, 8:00 a.m. to 6:00 p.m.';

  public static lnLockOutMsg = 'You\'ve exceeded the maximum number of attempts to verify your account. ' +
    'Try again in 24 hours, or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' +
    'Monday through Friday, 8:00 a.m. to 6:00 p.m. ET and mention "Authentication Lock".';

  public static sidLockOutMsg = 'You\'ve exceeded the maximum number of attempts to verify your account. ' +
    'Try again in 24 hours, or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' +
    'Monday through Friday, 8:00 a.m. to 6:00 p.m. ET and mention "Student Authentication Lock".';

  public static valueMismatchMsg = 'The number you entered does not match our records. Please try again, ' +
    'or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' +
    ', Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.';

  public static ssnLockOutMsg = 'You\'ve exceeded the maximum number of attempts to verify your account. ' +
    'Try again in 24 hours, or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' +
    'Monday through Friday, 8:00 a.m. to 6:00 p.m. ET and mention "Authentication Lock".';

  public static lnInfoMismatchMsg = 'The information you entered doesn\'t match our records. Please try again, or call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.';

  public static memRecordMsg = 'We couldn\'t find your member record based on the information provided. Please call Member Service at ' +
    '<a href="tel:8887721722">1&#8209;888&#8209;772&#8209;1722</a> ' + 'Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.';

  private static messages = {
    registerDetail : {
      '-20980': 'You entered invalid information'
    },
    studentId : {
      '-90632': RegisterConstants.valueMismatchMsg,
      '-90624': RegisterConstants.sidLockOutMsg
    },
    lnMessages: {
      '-90651' : RegisterConstants.lnInfoMismatchMsg,
      '-90652' : RegisterConstants.memRecordMsg,
      '-90649' : RegisterConstants.lnInfoMismatchMsg,
      '-90650':  RegisterConstants.lnLockOutMsg
    },
    ssnMessages: {
      '-90610': RegisterConstants.valueMismatchMsg,
      '-90605': RegisterConstants.ssnLockOutMsg
    }
  };

  public static errorMessage(val, component, response?) {
    let message = '';
    const componentMessages = this.messages[component];
    if (componentMessages && componentMessages[val]) {
      message = componentMessages[val];
    }
    if (message === '') {
      message = response['displaymessage'];
    }
    return message;
  }
}
