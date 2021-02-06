import { Api } from './movieApi';
import * as Handlebars from 'handlebars/runtime';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import Paginator from './paginator.js';
import { spinner } from './spinner';
import { searchFilmsForBuddy } from './firebase-buddy';

const searchForm = document.querySelector('.search-form');
const homeGalleryListRef = document.querySelector('.home-gallery__js');
// const errorArea = document.querySelector('.search-error__js');
const paginator = new Paginator();
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов
// let currentMovieItem = null;

searchForm.addEventListener('click', ()=>{input.onInputFocus()});
searchForm.addEventListener('submit', (e)=>{input.searchFilms(e)});

// Вызов самого первого fetch за популярными фильмами и его рендер

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
    // console.log(e);
    e.preventDefault();
    Api.searchQuery = e.target.elements.query.value.trim();
    this.toggleRenderPage();
  },

  toggleRenderPage() {
    this.clearGallery(homeGalleryListRef);
    // console.log('Api.searchQuery.length', Api.searchQuery.length);
    if (!Api.searchQuery.length) {
      this.renderPopularFilms();
    } else {
      this.renderSearchedFilms(Api.searchQuery);
    }
  },

  async renderSearchedFilms(inputValue) {
    spinner.show();

    currentMoviesList = await Api.fetchSearchMovieList(inputValue);
    console.log('currentMoviesList', currentMoviesList.length);
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
    console.log('this is notFound');
    this.errorArea.style.visibility = 'visible';
    setTimeout(this.clearError, 2000);
    this.clearInput();
    Api.resetPage();
    this.renderPopularFilms();
  },

  clearError() {
    this.errorArea.style.visibility = 'hidden';
  },
};

input.renderPopularFilms();

// NAVIGATION module
const logoNavRef = document.querySelector('.logo__js');
const homeNavLinkRef = document.querySelector('.home-page-link__js');
const homeSectionRef = document.querySelector('.home__js');
const libraryNavLinkRef = document.querySelector('.library-page-link__js');
const librarySectionRef = document.querySelector('.library__js');
const buddyNavLinkRef = document.querySelector('.buddy-page-link__js');
const buddySectionRef = document.querySelector('.buddies__js');
const navigationRefs = document.querySelector('.navigation__js');
const searchFormRef = document.querySelector('.search-form__js');
const tabsLibrary = document.querySelector('.tabs__js');
const headerNavRef = document.querySelector('.header__js');
// mobile menu
const homeMobNavRef = document.querySelector('.home-page-link-mobile__js');
const libraryMobNavRef = document.querySelector('.library-page-link-mobile__js');
const buddyMobNavRef = document.querySelector('.buddy-page-link-mobile__js');
// Buddy page lists
const moviesToDiscussListRef = document.querySelector('.movies-list__js');
const buddiesListRef = document.querySelector('.buddies-list__js');

logoNavRef.addEventListener('click', activeHomePage);
homeNavLinkRef.addEventListener('click', activeHomePage);
libraryNavLinkRef.addEventListener('click', activeLibraryPage);
buddyNavLinkRef.addEventListener('click', activeBuddyPage);
homeMobNavRef.addEventListener('click', activeHomePage);
libraryMobNavRef.addEventListener('click', activeLibraryPage);
buddyMobNavRef.addEventListener('click', activeBuddyPage);

function activeHomePage(e) {
  homeMobNavRef.classList.add('sidenav-close');
  Api.resetPage();
  input.clearGallery(homeGalleryListRef);
  input.clearInput();
  input.renderPopularFilms();
  searchFormRef.removeEventListener('submit', searchFilmsForBuddy);

  toggleActiveLink(homeNavLinkRef.firstElementChild);
  homeSectionRef.classList.remove('hide');
  librarySectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  searchFormRef.classList.remove('hide');
  tabsLibrary.classList.add('hide');
  headerNavRef.classList.add('bg-home');
  headerNavRef.classList.remove('bg-buddies');
  headerNavRef.classList.remove('bg-library');
}

function activeLibraryPage(e) {
  paginator.refs.pagination.removeEventListener('click', paginator.onPaginationClick);
  libraryMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(libraryNavLinkRef.firstElementChild);
  librarySectionRef.classList.remove('hide');
  searchFormRef.classList.add('hide');
  homeSectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  tabsLibrary.classList.remove('hide');
  headerNavRef.classList.remove('bg-home');
  headerNavRef.classList.add('bg-library');
  headerNavRef.classList.remove('bg-buddies');
}
function activeBuddyPage(e) {
  cleanBuddyPage();
  input.clearInput();
  searchFormRef.addEventListener('submit', searchFilmsForBuddy);
  paginator.refs.pagination.removeEventListener('click', paginator.onPaginationClick);
  buddyMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(buddyNavLinkRef.firstElementChild);
  buddySectionRef.classList.remove('hide');
  homeSectionRef.classList.add('hide');
  librarySectionRef.classList.add('hide');
  headerNavRef.classList.add('bg-buddies');
  headerNavRef.classList.remove('bg-home');
  headerNavRef.classList.remove('bg-library');
  tabsLibrary.classList.add('hide');
  searchFormRef.classList.remove('hide');
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.current');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('current');
  }
  link.classList.add('current');
}

function cleanBuddyPage() {
  moviesToDiscussListRef.innerHTML = '';
  buddiesListRef.innerHTML = '';
}

export { currentMoviesList, genres, input, activeBuddyPage };
