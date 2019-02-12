import { Component, OnInit, Input } from '@angular/core';
import {PromosService} from '../promos.service';
declare let $: any;
@Component({
  selector: 'app-promo-images',
  templateUrl: './promo-images.component.html',
  styleUrls: ['./promo-images.component.scss']
})
export class PromoImagesComponent implements OnInit {

  @Input() images: any[];
  imagesResponse: any[];
  carouselVideoSource: string = '';
  constructor(
    private promoService: PromosService
  ) {
   }

  ngOnInit() {
    $('#imageVideoModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '0%', // Ending top style attribute
      ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
        console.log(modal, trigger);
        // this.promoService.playPauseVideo($('#imageVideoModal video'), true);
      },
      complete: () => {
      }
    });

    if (this.images) {
      this.imagesResponse = [];
      for (const image of this.images) {
        image.subscribe((response) => {
          const currentItemIndex = this.imagesResponse.findIndex((img) => img.Index === response.Index);
          if (currentItemIndex > -1) {
            this.imagesResponse[currentItemIndex] = response;
          } else {
            this.imagesResponse.push(response);
          }
        });
      }
    }
  }

  openUrl(url) {
    this.promoService.openUrl(url);
  }

  openVideoModal(event, videoSourceUrl: string) {
    event.stopPropagation();
    this.carouselVideoSource = videoSourceUrl;
    this.promoService.openVideoModal('#imageVideoModal');
  }

  closeVideoModal() {
   this.promoService.closeVideoModal('#imageVideoModal');
    this.carouselVideoSource = '';
  }

}
