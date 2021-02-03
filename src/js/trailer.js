const modalWindow = {
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxCard: document.querySelector('.js-lightbox'),
  trailerVideo: document.querySelector('.trailer_referense'),

  openModal(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'A') {
      return;
    }
    this.trailerVideo.src = event.target.href;
    // console.log('trailerVideo.src', this.trailerVideo.src);
    this.lightboxCard.classList.add('is-open');
    this.lightboxOverlay.addEventListener('click', this.onClickOverlay.bind(this));
    this.addKeydownListener();
  },
  addKeydownListener() {
    window.addEventListener('keydown', this.onPressEscape.bind(this));
  },
  removeKeydownListener() {
    window.removeEventListener('keydown', this.onPressEscape.bind(this));
  },
  onClickOverlay(event) {
    if (event.target === event.currentTarget) {
      this.closeLightboxHandler();
    }
  },
  onPressEscape(event) {
    if (event.code === 'Escape') {
      this.closeLightboxHandler();
    }
  },
  closeLightboxHandler() {
    this.removeKeydownListener();
    this.lightboxCard.classList.remove('is-open');
    this.trailerVideo.src = '';
    this.lightboxOverlay.removeEventListener('click', this.onClickOverlay.bind(this));
  },
};

export { modalWindow };