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

  getMoviesPerPage() {
    if (window.visualViewport.width >= 1024) {
      return 9;
    }
    if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
      return 8;
    }
    if (window.visualViewport.width < 768) {
      return 4;
    }
  },
  async fetchTrendingMoviesList() {
    const data = await this.smartFetchMovies(this.pageNumber, this.getMoviesPerPage(), async pageNumber => {
      return (await axios.get(`/trending/all/week?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`)).data;
    });
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    return respArr;
  },
  async fetchSearchMovieList(query) {
    this.searchQuery = query;
    const data = await this.smartFetchMovies(this.pageNumber, this.getMoviesPerPage(), async pageNumber => {
      return (
        await axios.get(
          `/search/multi?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}&page=${pageNumber}`,
        )
      ).data;
    });
    console.log(data);
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

  async smartFetchMovies(pageNumber, perPage, fetchMovies) {
    pageNumber -= 1;
    const bigPerPage = 20;
    const startIdx = pageNumber * perPage;
    const bigStartPage = Math.floor(startIdx / bigPerPage);

    const startData = await fetchMovies(bigStartPage + 1);

    const lastIdx = startData.total_results - 1;
    const totalPages = Math.floor(lastIdx / perPage) + 1;
    const endIdx = Math.min(lastIdx, startIdx + perPage - 1);
    const bigEndPage = Math.floor(endIdx / bigPerPage);

    const is = startIdx % bigPerPage;
    const ie = endIdx % bigPerPage;
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log('args', pageNumber + 1, perPage);
    // console.log('idx', startIdx, endIdx, lastIdx);
    // console.log('is-ie', is, ie);
    // console.log('bigPage', bigStartPage, bigEndPage);
    // console.log('totalPages', totalPages);

    const twoPages = bigStartPage !== bigEndPage;
    const data = {
      results: startData.results.slice(is, twoPages ? bigPerPage : ie + 1),
      total_pages: totalPages,
    };

    if (twoPages) {
      const endData = await fetchMovies(bigEndPage + 1);
      data.results.push(...endData.results.slice(0, ie + 1));
    }

    return data;
  },
};
Api.calculatePosterImgSize();

export { Api };
