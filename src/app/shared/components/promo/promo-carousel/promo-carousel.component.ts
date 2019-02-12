import {Component, OnInit, Input} from '@angular/core';
import { Image } from '../../../models/image.model';
import {PromosService} from '../promos.service';
declare let $: any;

@Component({
  selector: 'app-promo-carousel',
  templateUrl: './promo-carousel.component.html',
  styleUrls: ['./promo-carousel.component.scss']
})
export class PromoCarouselComponent implements OnInit {

  @Input() carouselItems: Image[];
  @Input() ismobile: boolean;
  carouselCurrentIndex = 0;
  carouselVideoSource: string = '';
  constructor(private promoService: PromosService) { }

  ngOnInit() {

    $('#carouselVideoModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '0%', // Ending top style attribute
      ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
        console.log(modal, trigger);
        // this.promoService.playPauseVideo($('#carouselVideoModal video'), true);
      },
      complete: () => {
      }
    });
  }


  incrementInfoTextCounter() {
    if (this.carouselCurrentIndex !== (this.carouselItems.length - 1)) {
      this.carouselCurrentIndex = this.carouselCurrentIndex === (this.carouselItems.length - 1) ? 0 : (this.carouselCurrentIndex + 1);
      $('.info-container .carousel').carousel('next');
    }
  }

  decrementInfoTextCounter() {
    if (this.carouselCurrentIndex > 0) {
      this.carouselCurrentIndex = this.carouselCurrentIndex === 0 ?
        (this.carouselItems.length - 1) : (this.carouselCurrentIndex - 1);
      $('.info-container .carousel').carousel('prev');
    }
  }

  openVideoModal(videoSourceUrl: string) {
      this.carouselVideoSource = videoSourceUrl;
      this.promoService.openVideoModal('#carouselVideoModal');
  }

  closeVideoModal() {
    this.promoService.closeVideoModal('#carouselVideoModal');
    this.carouselVideoSource = '';
  }

  openUrl(url) {
    this.promoService.openUrl(url);
  }
}
