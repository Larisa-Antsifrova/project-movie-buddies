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
  mediaType: 'movie',
  images: {
    baseImageUrl: 'https://image.tmdb.org/t/p/',
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
    }
    if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
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
      return (await axios.get(`/trending/${this.mediaType}/week?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`)).data;
    });
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    console.log(respArr);
    return respArr;
  },
  async fetchSearchMovieList(query) {
    this.searchQuery = query;
    const data = await this.smartFetchMovies(this.pageNumber, this.getMoviesPerPage(), async pageNumber => {
      return (
        await axios.get(
          `/search/${this.mediaType}?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}&page=${pageNumber}`,
        )
      ).data;
    });
    // console.log(data);
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    if (respArr.length === 0) {
      notFound();
    }
    console.log(respArr);
    return respArr;
  },
  async fetchTrailersAPI(el) {
    const { data } = await axios.get(
      `${this.mediaType}/${el}/videos?api_key=${this.apiKey}&language=en-US`,
    );
    if (!data.results.length) {
      return
    } else {
      return data.results.find(e => {
        if (e.type == 'Trailer') {
          return e;
        }
      });
    }
  },
  async fetchGenresList() {
    const { data } = await axios.get(`/genre/${this.mediaType}/list?api_key=${this.apiKey}`);
    return data.genres;
  },

  //Функция, которая служит интерфейсом между fetchTrendingMoviesList() и дальнейшой обработкой
  // массива фильмов. Аргументами принимает текущую страницу, требуемое количество фильмов на странице
  // и функцию, которая делает непосредственный фетч-запрос
  async smartFetchMovies(pageNumber, perPage, fetchMovies) {
    pageNumber -= 1; // нумерация страниц начинается с 0
    const bigPerPage = 20; // количество обьектов, которое получаем с API
    const startIdx = pageNumber * perPage; //индекс первого элемента
    const bigStartPage = Math.floor(startIdx / bigPerPage); // требуемая страница запроса с API

    const startData = await fetchMovies(bigStartPage + 1);

    const lastIdx = startData.total_results - 1; // индекс последнего элемента. Важно, если последняя
    // страница содержит меньше bigPerPage элементов
    const totalPages = Math.floor(lastIdx / perPage) + 1; // общее количество пересчитанных страниц
    const endIdx = Math.min(lastIdx, startIdx + perPage - 1); // индекс последнего элемента на странице
    const bigEndPage = Math.floor(endIdx / bigPerPage); // последняя требуемая страница запроса с API
    // индексы требуемых элементов
    const is = startIdx % bigPerPage;
    const ie = endIdx % bigPerPage;
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log('args', pageNumber + 1, perPage);
    // console.log('idx', startIdx, endIdx, lastIdx);
    // console.log('is-ie', is, ie);
    // console.log('bigPage', bigStartPage, bigEndPage);
    // console.log('totalPages', totalPages);
    // Проверка условия надо ли подгружать ещё фильмов с API
    const twoPages = bigStartPage !== bigEndPage;
    const data = {
      results: startData.results.slice(is, twoPages ? bigPerPage : ie + 1), // обьект результатов
      total_pages: totalPages,
    };
    // Если надо подгружать фильмы, второй фетч-запрос и добавление результатов в массив
    if (twoPages) {
      const endData = await fetchMovies(bigEndPage + 1);
      data.results.push(...endData.results.slice(0, ie + 1));
    }

    return data;
  },
};
Api.calculatePosterImgSize();

export { Api };
