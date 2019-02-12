import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { DependantsService } from '../../../shared/services/dependant.service';
import { GlobalService } from '../../../shared/services/global.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../../../shared/services/auth.service';
import { MyCardsService } from '../../../shared/services/mycards/mycards.service';

declare let $: any;
declare let canvg: any;
declare global {
  interface Document {
    documentMode?: any;
  }
}
declare global {
  interface Window {
    webkitURL?: any;
  }
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements AfterViewInit, OnInit, OnChanges {

  // @ViewChild('cardfrontCanvas') canvasFrontRef: ElementRef;
  // @ViewChild('cardbackCanvas') canvasBackRef: ElementRef;
  // @ViewChild('cardContainter') cardContainer: ElementRef;
  @Input('cardData') cardData: any;
  @Input('hasDependents') hasDependents: boolean;
  @Input('ismobile') ismobile: boolean;
  @ViewChild('planname') planName: ElementRef;
  dependentList = [];
  memberServiceNumber: string = '';
  providerServiceNumber: string = '';
  blueCareNumber: string = '';
  res = [];
  cardType: string;
  isFrontView: boolean;
  currentView: string;
  memberName: string;
  zoomOut: boolean;
  isExplorer = /*@cc_on!@*/false || !!document.documentMode;

  constructor(public dependantsService: DependantsService,
    private cardService: MyCardsService,
    private authService: AuthService,
    public globalService: GlobalService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // this.dependantsService.loadDependants();
    this.isFrontView = true;
    this.currentView = 'View Back';
    this.memberName = '';
    this.zoomOut = true;
  }

  ngOnInit() {
    $('.materialboxed').materialbox();
  }

  toggleCssClass() {
    // this.zoomOut = !this.zoomOut;
  }


  getCanvasElement() {
    // return this.cardContainer.nativeElement.children[0];
  }

  ngAfterViewInit() {
    // this.dependantsService.dependants$.subscribe(res => console.log('dependants', res));
  }

  setPreviousSiblingY(currentElement, yPos) {
    const prevElement = currentElement.previousSibling;
    if (prevElement && prevElement.nodeName === 'tspan') {
      const calculatedYpos = yPos - 10;
      prevElement.setAttribute('y', calculatedYpos);
      this.setPreviousSiblingY(prevElement, calculatedYpos);
    }
  }
  wordWrap(node, width) {
    node.innerHTML = '';
    const word = this.cardData.memberCardFrontData.ProdDesc || '';
    const svgns = 'http://www.w3.org/2000/svg';
    const chars = word.trim().split(' '), // node.firstChild.nodeValue.trim().split(' '),
      x = parseInt(node.getAttribute('x'), 10);

    let tspan, tspanWidth, textNode, index = 0, yPos = parseInt(node.getAttribute('y'), 10);
    const yPosDuplicate = yPos;
    // node.removeChild(node.firstChild);

    for (const c in chars) {
      if (chars.hasOwnProperty(c)) {
        tspanWidth = tspan == null ? 0 : tspan.getComputedTextLength();
        if (tspanWidth > width || tspanWidth === 0) {
          yPos = tspanWidth > width ? (yPosDuplicate + 5) : yPos;
          tspan = document.createElementNS(svgns, 'tspan');
          tspan.setAttribute('x', x);
          tspan.setAttribute('y', yPos);
          node.appendChild(tspan);
          index = 0;
          if (tspanWidth !== 0) {
            this.setPreviousSiblingY(tspan, yPos);
          }
        }

        textNode = document.createTextNode(index === 0 ? chars[c] : ' ' + chars[c]);
        tspan.appendChild(textNode);
        index++;
      }
    }
  }

  ngOnChanges(changes: any): void {
    this.memberName = this.cardData.memberCardFrontData.MemName;
    // this.cardType = this.cardData.cardType;
    // this.cardService.drawCard(this.canvasFrontRef.nativeElement, this.canvasBackRef.nativeElement,
    // this.cardData.memberCardFrontData, this.cardData.memberCardBackData);
    if (this.cardData && this.cardData.memberCardBackData && this.cardData.memberCardBackData[0]) {
      this.getNumberInfo(this.cardData.memberCardBackData[0].Copy);
      this.wordWrap(this.planName.nativeElement, 110);
    }
  }

  getNumberInfo(numbersDetail: string) {
    const numbersInfo = numbersDetail.split('|');
    this.memberServiceNumber = this.getNumber('Member Service', numbersInfo);
    this.providerServiceNumber = this.getNumber('Provider Service', numbersInfo);
    this.blueCareNumber = this.getNumber('Blue Care Line', numbersInfo);
  }

  getNumber(identifier: string, numbersInfo: string[]) {
    const numberDetails = numbersInfo.find((numberInfo) => numberInfo.includes(identifier));
    let number = '';
    if (numberDetails) {
      const numberDetailsArray = numberDetails.split(':');
      number = numberDetailsArray[1] ? numberDetailsArray[1] : '';
    }
    return number;
  }

  toggleCard() {
    this.isFrontView = !this.isFrontView;
    this.currentView = this.isFrontView ? 'View Back' : 'View Front';
  }

  getImageUrls(isIE, oSvg, oCanvas, sIndex, sTotalImages, aCardReferences, fnCallback) {
    const sSvgText = isIE ? new XMLSerializer().serializeToString(oSvg) : oSvg.outerHTML,
      // oBlobSvg = new Blob([sSvgText], {type: 'image/svg+xml;charset=utf-8'}),
      // domURL = self.URL || self.webkitURL || self,
      url = 'data:image/svg+xml;base64,' + btoa(sSvgText), // domURL.createObjectURL(oBlobSvg) domURL.createObjectURL(oSvg),
      dpr = window.devicePixelRatio || 1,
      oContext = oCanvas.getContext('2d'),
      frontbsr = oContext.webkitBackingStorePixelRatio ||
        oContext.mozBackingStorePixelRatio ||
        oContext.msBackingStorePixelRatio ||
        oContext.oBackingStorePixelRatio ||
        oContext.backingStorePixelRatio || 1,
      frontratio = dpr / frontbsr;
    $(oSvg).removeAttr('width');
    $(oSvg).removeAttr('height');
    oCanvas.width = 410 * frontratio;
    oCanvas.height = 250 * frontratio;
    oCanvas.style.width = '410px';
    oCanvas.style.height = '250px';
    oCanvas.getContext('2d').setTransform(frontratio, 0, 0, frontratio, 0, 0);
    if (!isIE) {
      const oImage = new Image(410, 250);
      oImage.src = url;
      oImage.onload = (function (sIdx) {
        return function () {
          oContext.drawImage(this, 5, 5, 400, 250);
          // domURL.revokeObjectURL(url);
          // aCardReferences.push(oCanvas);
          aCardReferences.splice(sIdx, 0, oCanvas);
          if (sTotalImages === aCardReferences.length) {
            fnCallback(aCardReferences);
          }

        };
      })(sIndex);

    } else {
      canvg(oCanvas, sSvgText);
      aCardReferences.push(oCanvas);
      if (sTotalImages === aCardReferences.length) {
        fnCallback(aCardReferences);
      }
      // sTotalImages === aCardReferences.length && fnCallback(aCardReferences);
    }
  }

  downloadPdf(containerReference, dependent) {
    const aSvgImages = $(containerReference).find('svg');
    const aCardReferences = [];
    const sFilename = dependent === 'All' ? 'BCBSMA_ALL_CARDS' : 'BCBSMA_' + dependent;
    aSvgImages.each((sIndex, oSvg) => {
      const oDivWrapper = document.createElement('div');
      const isIE = this.isExplorer;
      oDivWrapper.innerHTML = isIE ? new XMLSerializer().serializeToString(oSvg) : oSvg.outerHTML;
      const oCopySvg = oDivWrapper.querySelector('svg');
      if (isIE) {
        oCopySvg.removeAttribute('xmlns');
      }
      // isIE && oCopySvg.removeAttribute('xmlns');
      $(oCopySvg).attr('width', '300');
      $(oCopySvg).attr('height', '199');
      const oCanvas = document.createElement('canvas');
      this.getImageUrls(isIE, oCopySvg, oCanvas, sIndex, aSvgImages.length, aCardReferences, () => {
        const aContent = [];
        const oImageObject = {
          image: '',
          alignment: 'center',
          fit: [310, 210],
          margin: [0, 10]
        };
        for (let aCardIndex = 0; aCardIndex < aCardReferences.length; aCardIndex++) {
          if (aCardIndex && aCardIndex % 2 === 1 && aCardIndex < aCardReferences.length - 1) {
            oImageObject['pageBreak'] = 'after';
          }

          oImageObject.image = aCardReferences[aCardIndex].toDataURL();
          aContent.push(JSON.parse(JSON.stringify(oImageObject)));
          if (oImageObject.hasOwnProperty('pageBreak')) {
            delete oImageObject['pageBreak'];
          }
        }

        const oDocDefinition = {
          content: aContent
        };
        pdfMake.createPdf(oDocDefinition).download(`${sFilename}.pdf`);

      });
    });

  }
}
