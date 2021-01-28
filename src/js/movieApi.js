console.log('hello i am API');
console.log('apiKey', API_KEY);

import axios from 'axios';
import { API_KEY } from './apiKey.js';

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
    defaultBackdropImg: '',
    defaultPosterImg: '',
    currentSizes: {
      backdropSize: '',
      posterSize: '',
    },
    backdropSizes: {
      mobile: 'w780',
      tablet: 'w780',
      desktop: 'w780',
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
  //   get imageBackdropSize() {
  //     return this.images.currentSizes.backdropSize;
  //   },
  //   get imagePosterSize() {
  //     return this.images.currentSizes.posterSize;
  //   },
  //   calculateBackdropImgSize() {
  //     if (window.visualViewport.width >= 1024) {
  //       this.images.currentSizes.backdropSize = this.images.backdropSizes.desktop;
  //       this.images.defaultBackdropImg = './images/default/backdrop-desktop.jpg';
  //       return;
  //     }
  //     if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
  //       this.images.currentSizes.backdropSize = this.images.backdropSizes.tablet;
  //       this.images.defaultBackdropImg = './images/default/backdrop-tablet.jpg';
  //       return;
  //     }
  //     if (window.visualViewport.width < 768) {
  //       this.images.currentSizes.backdropSize = this.images.backdropSizes.mobile;
  //       this.images.defaultBackdropImg = './images/default/backdrop-mobile.jpg';
  //       return;
  //     }
  //   },
  //   calculatePosterImgSize() {
  //     if (window.visualViewport.width >= 1024) {
  //       this.images.currentSizes.posterSize = this.images.posterSizes.desktop;
  //       this.images.defaultPosterImg = './images/default/poster-desktop.jpg';
  //     }
  //     if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
  //       this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
  //       this.images.defaultPosterImg = './images/default/poster-tablet.jpg';
  //     }
  //     if (window.visualViewport.width < 768) {
  //       this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
  //       this.images.defaultPosterImg = './images/default/poster-mobile.jpg';
  //     }
  //   },
  async fetchTrendingMoviesList() {
    const { data } = await axios.get(
      `/trending/all/week?api_key=${API_KEY}&language=en-US&page=${this.pageNumber}`,
    );
    this.totalPages = data.total_pages;
    const respArr = await data.results;
    return respArr;
  },
  async fetchSearchMovieList(query) {
    // spinner.show();
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
    //   .finally(() => {
    //     spinner.hide();
    //   });
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
    //   if (data.success == false) {
    //       const { data } = await axios.get(`${this.baseUrl}tv/${this.filmID}/videos?api_key=${this.apiKey}&language=en-US`);
    //       console.log('TV',data);
    //   };
    //   .then(resp => {
    //     if (resp.success == false) {
    //       return fetch(`${this.baseUrl}tv/${this.filmID}/videos?api_key=${this.apiKey}&language=en-US`)
    //         .then(res => res.json()).then(resp => {
    //           console.log(resp);
    //           return resp
    //         })
    //     };
    //     return resp
    //   })
  },
  async fetchGenresList() {
    const { data } = await axios.get(
      `/genre/movie/list?api_key=${this.apiKey}`,
    );
    return data.genres;
  },
};

//////////////////////////
// Функция, которая рендерит (вставляет в DOM) всю страницу галереи. Принимает фрагмент и ссылку, куда надо вставить фрагмент.
// function renderGallery(fragment, place) {
//   //   clearGallery(galleryList);

//   place.appendChild(fragment);
// }

// Функция, которая создает фрагмент со всеми карточками галереи. Принимает массив объектов фильмов.
// function createGalleryFragment(movies) {
//   const galleryFragment = document.createDocumentFragment();

//   movies.forEach(movie => {
//     const galleryItem = galleryElementTemplate(movie);
//     galleryFragment.appendChild(galleryItem);
//   });

//   return galleryFragment;
// }

// function clearGallery(galleryList) {
//   galleryList.innerHTML = '';
// }

Api.fetchTrendingMoviesList().then(movies => {
  const galleryListMarkup = galleryElementTemplate(movies);

  //galleryList.insertAdjacentHTML('beforeend', galleryListMarkup);
});
