import { Injectable } from '@angular/core';
import { AuthHttp } from '../../services/authHttp.service';
import { AuthService } from '../../shared.module';
import { ConstantsService } from '../constants.service';
import { Observable } from 'rxjs/Observable';
import {
  GetMemBasicInfoRequestModelInterface,
  GetMemBasicInfoResponseModelInterface
} from '../../../pages/medications/models/interfaces/get-member-basic-info-model.interface';
import {
  GetMemBasicInfoRequestModel,
  GetMemBasicInfoResponseModel
} from '../../../pages/medications/models/get-member-basic-info.model';

@Injectable()
export class MyCardsService {
  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService
  ) {
  }

  getMemberFrontData$() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.cardFrontFamily, request).map(response => {
      if (response.result < 0) {
        return response;
      } else {
        if (response && response.error !== true) {
          if (response['fault'] && response['fault'].faultstring) {
            return;
          } else if (response && response['ROWSET'] && response['ROWSET'].totRows <= 1) {
            return [response['ROWSET'].ROWS];
          } else if (response && response['ROWSET']) {
            return response['ROWSET'].ROWS;
          }
        }
      }

    });
  }

  getMemBasicInfo(): Observable<GetMemBasicInfoResponseModelInterface> {
    if (this.authService.basicMemInfo) {
      return Observable.of(this.authService.basicMemInfo);
    }
    const request: GetMemBasicInfoRequestModelInterface = new GetMemBasicInfoRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.encryptPost(this.constants.getMemBasicInfoUrl, request).map(response => {
      if (response.result < 0) {
        return new GetMemBasicInfoResponseModel();
      } else {
        const basicInfo = new GetMemBasicInfoResponseModel();
        basicInfo.rxSummary = response.getMemBasicInfoResponse;
        this.authService.basicMemInfo = basicInfo;
        return <GetMemBasicInfoResponseModel>basicInfo;
      }
    });
  }


  getDependents$() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.dependentsUrl, request).map(response => { console.log('@@', response); return response; });
  }
  getDependentFrontData$(sDepID) {
    const request = {
      useridin: this.authService.useridin,
      depid: sDepID
    };
    return this.http.encryptPost(this.constants.depedentFrontUrl, request)
      .map(response => {
        if (response.type !== 'error') {
          if (response['fault'] && response['fault'].faultstring) {
            return;
          } else if (response && response['ROWSET'].totRows <= 1) {
            return [response['ROWSET'].ROWS];
          } else if (response && response['ROWSET']) {
            return response['ROWSET'].ROWS;
          }
        }
      });
  }
  getDependentBackData$(sDepId) {
    const request = {
      useridin: this.authService.useridin,
      depid: sDepId
    };
    return this.http.encryptPost(this.constants.depedentBackUrl, request)
      .map(response => {
        if (response.type !== 'error') {
          if (response['fault'] && response['fault'].faultstring) {
            return;
          } else if (response && response['ROWSET'].totRows <= 1) {
            return [response['ROWSET'].ROWS];
          } else if (response && response['ROWSET']) {
            return response['ROWSET'].ROWS;
          }
        }
      });
  }

  getMemberBackData$() {
    const request = {
      useridin: this.authService.useridin,
    };
    return this.http.encryptPost(this.constants.cardbackUrl, request).map(response => {
      if (response.result < 0) {
        return response;
      } else {
        if (response && response.error !== true) {
          if (response['fault'] && response['fault'].faultstring) {
            return;
          } else if (response && response['ROWSET'] && response['ROWSET'].totRows <= 1) {
            return [response['ROWSET'].ROWS];
          } else if (response && response['ROWSET']) {
            return response['ROWSET'].ROWS;
          }
        }
      }
    });
  }

  drawCard(canvasFront, canvasBack, memberCardFrontData, memberCardBackData) {
    const index = 0;
    let context: any;
    let backCardContext: any;


    const me = this;
    const entries = memberCardBackData;
    // if (memberCardBackData && memberCardBackData.ROWSET)
    //   entries = memberCardBackData.ROWSET['ROWS']
    // let para1 =''; //No value
    // let para2 = '';
    // let para3 = '';
    let para4 = '';
    // let para5 = '';
    // let topUrl = '';

    // let memberServiceNumber = "";
    // let providerServiceNumber = "";
    // let preAuthServiceNumber = "";
    // let bhServiceNumber = "";
    // let locateServiceNumber = "";
    // let blueCareServiceNumber = "";

    if (entries && entries.length > 0) {
      for (let k = 0; k < entries.length; k++) {
        const entry = entries[k];
        if (entry['CopyLoc'] === 'Top') {
          // topUrl = entry['Copy'];
        } else if (entry['CopyLoc'] === 'Para4') {
          para4 = entry['Copy'];
        }
        // else if(entry['CopyLoc'] == 'Para2')
        // para2 = entry['Copy'];

        // else if(entry['CopyLoc'] == 'Para3')
        // para3 = entry['Copy'];
        // else if(entry['CopyLoc'] == 'Para5')
        // para5 = entry['Copy'];
      }


    }


    if (canvasFront.getContext && canvasBack.getContext) {

      // if(index == 0){
      //   this.subscriberName = 'subname';//this.authService.getMemberName();
      //   this.memberType = 'type';//this.authService.getMemberRelation();
      // }
      context = canvasFront.getContext('2d');
      backCardContext = canvasBack.getContext('2d');

      const dpr = window.devicePixelRatio || 1;
      const frontbsr = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
      const backbsr = backCardContext.webkitBackingStorePixelRatio ||
        backCardContext.mozBackingStorePixelRatio ||
        backCardContext.msBackingStorePixelRatio ||
        backCardContext.oBackingStorePixelRatio ||
        backCardContext.backingStorePixelRatio || 1;

      const frontratio = dpr / frontbsr;
      const backratio = dpr / backbsr;


      canvasFront.width = 310 * frontratio;
      canvasFront.height = 210 * frontratio;
      canvasBack.width = 310 * backratio;
      canvasBack.height = 210 * backratio;
      canvasBack.style.width = canvasFront.style.width = 310 + 'px';
      canvasBack.style.height = canvasFront.style.height = 210 + 'px';
      canvasFront.getContext('2d').setTransform(frontratio, 0, 0, frontratio, 0, 0);
      canvasBack.getContext('2d').setTransform(backratio, 0, 0, backratio, 0, 0);
      context = canvasFront.getContext('2d');
      backCardContext = canvasBack.getContext('2d');
      const imageFrontObj = new Image();
      const imageBackObj = new Image();
      imageFrontObj.onload = function () {

        context.drawImage(imageFrontObj, 0, 0, 310, 210);
        context.font = '9px Roboto';
        context.fillStyle = '#000';

        me.wrapText(context, memberCardFrontData.ProdDesc, 150, 40, 150, 10);

        context.font = 'bold 11px Roboto';
        context.fillStyle = '#FFF';

        context.fillText(memberCardFrontData.MemName, 15, 75);
        context.fillText(memberCardFrontData.cardMemID, 15, 90);
        context.fillText(me.removeLeadingJunkChar(memberCardFrontData.MemSuff), 110, 109.5);

        context.font = '11px Roboto';
        // context.fillText('Member Service', 245, 87);
        context.fillText(memberCardFrontData.MemServPh, 210, 85);
        context.font = '9px Roboto';

        // RxBin: 003858 PCN: A4
        // RxGRP: MASA
        let rxBin = memberCardFrontData.rxBin;
        if (rxBin != null && rxBin !== '') {
          rxBin = rxBin.substring(rxBin.indexOf('RxBin:') + 7, rxBin.indexOf('PCN:'));
        } else {
          rxBin = '';
        }
        let pcn = memberCardFrontData.rxBin;
        if (pcn != null && pcn !== '') {
          pcn = pcn.substring(pcn.indexOf('PCN:') + 5, pcn.length);
        } else {
          pcn = '';
        }
        let rxGRP = memberCardFrontData.rxGRP;
        if (rxGRP != null && rxGRP !== '') {
          rxGRP = rxGRP.substring(rxGRP.indexOf('RxGRP:') + 7, rxGRP.length);
        } else {
          rxGRP = '';
        }
        context.fillText(rxBin, 233, 98);
        context.fillText(pcn, 285, 98);

        context.fillText(rxGRP, 245, 108);

        context.font = '11px Roboto';

        // context.fillText('Copays', 70, 140);

        if (memberCardFrontData.OvCopay) {
          // context.fillText('OV', 50, 146);
          context.fillText(memberCardFrontData.OvCopay, 40, 140);
        }

        context.fillText(memberCardFrontData.BHCopay, 40, 150);
        context.fillText(memberCardFrontData.ERCopay, 40, 160);
        context.fillText(memberCardFrontData.PrevCopay, 40, 172);

        context.fillText('CHOICE plan', 210, 130);

        // context.font = 'bold 11px arial';
        // context.fillStyle = '#000';
        // const contacts = para4.split('|');
        //
        //
        // for (let n = 0; n < contacts.length; n++) {
        //   const line = contacts[n];
        //   const contactNumber = line.substring(line.indexOf(':') + 1, line.length);
        //   if (line.indexOf('Member Service') !== -1) {
        //     // memberServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 298);
        //   } else if (line.indexOf('Provider Service') !== -1) {
        //     // providerServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 310);
        //   } else if (line.indexOf('Pre-Authorization') !== -1) {
        //
        //     // preAuthServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 320);
        //   } else if (line.indexOf('Behavioral Health') !== -1) {
        //     // bhServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 340);
        //   } else if (line.indexOf('Locate Provider') !== -1) {
        //
        //     // locateServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 352);
        //   } else if (line.indexOf('Blue Care Line') !== -1) {
        //     // blueCareServiceNumber = contactNumber;
        //     context.fillText(contactNumber, 275, 363);
        //   }
        //
        //
        // }
      };
      imageBackObj.onload = function () {
        backCardContext.drawImage(imageBackObj, 0, 0, 310, 210);
        backCardContext.font = 'bold 11px Roboto';
        backCardContext.fillStyle = '#000';
        const contacts = para4.split('|');


        for (let n = 0; n < contacts.length; n++) {
          const line = contacts[n];
          const contactNumber = line.substring(line.indexOf(':') + 1, line.length);
          if (line.indexOf('Member Service') !== -1) {
            // memberServiceNumber = contactNumber;
            backCardContext.fillText(contactNumber, 220, 75);
          } else if (line.indexOf('Provider Service') !== -1) {
            // providerServiceNumber = contactNumber;
            backCardContext.fillText(contactNumber, 220, 88);
          } else if (line.indexOf('Pre-Authorization') !== -1) {

            // preAuthServiceNumber = contactNumber;
            context.fillText(contactNumber, 220, 100);
          } else if (line.indexOf('Behavioral Health') !== -1) {
            // bhServiceNumber = contactNumber;
            backCardContext.fillText(contactNumber, 220, 119);
          } else if (line.indexOf('Locate Provider') !== -1) {

            // locateServiceNumber = contactNumber;
            backCardContext.fillText(contactNumber, 220, 125);
          } else if (line.indexOf('Blue Care Line') !== -1) {
            // blueCareServiceNumber = contactNumber;
            backCardContext.fillText(contactNumber, 220, 130);
          }


        }
        backCardContext.fillStyle = '#1065A5';
        backCardContext.fillText('Contact Us', 153, 58);
        const linkWidth = backCardContext.measureText('Contact Us').width;
        backCardContext.strokeStyle = '#1065A5';
        backCardContext.beginPath();
        backCardContext.moveTo(153, 60);
        backCardContext.lineTo(155 + linkWidth, 60);
        backCardContext.stroke();
        canvasBack.addEventListener('mousemove', (event) => {
          me.onContactMouseHover(event, canvasBack, linkWidth);
        });
        canvasBack.addEventListener('click', (event) => {
          me.onContactClick();
        });
      };

      if (memberCardFrontData.dispSuitcase && memberCardFrontData.rxSpecified) {
        imageFrontObj.src = '/assets/images/frontcardpporx.svg';
      } else if (memberCardFrontData.dispSuitcase && !memberCardFrontData.rxSpecified) {
        imageFrontObj.src = '/assets/images/frontcardppo.svg';
      } else if (!memberCardFrontData.dispSuitcase && memberCardFrontData.rxSpecified) {
        imageFrontObj.src = '/assets/images/frontcardrx.svg';
      } else {
        imageFrontObj.src = '/assets/images/frontcard.svg';
      }
      imageBackObj.src = '/assets/images/backcard.svg';
    }
  }

  onContactMouseHover(oEvent, canvasBack, linkWidth) {

    let x, y;

    // Get the mouse position relative to the canvas element.
    if (oEvent.layerX || oEvent.layerX === 0) { // for firefox
      x = oEvent.offsetX || oEvent.layerX;
      y = oEvent.offsetY || oEvent.layerY;
    }
    // x -= canvasBack.offsetLeft;
    // y -= canvasBack.offsetTop;

    // is the mouse over the link?
    if (x >= 40 && x <= (40 + linkWidth) && y <= 190 && y >= (190 - 10)) {
      document.body.style.cursor = 'pointer';
      // inLink=true;
    } else {
      document.body.style.cursor = '';
      // inLink=false;
    }
  }

  onContactClick() {

  }

  // download(img) {
  //
  //   const canvasDownload = document.createElement('canvas');
  //   canvasDownload.width = img.width;
  //   canvasDownload.height = img.height;
  //   const ctx = canvasDownload.getContext('2d');
  //   ctx.drawImage(img, 0, 0);
  //   this.dataURL = canvasDownload.toDataURL('image/png');
  //   console.log(this.dataURL);
  //
  //   const doc = new jsPDF();
  //   const imageData = this.dataURL;
  //   console.log(imageData);
  //   doc.addImage(imageData, 'JPG', 10, 10, 180, 150);
  //   doc.save('Test.pdf');
  // }

  wrapText(context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  removeLeadingJunkChar(val) {
    if (val && val.length > 0 && val.charCodeAt(0) === 127) {
      val = val.substring(1, val.length);
    }
    return val;
  }
}
