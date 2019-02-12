import { Injectable } from '@angular/core';
import { AuthHttp } from '../../services/authHttp.service';
import { AuthService } from '../../shared.module';
import { ConstantsService } from '../constants.service';

@Injectable()
export class OrderreplacementService {

  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService) { }

    getCardPage() {
      const request = {
        useridin: this.authService.useridin
      };
      return this.http.encryptPost(this.constants.getCardPageurl, request).map(response => {
        console.log('Get Card Page', response);
        if (response.type !== 'error') {
          if (response['fault'] && response['fault'].faultstring) {
            return;
          } else {
            return response;
          }
        }
       });
    }
  submitCard(data) {
    const request = {
      useridin: this.authService.useridin,
      idCardList: data
    };
    return this.http.encryptPost(this.constants.orderIdcardurl, request).map(response => {
      console.log('Order Card', response);
      if (response.type !== 'error') {
        if (response['fault'] && response['fault'].faultstring) {
          return;
        } else {
          return response['resultSet'] && response['resultSet'].length && response['resultSet'];
        }
      }
     });

  }


}
