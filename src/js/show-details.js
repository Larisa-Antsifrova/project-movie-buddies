import { currentMoviesList, genres } from './fetch-functions.js';
import { auth } from './firebase-init';
import * as Handlebars from 'handlebars/runtime';
import detailTemplate from '../templates/4details.hbs';
import {
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  watchedGalleryRef,
  queueGalleryRef,
  favoriteGalleryRef,
  watchedMessageRef,
  queueMessageRef,
  favoriteMessageRef,
  manageCollection,
  updateCollectionManagementdBtn,
  updateLibraryCollection,
  updateLibraryMessage,
  updateFavoriteCollectionBtn,
} from './firebase-firestore.js';

// Handlebars.registerHelper('getMovieYear', function (release_date) {
//   if (!release_date) {
//     return;
//   }
//   var movieYear = release_date.slice(0, 4);
//   return movieYear;
// });

// Handlebars.registerHelper('getMovieDate', function (first_air_date) {
//     if (!first_air_date) {
//       return;
//     }
//     var movieDate = first_air_date.slice(0, 4);
//     return movieDate;
//   });

// Handlebars.registerHelper('roundUpPopularity', function (popularity) {
//   var roundValue = popularity;
//   return roundValue;
// });

let currentMovieItem = {};

const sectionDetails = document.querySelector('.details__js'); // доступ к секции с деталями в html
const homeGalleryRef = document.querySelector('.home-gallery-list__js'); //доступ к ul галлереи для слушателя модалки
const titleFilmRef = document.querySelector('.title-film__js');
const overviewRef = document.querySelector('.overview__js');
const popularityRef = document.querySelector('.popularity__js');
const releaseDateRef = document.querySelector('.release-date__js');
const voteRef = document.querySelector('.vote__js');
const votesRef = document.querySelector('.votes__js');
const originalTitleRef = document.querySelector('.original-title__js');
const modalContent = document.querySelector('.modal-content__js');

const detailsModalRef = document.querySelector('#details-modal'); //доступ к модалке
const innterModalRef = document.querySelector('.test-drive_js');

// Adding event listeners
homeGalleryRef.addEventListener('click', onDetailsModalOpen);

async function onDetailsModalOpen(e) {
  const user = auth.currentUser;
  currentMovieItem = await getCurrentMovieItem(e);

  updateCollectionManagementdBtn(user, 'watched', currentMovieItem, watchedBtnRef, 'watched', e);
  updateCollectionManagementdBtn(user, 'queue', currentMovieItem, queueBtnRef, 'queue', e);
  updateFavoriteCollectionBtn(user, 'favorite', currentMovieItem, favoriteBtnRef, 'favorite', e);
  showDetails(e);
}

function showDetails(e) {
  e.preventDefault();

  // if (e.target.nodeName !== 'A') {
  //   return;
  // }

  const id = +e.target.dataset.id;

  currentMoviesList
    .then(movies => {
      console.log(movies);
      return movies.find(el => el.id === id);
    })
    .then(el => {
      innterModalRef.innerHTML = '';
      const modalMarkup = detailTemplate(el);
      innterModalRef.insertAdjacentHTML('afterbegin', modalMarkup);
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

async function getCurrentMovieItem(e) {
  const id = +e.target.dataset.id;

  let movieList = await currentMoviesList;
  let currentMovieItem = movieList.find(el => el.id === id);

  return currentMovieItem;
}

export { currentMovieItem };
