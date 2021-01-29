import Api from './movieApi.js';

const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// функция выбора отображения страницы в зависимости от наличия текстa в инпуте.
// Определяет, вызывается ли фетч популярных фильмов или запрос поиска
function toggleRenderPage() {
  if (!Api.searchQuery.length) {
    renderPopularFilms().then(() => {
      window.scrollTo({
        top: 100,
        left: 100,
        behavior: 'smooth',
      });
    });
    renderFilms = movieApi.fetchPopularFilmsList();
  } else {
    renderSearchedFilms(movieApi.searchQuery).then(() => {
      window.scrollTo({
        top: 100,
        left: 100,
        behavior: 'smooth',
      });
    });
    renderFilms = movieApi.fetchSearchFilmsList(movieApi.searchQuery);
  }
}

// функция для слушателя инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  movieApi.searchQuery = e.target.elements.query.value.trim();

  if (movieApi.searchQuery) {
    renderSearchedFilms(movieApi.searchQuery).then(() => {
      paginator.recalculate(movieApi.totalPages || 1);
    });
  }
  renderFilms = movieApi.fetchSearchFilmsList(movieApi.searchQuery);
}

// функция рендера страницы запроса
function renderSearchedFilms(inputValue) {
  return movieApi
    .fetchSearchFilmsList(inputValue)
    .then(createGalleryFragment)
    .then(fragment => renderGallery(fragment, homePageRef));
}

function renderPopularFilms() {
  return movieApi
    .fetchPopularFilmsList()
    .then(createGalleryFragment)
    .then(fragment => renderGallery(fragment, homePageRef));
}

// функция очистки инпута и параграфа ошибки при фокусе
function onInputFocus() {
  clearError();
  clearInput();
  movieApi.resetPage();
}

function clearInput() {
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
}

// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = 'visible';
  setTimeout(clearError, 2000);
  clearInput();
  movieApi.resetPage();

  return renderPopularFilms().then(() => {
    paginator.recalculate(movieApi.totalPages);
  });
}

function clearError() {
  errorArea.style.visibility = 'hidden';
}
