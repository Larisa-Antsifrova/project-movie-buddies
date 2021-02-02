import { Api } from './movieApi.js';

const trailer = {
  trailerSection: document.querySelector('.trailer'),
  trailerItem: document.createElement('li'),
  YOUTUBE_URL: 'https://www.youtube.com//embed/',
  trailerKey: '',

  renderMovieTrailer(el) {
    movieApi.fetchTrailersAPI(el).then(this.createTrailerBtn.bind(this));
  },
  // функция принимает ключ трейлера и вставляет полную ссылку на него в li
  createTrailerRef(key) {
    this.trailerItem.classList.add('trailer__ref');
    const fullURL = `${this.YOUTUBE_URL}${key}`;
    const trailerRef = `<a href="${fullURL}" class='waves-effect waves-light btn-small pink'><i class="material-icons left">videocam</i>Watch me!</a>`;
    this.trailerItem.insertAdjacentHTML('afterbegin', trailerRef);
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
    if (!trailer) {
      const disabledBtn = this.createDisabledButton();
      this.trailerSection.insertAdjacentElement('afterbegin', disabledBtn);
      return;
    }

    this.trailerKey = trailer.key;
    const trailerBtn = this.createTrailerRef(this.trailerKey);
    this.trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
    this.trailerSection.addEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
  clearTrailerKey() {
    this.trailerItem.innerHTML = '';
    this.trailerSection.removeEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
};
