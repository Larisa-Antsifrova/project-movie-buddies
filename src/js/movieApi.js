import axios from 'axios';
import { API_KEY } from './apiKey.js';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import * as Handlebars from 'handlebars/runtime';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

const Api = {
  apiKey: API_KEY,
  searchQuery: '',
  filmID: '',
  perPage: 20,
  totalPages: 1,
  pageNumber: 1,
  images: {
    baseImageUrl: 'https://image.tmdb.org/t/p/',
    defaultPosterImg: '',
    currentSizes: {
      posterSize: '',
    },
    posterSizes: {
      mobile: 'w342',
      tablet: 'w500',
      desktop: 'w780',
    },
  },

  incrementPage() {
    this.pageNumber += 1;
  },
  decrementPage() {
    this.pageNumber -= 1;
  },
  resetPage() {
    this.pageNumber = 1;
  },
  get imagePosterSize() {
    return this.images.currentSizes.posterSize;
  },
  calculatePosterImgSize() {
    if (window.visualViewport.width >= 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.desktop;
      this.images.defaultPosterImg = './images/default/poster-desktop.jpg';
    }
    if (
      window.visualViewport.width >= 768 &&
      window.visualViewport.width < 1024
    ) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
      this.images.defaultPosterImg = './images/default/poster-tablet.jpg';
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
      this.images.defaultPosterImg = './images/default/poster-mobile.jpg';
    }
  },
  async fetchTrendingMoviesList() {
    const { data } = await axios.get(
      `/trending/all/week?api_key=${API_KEY}&language=en-US&page=${this.pageNumber}`,
    );
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    return respArr;
  },
  async fetchSearchMovieList(query) {
    this.searchQuery = query;
    const { data } = await axios.get(
      `/search/multi?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}&page=${this.pageNumber}`,
    );
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    if (respArr.length === 0) {
      notFound();
    }
    return respArr;
  },
  async fetchTrailersAPI(el) {
    const { data } = await axios.get(
      `movie/${el}/videos?api_key=${this.apiKey}&language=en-US`,
    );
    if (!data.results) {
      return;
    } else {
      return data.results.find(e => {
        if (e.type == 'Trailer') {
          console.log('trailer', e);
          return e;
        }
      });
    }
  },
  async fetchGenresList() {
    const { data } = await axios.get(
      `/genre/movie/list?api_key=${this.apiKey}`,
    );
    return data.genres;
  },
};
Api.calculatePosterImgSize();

// ===== Глобальные переменные ==============================================================
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов
let currentMovieItem = null;

const searchForm = document.querySelector('.search-form');
const homeGalleryRef = document.querySelector('.home-gallery-list__js');
const errorArea = document.querySelector('.search-error__js');


// ============================ function rendering ==============================
async function createMovieList(moviesList) {
  const moviesFullInfo = await moviesList;
  const genres_info = await getGenresInfo(moviesList);
  const fullInfo = await moviesFullInfo.map((movie, ind) => {
    movie['genres_name'] = genres_info[ind];
    return movie;
  })
  const galleryListMarkup = galleryElementTemplate(fullInfo);
  homeGalleryRef.insertAdjacentHTML('beforeend', galleryListMarkup);
}
createMovieList(currentMoviesList);

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
    })
  return filmsGenres;
};

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
    const defaultImgUrl = 'https://drive.google.com/file/d/1pdAzALp81F5lBAVna3VrQKfcVaMirqrQ/view?usp=sharing'
    return Handlebars.SafeString(defaultImgUrl);
  } else {
    const imgUrl = `${Api.images.baseImageUrl}${Api.images.currentSizes.posterSize}/${poster_path}`
    return imgUrl;

  }
});


// ==================================================
export { Api, createMovieList, currentMoviesList, currentMovieItem, genres };
  
// ==================================== input ===============================================================

searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// функция для слушателя инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  Api.searchQuery = e.target.elements.query.value.trim();
  toggleRenderPage();
};

// функция выбора отображения страницы в зависимости от наличия текстa в инпуте.
function toggleRenderPage() {
  clearGallery(homeGalleryRef);
  if (!Api.searchQuery.length) {
    renderPopularFilms();
  } else {
    renderSearchedFilms(Api.searchQuery);
  }
};

// функция рендера страницы запроса
function renderSearchedFilms(inputValue) {
  currentMoviesList = Api.fetchSearchMovieList(inputValue);
  createMovieList(currentMoviesList);
};

// функция рендера страницы трендов
function renderPopularFilms() {
  currentMoviesList = Api.fetchTrendingMoviesList();
  createMovieList(currentMoviesList);
};

function clearGallery(filmsList) {
  filmsList.innerHTML = '';
};

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
  toggleRenderPage();
}

function clearError() {
  errorArea.style.visibility = 'hidden';
}

