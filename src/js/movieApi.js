import axios from 'axios';
// import { make } from 'core-js/fn/object';
import { API_KEY } from './apiKey.js';
import { notFound } from './fetch-functions.js';
axios.defaults.baseURL = 'https://api.themoviedb.org/3';

const Api = {
  apiKey: API_KEY,
  searchQuery: '',
  filmID: '',
  currentPerPage: '',
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
    if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
      this.images.defaultPosterImg = './images/default/poster-tablet.jpg';
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
      this.images.defaultPosterImg = './images/default/poster-mobile.jpg';
    }
  },
  async fetchTrendingMoviesList() {
    const { data } = await axios.get(`/trending/all/week?api_key=${API_KEY}&language=en-US&page=${this.pageNumber}`);
    console.log(data);
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
    const { data } = await axios.get(`movie/${el}/videos?api_key=${this.apiKey}&language=en-US`);
    if (!data.results) {
      return;
    } else {
      return data.results.find(e => {
        if (e.type == 'Trailer') {
          return e;
        }
      });
    }
  },
  async fetchGenresList() {
    const { data } = await axios.get(`/genre/movie/list?api_key=${this.apiKey}`);
    return data.genres;
  },

  async fetchTrendingMovies_(pageNumber) {
    const { data } = await axios.get(`/trending/all/week?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`);
    return data;
  },

  async fetchTrendingMovies(pageNumber, perPage) {
    let firstItemIdx = perPage * (pageNumber - 1);
    let lastItemIdx = perPage * pageNumber - 1;
    const firstPage = Math.floor(firstItemIdx / 20) + 1;
    const lastPage = Math.floor(lastItemIdx / 20) + 1;
    console.log(firstPage, 'firstPage', lastPage, 'lastPage');
    console.log(firstItemIdx, 'firstItemIdx', lastItemIdx, 'lastItemIdx');

    const data = await this.fetchTrendingMovies_(firstPage);
    let results = {
      data: data.results.slice(firstItemIdx, lastItemIdx + 1),
      total_pages: Math.ceil((data.total_pages * 20) / perPage),
    };
    if (firstPage !== lastPage) {
      const data2 = await this.fetchTrendingMovies_(lastPage);
      // const remainder = lastItemIdx % 20;
      // console.log(remainder, 'remainder');
      let moviesToAdd = data2.results.slice(0, lastItemIdx - 20 + 1);
      console.log(moviesToAdd, 'with data2');
      moviesToAdd.unshift(...data.results.slice(firstItemIdx, 20));
      console.log(moviesToAdd, 'with both data');
      results.data = moviesToAdd;
    }

    return results;

    // const remainder = lastItemIdx % 20;
    // const requiredPages = remainder > perPage ? currentPage : [currentPage - 1, currentPage];
  },
};
Api.calculatePosterImgSize();

export { Api };

// function makeSmallerPages(pageNumber, perPage) {
//   const lastItemIdx = perPage * pageNumber - 1;
//   console.log(lastItemIdx, 'lastItemIdx');

//   const firstItemIdx = perPage * (pageNumber - 1);
//   console.log(firstItemIdx, 'firstItemIdx');

//   const currentPage = Math.floor(lastItemIdx / 20) + 1;
//   console.log(currentPage, 'currentPage');

//   const remainder = lastItemIdx % 20;
//   const requiredPages = remainder > perPage ? currentPage : [currentPage - 1, currentPage];
//   console.log(requiredPages, 'requiredPages from default fetch');

//   return requiredPages;
// }

// makeSmallerPages(2, 8);

Api.fetchTrendingMovies(3, 9).then(console.log);
