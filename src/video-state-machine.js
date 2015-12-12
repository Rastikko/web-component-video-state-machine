'use strict'

let importDoc = document.currentScript.ownerDocument;

class VideoStateMachine extends HTMLElement {
  constructor() {
    super();
  }

  createdCallback() {
    let shadow = this.createShadowRoot();
    let template = importDoc.querySelector('#videoStateTemplate');
    shadow.appendChild(template.content.cloneNode(true));
  }

  attachedCallback() {
    // Process and add to the shadow each one of the videos
    // Once all the videos are being preloaded we can play the intro
    // Once the intro ended we play the loop and fade out the intro
    let contentVideos = this.querySelectorAll('video');
    let introVideo;
    let loopVideo;

    for (let i = 0; i < contentVideos.length; i++) {
      let video = contentVideos[i];
      this._processVideo(contentVideos[i]);

      if (video.getAttribute('data-video-type') === 'intro') {
        video.play();
        introVideo = video;
      }

      if (video.getAttribute('data-video-type') === 'loop') {
        video.style.display = 'none';
        video.setAttribute('loop', true);
        loopVideo = video;
      }
    }

    // We need to figure out how to capture just before ending to avoid a hiccup
    introVideo.onended = () => {
      loopVideo.style.display = null;
      loopVideo.play();
      removeChild(introVideo);
    };
  }

  // This will return a domElement video with preload and absolute
  _processVideo(video) {
    video.setAttribute('preload', true);
    video.style.position = 'absolute';
  }
}

document.registerElement('video-state-machine', VideoStateMachine);
