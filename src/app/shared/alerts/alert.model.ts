import {AlertType} from './alertType.model';

export class Alert {
  title: string;
  type: AlertType;
  message: string;

  constructor(message, title = 'Alert', type = AlertType.Success) {
    this.title = title;
    this.type = type;
    this.message = message;
  }

  get cssClass() {
    switch (this.type) {
      case AlertType.Failure: return 'alert-failure';
      case AlertType.Success: return 'alert-success';
      case AlertType.Warning: return 'alert-warning';
      case AlertType.Notification: return 'alert-notification';
    }
  }

  get cssIcon() {
    switch (this.type) {
      case AlertType.Failure: return 'sentiment_dissatisfied';
      case AlertType.Success: return 'sentiment_satisfied';
      case AlertType.Warning: return 'sentiment_neutral';
      case AlertType.Notification: return 'sentiment_notification';
    }
  }
}
