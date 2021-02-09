import { Api } from './movieApi';
import Paginator from './paginator.js';
import { spinner } from './spinner';
import { combineFullMovieInfo, createMovieList, createGenresList } from './fetch-functions';

const paginator = new Paginator();
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const searchForm = document.querySelector('.search-form');
const genresList = document.querySelector('.genres_list__js');
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов

const input = {
  errorArea: document.querySelector('.search-error__js'),

  searchFilms(e) {
    e.preventDefault();
    Api.genreId = null;
    Api.searchQuery = e.target.elements.query.value.trim();
    this.toggleRenderPage();
  },

  toggleRenderPage() {
    this.clearGallery(homeGalleryListRef);
    if (!Api.searchQuery.length && !Api.genreId) {
      this.renderPopularFilms();
    } else if (Api.genreId) {
      this.renderGenreFilteredFilms();
    } else {
      this.renderSearchedFilms(Api.searchQuery);
    }
  },

  async renderSearchedFilms(inputValue) {
    spinner.show();

    currentMoviesList = await Api.fetchSearchMovieList(inputValue);
    if (!currentMoviesList) {
      this.notFound();
      return;
    }
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
    this.renderPopularFilms();
  },

  notFoundBuddy() {
    this.errorArea.style.visibility = 'visible';
    setTimeout(this.clearError.bind(this), 2000);
    this.clearInput();
  },

  clearError() {
    this.errorArea.style.visibility = 'hidden';
  },

  async renderGenreFilteredFilms() {
    spinner.show();
    input.clearGallery(homeGalleryListRef);
    let currentList = await Api.fetchGenresFilter();
    return combineFullMovieInfo(currentList)
      .then(createMovieList)
      .then(() => {
        paginator.recalculate(Api.pageNumber, Api.totalPages);
      })
      .then(() => {
        spinner.hide();
      });
  },
};

// Вызов самого первого fetch за популярными фильмами и его рендер
input.renderPopularFilms();

export { input, currentMoviesList };
