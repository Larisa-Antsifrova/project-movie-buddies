import { currentMoviesList, genres } from './movieApi.js';
import {
  updateWatchedBtn,
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  manageWatched,
} from './firebase-firestore.js';
let currentMovieItem = {};
// console.log(currentMovieItem, currentMoviesList, genres);
const homeGalleryRef = document.querySelector('.home__js');
const titleFilmRef = document.querySelector('.title-film__js');
console.log(titleFilmRef);

homeGalleryRef.addEventListener('click', async e => {
  currentMovieItem = await getCurrentMovieItem(e);
  console.log(currentMovieItem);
  let currentMovieItemId = currentMovieItem.id;
  showDetails(e);
  console.log('current ID from event listeren', currentMovieItemId);

  updateWatchedBtn(currentMovieItem);
  watchedBtnRef.addEventListener('click', e => manageWatched(currentMovieItem));
  queueBtnRef.addEventListener('click', e => manageQueue(currentMovieItem));
  favoriteBtnRef.addEventListener('click', e =>
    manageFavorite(currentMovieItem),
  );
});

async function showDetails(e) {
  const id = +e.target.dataset.id;

  let movieList = await currentMoviesList;
  let currentMovieItem = movieList.find(el => el.id === id);
  let movieTitle = (await currentMovieItem.title) || currentMovieItem.name;
  console.log(currentMovieItem);

  titleFilmRef.textContent = movieTitle;
}

export { showDetails };

async function getCurrentMovieItem(e) {
  const id = +e.target.dataset.id;

  let movieList = await currentMoviesList;
  let currentMovieItem = movieList.find(el => el.id === id);

  return currentMovieItem;
}
