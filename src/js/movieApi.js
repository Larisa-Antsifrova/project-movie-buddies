import axios from 'axios';
import { API_KEY } from './apiKey.js';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import paginationTemplate from '../templates/8pagination.hbs';
import * as Handlebars from 'handlebars/runtime';

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
    // console.log(this.totalPages, 'this.totalPages');
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
          // console.log('trailer', e);
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
const homeGalleryListRef = document.querySelector('.home-gallery-list__js');
const errorArea = document.querySelector('.search-error__js');

// ============================ function rendering ==============================
// Функция для добавления декодированных жанров в обьект фильмов
async function combineFullMovieInfo(moviesList) {
  const moviesFullInfo = await moviesList;
  const genres_info = await getGenresInfo(moviesList);
  const fullInfo = await moviesFullInfo.map((movie, ind) => {
    movie['genres_name'] = genres_info[ind];

    return movie;
  });

  // console.log(fullInfo);
  return fullInfo;
}

// Функция для отрисовки списка популярных фильмов
function createMovieList(fullInfo) {
  const galleryListMarkup = galleryElementTemplate(fullInfo);
  homeGalleryListRef.insertAdjacentHTML('afterbegin', galleryListMarkup);
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
    const defaultImgUrl = `${Api.images.baseImageUrl}${Api.images.currentSizes.posterSize}/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`;
    return defaultImgUrl;
  } else {
    const imgUrl = `${Api.images.baseImageUrl}${Api.images.currentSizes.posterSize}/${poster_path}`;
    return imgUrl;
  }
});

// ==================================== input ===============================================================
searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

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
  currentMoviesList = Api.fetchSearchMovieList(inputValue);
  return combineFullMovieInfo(currentMoviesList)
    .then(createMovieList)
    .then(() => {
      paginator.recalculate(Api.pageNumber || 1, Api.totalPages || 1);
    });
}

