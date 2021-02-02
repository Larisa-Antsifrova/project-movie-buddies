import { Api } from './movieApi.js';
import detailTemplate from '../templates/4details.hbs';

const trailer = {
  trailerSection: document.querySelector('.trailer'),
  trailerItem: document.createElement('li'),
  YOUTUBE_URL: 'https://www.youtube.com//embed/',
  trailerKey: '',

  renderMovieTrailer(el) {
    Api.fetchTrailersAPI(el).then(this.createTrailerBtn.bind(this));
  },
  // функция принимает ключ трейлера и вставляет полную ссылку на него в li
  createTrailerRef(key) {
    this.trailerItem.classList.add('trailer__ref');
    const fullURL = `${this.YOUTUBE_URL}${key}`;
    const trailerRef = `<a href="${fullURL}" class='waves-effect waves-light btn-small pink'><i class="material-icons left">videocam</i>Watch me!</a>`;
      this.trailerItem.insertAdjacentHTML('afterbegin', trailerRef);
    console.log('trailerItem', this.trailerItem);
    return this.trailerItem;
  },
  createDisabledButton() {
    this.trailerItem.classList.add('trailer__ref');
    const disabledBtn = `<a href="#" class='disabled btn-small '><i class="material-icons left">videocam_off</i> No trailer</a>`;
      this.trailerItem.insertAdjacentHTML('afterbegin', disabledBtn);
    return this.trailerItem;
  },

  // функция принимает li с ссылкой и вставляет в список
    createTrailerBtn(trailer) {
        console.log('trailer', trailer);
        console.log('trailerSection', this.trailerSection);
    if (!trailer) {
      const disabledBtn = this.createDisabledButton();
      this.trailerSection.insertAdjacentElement('afterbegin', disabledBtn);
      return;
    }

    this.trailerKey = trailer.key;
        const trailerBtn = this.createTrailerRef(this.trailerKey);
        console.log('trailerBtn', trailerBtn);
    this.trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
    this.trailerSection.addEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
  clearTrailerKey() {
    this.trailerItem.innerHTML = '';
    this.trailerSection.removeEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
};

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

export { trailer };