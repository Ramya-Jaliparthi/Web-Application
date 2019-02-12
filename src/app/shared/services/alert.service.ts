import { Alert } from '../alerts/alert.model';
import { AlertType } from '../alerts/alertType.model';

export class AlertService {
  errors: object;

  constructor() {
    this.errors = {};
  }

  clearError(scope = 'component') {
    this.errors[scope] = '';
  }

  getAlert(scope = 'component') {
    return this.errors[scope];
  }

  setAlert(message, title = 'Error', type = AlertType.Success, scope = 'component') {
    if (message && message.includes('1-888-772-1722') && typeof message === 'string') {
      message = message.replace(/1-888-772-1722/g, '<a href=\'tel:8887721722\'>1-888-772-1722</a>');
    }
    this.errors[scope] = new Alert(message, title, type);
  }

  setAlertObj(alertObj: Alert, scope = 'component') {
    this.errors[scope] = alertObj;
  }

  setError(message) {
    this.setAlert(message, '', AlertType.Failure);
  }
}