// функция рендера страницы трендов
function renderPopularFilms() {
  currentMoviesList = Api.fetchTrendingMoviesList();
  return combineFullMovieInfo(currentMoviesList)
    .then(createMovieList)
    .then(() => {
      paginator.recalculate(Api.pageNumber, Api.totalPages);
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

// ======================== paginator ========================
// class PaginationApi {
//   constructor(totalPages = 1, displayNumber = 5) {
//     this.paginationContainerRef = document.querySelector(
//       '.pagination-container',
//     );
//     this.paginationPageItemsContainerRef = document.querySelector(
//       '.pagination-page-items-container',
//     );

//     this.paginationToBeginningBtnRef = document.querySelector(
//       '.pagination-beginning',
//     );
//     this.paginationToBeginningIconRef = this.paginationToBeginningBtnRef.querySelector(
//       'i',
//     );
//     this.paginationPreviousPageRef = document.querySelector(
//       '.pagination-previous-page',
//     );
//     this.paginationPreviousPageIconRef = this.paginationPreviousPageRef.querySelector(
//       'i',
//     );

//     this.paginationToEndBtnRef = document.querySelector('.pagination-end');
//     this.paginationToEndIconRef = this.paginationToEndBtnRef.querySelector('i');
//     this.paginationNextPageRef = document.querySelector(
//       '.pagination-next-page',
//     );
//     this.paginationNextPageIconRef = this.paginationNextPageRef.querySelector(
//       'i',
//     );

//     this.totalPages = totalPages;
//     this.displayNumber = displayNumber;
//     this.lowRange = 1;
//     this.upRange =
//       this.totalPages > this.displayNumber
//         ? this.lowRange + this.displayNumber - 1
//         : this.totalPages;
//     this.totalPaginationBatches = Math.ceil(
//       this.totalPages / this.displayNumber,
//     );
//     this.currentPaginationBatch = 1;
//     this.isLastPaginationBatch = false;
//     this.isFirstPaginationBatch = true;
//     this.currentActivePage = null;

//     this.paginationContainerRef.addEventListener(
//       'click',
//       this.onPaginationClick.bind(this),
//     );
//   }

//   clearPaginationPageItems() {
//     this.paginationPageItemsContainerRef.innerHTML = '';
//   }

//   createPaginationPageItemsMarkup() {
//     let paginationPageItemsMarkup = '';
//     for (let i = this.lowRange; i <= this.upRange; i++) {
//       paginationPageItemsMarkup += `<li class="waves-effect" data-page ='${i}'>
//               <a href="#!" class="paginator-page-item" data-page ='${i}'>${i}</a>
//             </li>`;
//     }
//     return paginationPageItemsMarkup;
//   }

//   renderPaginationPageItems() {
//     const paginationPageItemsMarkup = this.createPaginationPageItemsMarkup();
//     this.paginationPageItemsContainerRef.insertAdjacentHTML(
//       'afterbegin',
//       paginationPageItemsMarkup,
//     );

//     const totalPageItems = this.paginationPageItemsContainerRef.querySelectorAll(
//       'li',
//     );

//     if (totalPageItems.length === 1) {
//       this.disableToBeginningBtn();
//       this.disablePreviousPageBtn();
//       this.disableToEndBtn();
//       this.disableNextPageBtn();
//       this.assignCurrentActivePage();
//       return;
//     }

//     if (Api.pageNumber === 1) {
//       this.disableToBeginningBtn();
//       this.disablePreviousPageBtn();

//       this.enableToEndBtn();
//       this.enableNextPageBtn();
//     }

//     if (Api.pageNumber === this.totalPages) {
//       this.disableToEndBtn();
//       this.disableNextPageBtn();

//       this.enableToBeginningBtn();
//       this.enablePreviousPageBtn();
//     }

//     this.assignCurrentActivePage();
//   }

//   disableToEndBtn() {
//     this.paginationToEndBtnRef.classList.add('disabled');
//     this.paginationToEndIconRef.setAttribute('disabled', true);
//   }
//   enableToEndBtn() {
//     this.paginationToEndBtnRef.classList.remove('disabled');
//     this.paginationToEndIconRef.removeAttribute('disabled');
//   }
//   disableNextPageBtn() {
//     this.paginationNextPageRef.classList.add('disabled');
//     this.paginationNextPageIconRef.setAttribute('disabled', true);
//   }
//   enableNextPageBtn() {
//     this.paginationNextPageRef.classList.remove('disabled');
//     this.paginationNextPageIconRef.removeAttribute('disabled');
//   }
//   disableToBeginningBtn() {
//     this.paginationToBeginningBtnRef.classList.add('disabled');
//     this.paginationToBeginningIconRef.setAttribute('disabled', true);
//   }
//   enableToBeginningBtn() {
//     this.paginationToBeginningBtnRef.classList.remove('disabled');
//     this.paginationToBeginningIconRef.removeAttribute('disabled');
//   }
//   disablePreviousPageBtn() {
//     this.paginationPreviousPageRef.classList.add('disabled');
//     this.paginationPreviousPageIconRef.setAttribute('disabled', true);
//   }
//   enablePreviousPageBtn() {
//     this.paginationPreviousPageRef.classList.remove('disabled');
//     this.paginationPreviousPageIconRef.removeAttribute('disabled');
//   }

//   assignCurrentActivePage() {
//     const paginationPageItems = this.paginationPageItemsContainerRef.querySelectorAll(
//       'li',
//     );
//     const liArr = Array.from(paginationPageItems);

//     const activeTarget = liArr.find(
//       node => +node.dataset.page === Api.pageNumber,
//     );

//     activeTarget.classList.add('active');
//     this.currentActivePage = activeTarget;
//   }

//   switchCurrentActivePage() {
//     const paginationPageItems = this.paginationPageItemsContainerRef.querySelectorAll(
//       'li',
//     );
//     const liArr = Array.from(paginationPageItems);
//     const activeTarget = liArr.find(
//       node => +node.dataset.page === Api.pageNumber,
//     );
//     this.currentActivePage.classList.remove('active');
//     activeTarget.classList.add('active');
//     this.currentActivePage = activeTarget;
//   }

//   goToBeginning() {
//     this.currentPaginationBatch = 1;
//     this.isFirstPaginationBatch = true;

//     Api.resetPage();

//     this.lowRange = 1;
//     this.upRange =
//       this.totalPages > this.displayNumber
//         ? this.lowRange + this.displayNumber - 1
//         : this.totalPages;

//     this.clearPaginationPageItems();
//     this.renderPaginationPageItems();

//     this.disableToBeginningBtn();
//     this.disablePreviousPageBtn();

//     this.enableToEndBtn();
//     this.enableNextPageBtn();

//     this.assignCurrentActivePage();
//   }

//   goToEnd() {
//     this.currentPaginationBatch = this.totalPaginationBatches;
//     this.isLastPaginationBatch = true;

//     Api.pageNumber = this.totalPages;
//     this.upRange = this.totalPages;
//     this.lowRange =
//       this.totalPages > this.displayNumber
//         ? this.upRange - this.displayNumber + 1
//         : 1;

//     this.clearPaginationPageItems();
//     this.renderPaginationPageItems();

//     this.disableToEndBtn();
//     this.disableNextPageBtn();

//     this.enableToBeginningBtn();
//     this.enablePreviousPageBtn();

//     this.assignCurrentActivePage();
//   }

//   goToNextPage() {
//     this.enableToBeginningBtn();
//     this.enablePreviousPageBtn();

//     Api.incrementPage();

//     if (Api.pageNumber > this.totalPages) {
//       Api.pageNumber = this.totalPages;
//       return;
//     }

//     if (Api.pageNumber === this.totalPages) {
//       this.disableToEndBtn();
//       this.disableNextPageBtn();
//     }

//     if (Api.pageNumber > this.upRange) {
//       this.currentPaginationBatch += 1;
//       this.isLastPaginationBatch =
//         this.currentPaginationBatch === this.totalPaginationBatches;

//       if (this.isLastPaginationBatch) {
//         this.upRange = this.totalPages;

//         this.lowRange =
//           this.totalPages > this.displayNumber
//             ? this.upRange - this.displayNumber + 1
//             : 1;

//         this.clearPaginationPageItems();
//         this.renderPaginationPageItems();

//         this.switchCurrentActivePage();

//         return;
//       }

//       this.lowRange = this.upRange + 1;
//       this.upRange =
//         this.totalPages > this.displayNumber * this.currentPaginationBatch
//           ? this.lowRange + this.displayNumber - 1
//           : this.totalPages;

//       this.clearPaginationPageItems();
//       this.renderPaginationPageItems();
//     }

//     this.switchCurrentActivePage();
//   }

//   goToPreviousPage() {
//     this.enableToEndBtn();
//     this.enableNextPageBtn();

//     Api.decrementPage();

//     if (Api.pageNumber < 1) {
//       Api.resetPage();
//       return;
//     }

//     if (Api.pageNumber === 1) {
//       this.disableToBeginningBtn();
//       this.disablePreviousPageBtn();
//     }

//     if (Api.pageNumber < this.lowRange) {
//       this.currentPaginationBatch -= 1;
//       this.isFirstPaginationBatch = this.currentPaginationBatch === 1;

//       if (this.isFirstPaginationBatch) {
//         this.lowRange = 1;
//         this.upRange =
//           this.totalPages > this.displayNumber
//             ? this.lowRange + this.displayNumber - 1
//             : this.totalPages;

//         this.clearPaginationPageItems();
//         this.renderPaginationPageItems();

//         this.assignCurrentActivePage();

//         return;
//       }

//       this.upRange = this.lowRange - 1;
//       this.lowRange = this.upRange - this.displayNumber + 1;

//       this.clearPaginationPageItems();
//       this.renderPaginationPageItems();
//     }

//     this.switchCurrentActivePage();
//   }

//   goToSelectedPage(e) {
//     Api.pageNumber = +e.target.dataset.page;

//     if (Api.pageNumber === 1) {
//       this.disableToBeginningBtn();
//       this.disablePreviousPageBtn();
//       this.enableToEndBtn();
//       this.enableNextPageBtn();
//     }

//     if (Api.pageNumber === this.totalPages) {
//       this.disableToEndBtn();
//       this.disableNextPageBtn();
//       this.enableToBeginningBtn();
//       this.enablePreviousPageBtn();
//     }

//     if (Api.pageNumber !== 1 && Api.pageNumber !== this.totalPages) {
//       this.enableToBeginningBtn();
//       this.enablePreviousPageBtn();
//       this.enableToEndBtn();
//       this.enableNextPageBtn();
//     }

//     this.switchCurrentActivePage();
//   }

//   onPaginationClick(e) {
//     if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
//       return;
//     }

//     if (e.target.hasAttribute('disabled')) {
//       return;
//     }

//     if (
//       e.target.nodeName === 'A' &&
//       e.target.classList.contains('paginator-page-item')
//     ) {
//       this.goToSelectedPage(e);
//       toggleRenderPage();
//       return;
//     }

//     if (e.target.textContent === 'first_page') {
//       this.goToBeginning();
//       toggleRenderPage();
//       return;
//     }

//     if (e.target.textContent === 'chevron_left') {
//       this.goToPreviousPage();
//       toggleRenderPage();
//       return;
//     }

//     if (e.target.textContent === 'last_page') {
//       this.goToEnd();
//       toggleRenderPage();
//       return;
//     }

//     if (e.target.textContent === 'chevron_right') {
//       this.goToNextPage();
//       toggleRenderPage();
//       return;
//     }
//   }

//   recalculate(newTotalPages) {
//     this.totalPages = newTotalPages;

//     this.lowRange = 1;
//     this.upRange =
//       this.totalPages > this.displayNumber
//         ? this.lowRange + this.displayNumber - 1
//         : this.totalPages;

//     this.totalPaginationBatches = Math.ceil(
//       this.totalPages / this.displayNumber,
//     );
//     this.isLastPaginationBatch = false;
//     this.isFirstPaginationBatch = true;

//     this.clearPaginationPageItems();
//     this.renderPaginationPageItems();
//   }
// }

class PaginationApi {
  constructor(maxPageRadius = 2) {
    this.refs = {
      pagination: document.querySelector('.pagination-container'),
    };
    this.currentPage = 1;
    this.totalPages = 0;
    this.maxPageRadius = maxPageRadius;

    this.refs.pagination.addEventListener(
      'click',
      this.onPaginationClick.bind(this),
    );
  }

  recalculate(currentPage, totalPages) {
    // console.log('Recalculating', currentPage, totalPages);

    this.currentPage = currentPage;
    this.totalPages = totalPages;

    Api.pageNumber = currentPage; // hack
    Api.totalPages = totalPages;

    const startPage = Math.max(
      1,
      Math.min(
        this.currentPage - this.maxPageRadius,
        this.totalPages - 2 * this.maxPageRadius,
      ),
    );
    const endPage = Math.min(
      this.totalPages,
      startPage + 2 * this.maxPageRadius,
    );
    let pages = [];
    for (let i = startPage; i <= endPage; ++i) {
      pages.push({ idx: i, active: i == this.currentPage ? 'active' : '' });
    }

    this.refs.pagination.innerHTML = paginationTemplate({
      left: this.currentPage === 1 ? 'disabled' : '',
      right: this.currentPage === this.totalPages ? 'disabled' : '',
      pages: pages,
    });
  }

  onPaginationClick(e) {
    // console.log(e.target);
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
      return;
    }

    if (e.target.hasAttribute('disabled')) {
      return;
    }

    if (
      e.target.nodeName === 'A' &&
      e.target.classList.contains('paginator-page-item')
    ) {
      Api.pageNumber = +e.target.dataset.page;
    }

    if (e.target.textContent === 'first_page') {
      Api.pageNumber = 1;
    }

    if (e.target.textContent === 'chevron_left' && Api.pageNumber !== 1) {
      Api.pageNumber -= 1;
    }

    if (e.target.textContent === 'last_page') {
      Api.pageNumber = this.totalPages;
    }

    if (
      e.target.textContent === 'chevron_right' &&
      Api.pageNumber !== Api.totalPages
    ) {
      Api.pageNumber += 1;
    }

    toggleRenderPage();
  }
}

// Инициализация пагинатора
const paginator = new PaginationApi();

// Вызов самого первого fetch за популярными фильмами и его рендер
renderPopularFilms();

// ==================================================
export { Api, currentMoviesList, currentMovieItem, genres };
