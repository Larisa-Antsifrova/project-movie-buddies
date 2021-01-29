import { currentMovieItem, currentMoviesList, genres } from './movieApi.js';
// console.log(currentMovieItem, currentMoviesList, genres);
const homeGalleryRef = document.querySelector('.home__js');
const titleFilmRef = document.querySelector('.title-film__js');
// console.log(titleFilmRef);

homeGalleryRef.addEventListener('click', e => {
  showDetails(e);
});

async function showDetails(e) {
  const id = +e.target.dataset.id;

  let movieList = await currentMoviesList;
  let currentMovieItem = movieList.find(el => el.id === id);
  let movieTitle = await currentMovieItem.title || currentMovieItem.name;
  console.log(currentMovieItem);

  titleFilmRef.textContent = movieTitle;
}

export { showDetails };
