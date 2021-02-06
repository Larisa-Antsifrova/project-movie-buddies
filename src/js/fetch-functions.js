import { Api } from './movieApi';
import * as Handlebars from 'handlebars/runtime';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import Paginator from './paginator.js';
import { spinner } from './spinner';

const searchForm = document.querySelector('.search-form');
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const switchRef = document.querySelector('.media-switch');
const paginator = new Paginator();
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов

switchRef.addEventListener('change', toggleMediaType);
searchForm.addEventListener('click', () => { input.onInputFocus() });
searchForm.addEventListener('submit', (e)=>{input.searchFilms(e)});


// ============================ function rendering ============================
// Функция для отрисовки списка популярных фильмов
function createMovieList(fullInfo) {
  const galleryListMarkup = galleryElementTemplate(fullInfo);
  homeGalleryListRef.insertAdjacentHTML('afterbegin', galleryListMarkup);
}

// Функция для добавления декодированных жанров в обьект фильмов
async function combineFullMovieInfo(moviesList) {
  const moviesFullInfo = await moviesList;
  const genres_info = await getGenresInfo(moviesList);
  const fullInfo = await moviesFullInfo.map((movie, ind) => {
    movie['genres_name'] = genres_info[ind];
    return movie;
  });
  return fullInfo;
}

async function getGenresInfo(moviesList) {
  const genresInfo = await Promise.all([moviesList, genres]);
  let filmsGenres = genresInfo[0].map(movie => {
    let filmGenresIdArr = movie.genre_ids;
    let thisMovieGenres = genresInfo[1].reduce((acc, genre) => {
      if (filmGenresIdArr && filmGenresIdArr.includes(genre.id)) {
        acc.push(genre.name);
      }
      return acc;
    }, []);
    return thisMovieGenres.join(', ');
  });
  return filmsGenres;
}

function toggleMediaType(e) {
  if (!e.target.checked) {
    Api.mediaType = 'movie';
  } else {
    Api.mediaType = 'tv';
  }
  input.toggleRenderPage();
}

// ============================ Handlebars Helpers ============================
Handlebars.registerHelper('getMovieYear', function (release_date) {
  if (!release_date) {
    return;
  } else {
    var filmYear = release_date.slice(0, 4);
    return filmYear;
  }
});

Handlebars.registerHelper('getPoster', function (poster_path) {
  if (!poster_path) {
    const defaultImgUrl = `https://cdn.pixabay.com/photo/2015/09/09/17/51/film-932154_960_720.jpg`;
    return defaultImgUrl;
  } else {
    const imgUrl = `${Api.images.baseImageUrl}${Api.images.currentSizes.posterSize}/${poster_path}`;
    return imgUrl;
  }
});

// ============================ input ============================
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
    if (!currentMoviesList.length) {
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

  renderPopularFilms() {
    spinner.show();
    currentMoviesList = Api.fetchTrendingMoviesList();
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
};

// Вызов самого первого fetch за популярными фильмами и его рендер
input.renderPopularFilms();

export { currentMoviesList, genres, input };
