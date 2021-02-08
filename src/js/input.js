import { Api } from './movieApi';
import Paginator from './paginator.js';
import { spinner } from './spinner';
import { combineFullMovieInfo, createMovieList } from './fetch-functions';

const paginator = new Paginator();
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const searchForm = document.querySelector('.search-form');
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов

const input = {
  errorArea: document.querySelector('.search-error__js'),

  searchFilms(e) {
    e.preventDefault();
    Api.searchQuery = e.target.elements.query.value.trim();
    this.toggleRenderPage();
  },

  toggleRenderPage() {
    this.clearGallery(homeGalleryListRef);
    if (!Api.searchQuery.length) {
      this.renderPopularFilms();
    } else {
      this.renderSearchedFilms(Api.searchQuery);
    }
  },

  async renderSearchedFilms(inputValue) {
    spinner.show();

    currentMoviesList = await Api.fetchSearchMovieList(inputValue);
    return combineFullMovieInfo(currentMoviesList)
      .then(createMovieList)
      .then(() => {
        paginator.recalculate(Api.pageNumber || 1, Api.totalPages || 1);
      })
      .then(() => {
        spinner.hide();
      });
  },

  async renderPopularFilms() {
    spinner.show();
    currentMoviesList = await Api.fetchTrendingMoviesList();
    return combineFullMovieInfo(currentMoviesList)
      .then(createMovieList)
      .then(() => {
        paginator.recalculate(Api.pageNumber, Api.totalPages);
      })
      .then(() => {
        spinner.hide();
      });
  },

  clearGallery(filmsList) {
    filmsList.innerHTML = '';
  },

  onInputFocus() {
    this.clearError();
    this.clearInput();
    Api.resetPage();
  },

  clearInput() {
    searchForm.elements.query.value = '';
    Api.searchQuery = '';
  },

  notFound() {
    this.errorArea.style.visibility = 'visible';
    setTimeout(this.clearError.bind(this), 2000);
    this.clearInput();
    Api.resetPage();
    this.toggleRenderPage();
  },

  notFoundBuddy() {
    this.errorArea.style.visibility = 'visible';
    setTimeout(this.clearError.bind(this), 2000);
    this.clearInput();
  },

  clearError() {
    this.errorArea.style.visibility = 'hidden';
  },
};

// Вызов самого первого fetch за популярными фильмами и его рендер
input.renderPopularFilms();

export { input, currentMoviesList };