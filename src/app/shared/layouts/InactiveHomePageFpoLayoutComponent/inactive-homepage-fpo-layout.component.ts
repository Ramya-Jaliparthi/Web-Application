import { Component, HostListener, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FpocontentService } from '../../services/fpocontent.service';
import { environment } from '../../../../environments/environment';
import { ConstantsService } from '../../services/constants.service';

declare let $: any;

@Component({
  selector: 'app-inactive-homepage-fpo-layout',
  templateUrl: './inactive-homepage-fpo-layout.html',
  styleUrls: ['./inactive-homepage-fpo-layout.scss']
})
export class InactiveHomePageFpoLayoutComponent implements OnInit {

  @Input() targetUrl: string;
  @Input() toolTipdataPlans: object;
  @Input() isplandetails: boolean;
  @Input() displayCategory: string;
  @Input() layout: string = '';
  @Output() closePullTextEmitter = new EventEmitter();
  fpocontentData: any;
  ismobile: boolean = false;
  mobileViewPort = 992;
  fontawesomeIcon = '';
  appstoreImageUrl = '';
  bodyContent = '';

  constructor(private fpocontentService: FpocontentService, private constantsService: ConstantsService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }

  ngOnInit() {
    if (this.toolTipdataPlans && this.isplandetails) {
      this.prepareDrupalContent(this.toolTipdataPlans);
    } else {
      this.fpocontentService.fetchContent(this.targetUrl).subscribe((response) => {
        this.prepareDrupalContent(response);
      });
    }
  }

  prepareDrupalContent(response?) {
    if (response && response[0]) {
      this.fpocontentData = response[0];
      this.fpocontentData.RegularImages = this.fpocontentData.RegularImages ?
        environment.drupalTestUrl + this.fpocontentData.RegularImages : this.fpocontentData.RegularImages;
      this.fpocontentData.MobileImages = this.fpocontentData.MobileImages ?
        environment.drupalTestUrl + this.fpocontentData.MobileImages : this.fpocontentData.MobileImages;
      this.fontawesomeIcon = this.fpocontentData.FontawesomeIconUnicode ?
        '<i class=\"fa fa-2x\">&#x' + this.fpocontentData.FontawesomeIconUnicode + ';</i>' : '';
      let url: string = this.fpocontentData.AppstoreIcon;
      url = url.replace('<img src=\"', '').trim();
      this.fpocontentData.AppstoreIcon = '<img src=\"' + this.constantsService.drupalTestUrl + url;
      url = this.fpocontentData.GoogleplayIcon;
      url = url.replace('<img src=\"', '').trim();
      this.fpocontentData.GoogleplayIcon = '<img src=\"' + this.constantsService.drupalTestUrl + url;
      this.bodyContent = this.fpocontentData.Body.replace('<p>', '').replace('</p>', '');
      const thumbnail = this.fpocontentData.VideoThumbnailIcon;
      if (thumbnail) {
        this.fpocontentData.VideoThumbnailIconSrc = environment.drupalTestUrl + $(thumbnail).attr('src');
      }
    }
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_self');
    }
  }

  closePullText() {
    this.closePullTextEmitter.emit({
      value: 'close'
    });
  }

}
