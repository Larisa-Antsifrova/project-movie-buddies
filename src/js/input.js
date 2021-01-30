import api from './movieApi.js';
let { Api, getRealiseData, currentMoviesList } = api;

const searchForm = document.querySelector('#search-form');
const homeGalleryRef = document.querySelector('.home-gallery-list__js');
const errorArea = document.querySelector('.search-error__js');

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
  getRealiseData(currentMoviesList);
};

// функция рендера страницы трендов
function renderPopularFilms() {
  currentMoviesList = Api.fetchTrendingMoviesList();
  getRealiseData(currentMoviesList);
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

//   return renderPopularFilms().then(() => {
//     // paginator.recalculate(Api.totalPages);
//   });
// }

function clearError() {
  errorArea.style.visibility = 'hidden';
}

export { notFound };