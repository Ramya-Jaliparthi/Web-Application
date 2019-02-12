import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BcbsmaerrorHandlerService implements ErrorHandler {

  private prodMode: boolean = false;

  constructor() { }

  /**
   *
   * @param prodMode
   */
  public setProdMode(prodMode: boolean) {
    this.prodMode = prodMode;
  }

  /**
   *
   * @param exception  - the exception or error that needs to be handled
   * @param moduleName - module in which the error occured
   * @param componentName - component in which the error occured
   * @param methodName - method in which the error occured
   */
  public logError(exception, moduleName: string, componentName: string, methodName: string): void {
    let detailedAppError: string = '';

    detailedAppError = `Error :: "${exception.message}" has occured in module >> "${moduleName}"
      - component >> "${componentName}" - method >> "${methodName}"`;

    if (this.prodMode) {
      // code implementation to log or mail errors in production should go here
    }

    if (console && console.error) {
      console.error(detailedAppError);
    }

    this.handleError(exception);
  }

  /**
   *
   * @param exception  - the exception or error that needs to be handled
   * @param moduleName - module in which the error occured
   * @param componentName - component in which the error occured
   * @param methodName - method in which the error occured
   */
  public warn(message: string, moduleName: string, componentName: string, methodName: string): void {
    let detailedAppError: string = '';

    detailedAppError = `Warn :: "${message}" has occured in module >> "${moduleName}"
      - component >> "${componentName}" - method >> "${methodName}"`;

    if (this.prodMode) {
      // code implementation to log or mail errors in production should go here
    }

    if (console && console.warn) {
      console.warn(detailedAppError);
    }
  }

  /**
   *
   * @param error  - the exception or error that needs to be handled
   * @param moduleName - module in which the error occured
   * @param serviceName - service in which the error occured
   * @param methodName  - method in which the error occured
   */
  public handleHttpError(error: HttpErrorResponse, moduleName: string, serviceName: string, methodName: string) {

    let detailedHttpError: string = '';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      detailedHttpError = `Backend Error :: "${error.error.message}" has occured in module >> "${moduleName}"
        - Service >> "${serviceName}" - method >> "${methodName}"`;
      console.error('A backend error occurred: ', detailedHttpError);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      detailedHttpError = `Backend Error ::  returned code ${error.status}, ` +
        `body was: ${error.error} has occured in module >> "${moduleName}" - Service >> "${serviceName}" - method >> "${methodName}"`;
      console.error('A backend error occurred: ', detailedHttpError);
    }

    this.handleError(error);
  }

  /**
   * @description: DO NOT CALL THIS METHOD DIRECTLY. Helps log error messages
   * @param exception - the exception or error that needs to be handled
   */
  handleError(exception: any): any {

    throw new Error(exception);

  }

  devLog(text: string): void {
    if (this.prodMode) {
      return;
    }
    console.log('development logs>>>>' + text);
  }

}
