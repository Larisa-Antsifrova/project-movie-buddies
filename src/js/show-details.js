import { currentMovieItem, currentMoviesList, genres } from './movieApi.js';
import * as Handlebars from 'handlebars/runtime';
import detailTemplate from '../templates/4details.hbs';

Handlebars.registerHelper('getMovieYear', function (release_date) {
  var movieYear = release_date.slice(0, 4);
  return movieYear;
});

Handlebars.registerHelper('roundUpPopularity', function (number) {
  console.log(typeof number);
  return number.toFixed(1);
});

// console.log(detailFilmTemplate);

const sectionDetails = document.querySelector('.details__js'); // доступ к секции с деталями в html
const homeGalleryRef = document.querySelector('.home__js');
const titleFilmRef = document.querySelector('.title-film__js');
const overviewRef = document.querySelector('.overview__js');
const popularityRef = document.querySelector('.popularity__js');
const releaseDateRef = document.querySelector('.release-date__js');
const voteRef = document.querySelector('.vote__js');
const votesRef = document.querySelector('.votes__js');
const originalTitleRef = document.querySelector('.original-title__js');

homeGalleryRef.addEventListener('click', e => {
  console.log('Hello, I am event');
  if (e.target.nodeName !== 'A') {
    return;
  }
  console.log(e);
  showDetails(e);
});

function showDetails(e) {
  console.log('hello');
  const id = +e.target.dataset.id;
  // console.log(currentMoviesList);
  currentMoviesList
    .then(movies => {
      console.log(movies);
      movies.find(el => el.id === id);
      return el;
    })
    .then(film => {
      console.log(film);
      const modalMarkup = detailTemplate(film);
      sectionDetails.insertAdjacentHTML('afterbegin', modalMarkup);
    });
}

// async function showDetails(e) {
//   const id = +e.target.dataset.id;

//   let movieList = await currentMoviesList;
//   let currentMovieItem = movieList.find(el => el.id === id);
//   let movieTitle = (await currentMovieItem.title) || currentMovieItem.name;
//   let movieOverview = await currentMovieItem.overview;
//   let moviePopularity = await currentMovieItem.popularity;
//   let movieReleaseDate =
//     (await currentMovieItem.release_date) || currentMovieItem.first_air_date;
//   let movieVote = await currentMovieItem.vote_average;
//   let movieVotes = await currentMovieItem.vote_count;
//   let movieOriginalTitle =
//     (await currentMovieItem.original_name) || currentMovieItem.original_title;
//   // console.log(currentMovieItem);

//   titleFilmRef.textContent = movieTitle;
//   overviewRef.textContent = movieOverview;
//   popularityRef.textContent = moviePopularity.toFixed(1);
//   releaseDateRef.textContent = movieReleaseDate;
//   voteRef.textContent = movieVote;
//   votesRef.textContent = movieVotes;
//   originalTitleRef.textContent = movieOriginalTitle;
// }

export { showDetails };
