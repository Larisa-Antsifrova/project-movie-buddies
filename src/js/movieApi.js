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
      backdropSize: '',
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

// ===== Глобальные переменные
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров
let currentMoviesList = Api.fetchTrendingMoviesList(); // содержит массив с объектами фильмов
let currentMovieItem = null;

const homeGalleryRef = document.querySelector('.home-gallery-list__js');

Api.fetchTrendingMoviesList().then(movies => {
  let filmsYear = movies.reduce((acc, movie) => {
    const filmYear = movie.release_date ? `${movie.release_date.slice(0, 4)}` : `${movie.first_air_date.slice(0, 4)}`;
    acc.push(filmYear);
    return acc
  }, [])
  let filmsGenres = movies.map(movie => {
    const filmGenresIdArr = movie.genre_ids;
    // console.log('filmGenresIdArr', filmGenresIdArr);
    let filmGenre = filmGenresIdArr.reduce((acc, genre) => {
          console.log(genre);
        // console.log('genres', genres);
        // console.log('name', genres.name);
      if (filmGenresIdArr.includes(genres.id)) {
        acc.push(genres.name);
      }
      return acc;
    }, []);
    // console.log('filmGenre', filmGenre);
  });
    // genres.then(genresArr => {
    //   let thisMovieGenres = genresArr.reduce((acc, genre) => {
    //       if (genresIdArr.includes(genre.id)) {
    //         acc.push(genre.name);
    //     }
    //       return acc;
    //   }, []);
    //   filmGenres = thisMovieGenres.join(', ');
    //   return filmGenres;
    // });
    // console.log(filmsYear);
  return ({movies, filmsYear})
}).then(({ movies, filmsYear }) => {
    const galleryListMarkup = galleryElementTemplate(movies);
  homeGalleryRef.insertAdjacentHTML('beforeend', galleryListMarkup);
});

Handlebars.registerHelper('getMovieYear', function (release_date) {
  var movieYear = release_date.slice(0, 4);
  return movieYear;
});

export default { Api, currentMovieItem, currentMoviesList, genres };
