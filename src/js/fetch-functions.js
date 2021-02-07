import { Api } from './movieApi';
import * as Handlebars from 'handlebars/runtime';
import galleryElementTemplate from '../templates/8galleryElement.hbs';
import { input } from './input';

const searchForm = document.querySelector('.search-form');
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const switchRef = document.querySelector('.media-switch');
const genres = Api.fetchGenresList(); // содержит промис с массивом объектов жанров

switchRef.addEventListener('change', toggleMediaType);
searchForm.addEventListener('click', () => { input.onInputFocus() });
searchForm.addEventListener('submit', (e)=>{input.searchFilms(e)});


// Функция для отрисовки списка популярных фильмов
function createMovieList(fullInfo) {
  const galleryListMarkup = galleryElementTemplate(fullInfo);
  homeGalleryListRef.insertAdjacentHTML('afterbegin', galleryListMarkup);
}

// Функция для добавления декодированных жанров в обьект фильмов
async function combineFullMovieInfo(moviesList) {
  const moviesFullInfo = await moviesList;
  const genres_info = await getGenresInfo(moviesList);
  const fullInfo = await moviesFullInfo.map((movie, ind) => {
    movie['genres_name'] = genres_info[ind];
    return movie;
  });
  return fullInfo;
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

function toggleMediaType(e) {
  if (!e.target.checked) {
    Api.mediaType = 'movie';
  } else {
    Api.mediaType = 'tv';
  }
  input.toggleRenderPage();
}

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
    const defaultImgUrl = `https://cdn.pixabay.com/photo/2015/09/09/17/51/film-932154_960_720.jpg`;
    return defaultImgUrl;
  } else {
    const imgUrl = `${Api.images.baseImageUrl}${Api.images.currentSizes.posterSize}/${poster_path}`;
    return imgUrl;
  }
});

export { genres, combineFullMovieInfo, createMovieList };
