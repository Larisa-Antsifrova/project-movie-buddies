import axios from 'axios';
import * as Handlebars from 'handlebars/runtime';
import { API_KEY } from './apiKey.js';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
// import {notFound} from './input.js';

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
    // if (respArr.length === 0) {
    //   notFound();
    // }
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

// ===== Глобальные переменные
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов
let currentMovieItem = null;

const homeGalleryRef = document.querySelector('.home-gallery-list__js');

// ============================ function rendering ==============================
async function getRealiseData(moviesList) {
  getGenresInfo(moviesList);
  moviesList.then(movies => {
      const galleryListMarkup = galleryElementTemplate(movies);
      homeGalleryRef.insertAdjacentHTML('beforeend', galleryListMarkup);
  });
}
getRealiseData(currentMoviesList);

async function getGenresInfo(moviesList) {
  const genresInfo = await Promise.all([moviesList, genres]);
    let filmsGenres = genresInfo[0].map(movie => {
      let filmGenresIdArr = movie.genre_ids;
      let thisMovieGenres = genresInfo[1].reduce((acc, genre) => {
        if (filmGenresIdArr.includes(genre.id)) {
          acc.push(genre.name);
        }
        return acc;
      }, []);
      return thisMovieGenres.join(', ');
    })
    // console.log(filmsGenres);
  return filmsGenres;
};

// ================ Handlebars Helpers ===================================
Handlebars.registerHelper('getMovieYear', function (release_date) {
  if (!release_date) {
    return;
  }
  var movieYear = release_date.slice(0, 4);
  return movieYear;
});

// Handlebars.registerHelper('getPoster', function (poster_path) {
//   if (!poster_path) {
//     return;
//   }
//   return movieYear;
// });




// ==================================================
export default {Api, getRealiseData, currentMovieItem, currentMoviesList, genres};
