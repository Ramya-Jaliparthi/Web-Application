import { Component, OnInit, Input } from '@angular/core';
import {PromosService} from '../promos.service';
declare let $: any;
@Component({
  selector: 'app-promo-blocks',
  templateUrl: './promo-blocks.component.html',
  styleUrls: ['./promo-blocks.component.scss']
})
export class PromoBlocksComponent implements OnInit {

  @Input() data: any;
  @Input() ismobile: boolean;
  carouselVideoSource: string = '';
  constructor(
    private promoService: PromosService
  ) {
   }

  ngOnInit() {
    $('#drupalVideoModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '0%', // Ending top style attribute
      ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
        console.log(modal, trigger);
        // this.promoService.playPauseVideo($('#drupalVideoModal video'), true);
      },
      complete: () => {
      }
    });

  }

  openUrl(url) {
    if (url) {
      this.promoService.openUrl(url);
    } else {
      return;
    }
  }

  openVideoModal(event, videoSourceUrl: string) {
    event.stopPropagation();
    this.carouselVideoSource = videoSourceUrl;
    this.promoService.openVideoModal('#drupalVideoModal');
  }

  closeVideoModal() {
   this.promoService.closeVideoModal('#drupalVideoModal');
    this.carouselVideoSource = '';
  }

}
