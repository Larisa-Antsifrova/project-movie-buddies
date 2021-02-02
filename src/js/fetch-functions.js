import { Api } from './movieApi';
import * as Handlebars from 'handlebars/runtime';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import Paginator from './paginator.js';
import { spinner } from './spinner';

const searchForm = document.querySelector('.search-form');
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const errorArea = document.querySelector('.search-error__js');
const paginator = new Paginator();
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = null; //Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов
let currentMovieItem = null;
let currentMovies = Api.fetchTrendingMoviesList();

searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// Вызов самого первого fetch за популярными фильмами и его рендер
renderPopularFilms();

// ============================ function rendering ==============================
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

// ================ Handlebars Helpers ===================================
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

// ==================================== input ===============================================================

// функция для слушателя инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  Api.searchQuery = e.target.elements.query.value.trim();
  toggleRenderPage();
}

// функция выбора отображения страницы в зависимости от наличия текстa в инпуте.
function toggleRenderPage() {
  clearGallery(homeGalleryListRef);

  if (!Api.searchQuery.length) {
    renderPopularFilms();
  } else {
    renderSearchedFilms(Api.searchQuery);
  }
}

// функция рендера страницы запроса
function renderSearchedFilms(inputValue) {
  spinner.show();

  currentMoviesList = Api.fetchSearchMovieList(inputValue);
  return combineFullMovieInfo(currentMoviesList)
    .then(createMovieList)
    .then(() => {
      paginator.recalculate(Api.pageNumber || 1, Api.totalPages || 1);
    })
    .then(() => {
      spinner.hide();
    });
}

// функция рендера страницы трендов
function renderPopularFilms() {
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
}

function clearGallery(filmsList) {
  filmsList.innerHTML = '';
}

// функция очистки инпута и параграфа ошибки при фокусе
function onInputFocus() {
  clearError();
  clearInput();
  Api.resetPage();
}

function clearInput() {
  searchForm.elements.query.value = '';
  Api.searchQuery = '';
}

// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = 'visible';
  setTimeout(clearError, 2000);
  clearInput();
  Api.resetPage();
  return renderPopularFilms();
}

function clearError() {
  errorArea.style.visibility = 'hidden';
}

export {
  // currentMoviesList,
  currentMovies,
  currentMovieItem,
  genres,
  toggleRenderPage,
  notFound,
  combineFullMovieInfo,
  createMovieList,
};
