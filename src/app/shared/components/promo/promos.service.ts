import { Injectable } from '@angular/core';
declare let $: any;

@Injectable()
export class PromosService {

  constructor() {
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_self');
    }
  }

  playPauseVideo(controls: any[], play: boolean) {
    if (controls && controls.length > 0) {
      for (const control of controls) {
        play ? control.play() : control.pause();
      }
    }
  }


  openVideoModal(id) {
    $(id).modal('open');
    const videoIdplay = id + ' video';
    // this.playPauseVideo($(videoIdplay), true);
  }

  closeVideoModal(id) {
    $(id).modal('close');
  }

}
