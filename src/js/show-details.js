import { auth, db } from './firebase-init';
import { currentMoviesList } from './fetch-functions.js';
import * as Handlebars from 'handlebars/runtime';
import detailTemplate from '../templates/4details.hbs';
import {
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  watchedGalleryRef,
  queueGalleryRef,
  favoriteGalleryRef,
  manageCollection,
  updateCollectionManagementdBtn,
  updateFavoriteCollectionBtn,
  updateLibraryCollection,
  updateLibraryMessage,
} from './firebase-firestore.js';

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
const innerModalRef = document.querySelector('.test-drive_js');

// Adding event listeners
homeGalleryRef.addEventListener('click', onDetailsModalOpen);
watchedGalleryRef.addEventListener('click', onDetailsModalOpen);
queueGalleryRef.addEventListener('click', onDetailsModalOpen);
favoriteGalleryRef.addEventListener('click', onDetailsModalOpen);

async function onDetailsModalOpen(e) {
  if (e.target.nodeName === 'UL') {
    return;
  }

  const currentEventTarget = e.currentTarget;
  const user = auth.currentUser;
  const id = +e.target.parentElement.dataset.id;

  currentMovieItem = await getCurrentMovieItem(e, user, currentEventTarget, id);

  if (!currentMovieItem) {
    return;
  }

  updateCollectionManagementdBtn(user, 'watched', currentMovieItem, watchedBtnRef, 'watched', e);
  updateCollectionManagementdBtn(user, 'queue', currentMovieItem, queueBtnRef, 'queue', e);
  updateFavoriteCollectionBtn(user, 'favorite', currentMovieItem, favoriteBtnRef, 'favorite', e);

  showDetails(e, user, currentMovieItem, currentEventTarget, id);
}

async function showDetails(e, user, currentMovieItem, currentEventTarget, id) {
  e.preventDefault();

  if (e.target.parentElement.nodeName !== 'A') {
    return;
  }

  if (currentEventTarget.classList.contains('home-gallery-list__js')) {
    innerModalRef.innerHTML = '';
    const modalMarkup = detailTemplate(currentMovieItem);
    innerModalRef.insertAdjacentHTML('afterbegin', modalMarkup);
    return;
  }

  if (currentEventTarget.classList.contains('watched-gallery__js')) {
    showLibraryMovieDetails(user, 'watched', id);
    return;
  }

  if (e.currentTarget.classList.contains('queue-gallery__js')) {
    showLibraryMovieDetails(user, 'queue', id);
    return;
  }
  if (e.currentTarget.classList.contains('favorite-gallery__js')) {
    showLibraryMovieDetails(user, 'favorite', id);
    return;
  }
}

async function getCurrentMovieItem(e, user, currentEventTarget, id) {
  if (currentEventTarget.classList.contains('home-gallery-list__js')) {
    let movieList = await currentMoviesList;
    currentMovieItem = movieList.find(el => el.id === id);
    return currentMovieItem;
  }

  if (currentEventTarget.classList.contains('watched-gallery__js')) {
    currentMovieItem = await db
      .doc(`users/${user.uid}/watched/${id}`)
      .get()
      .then(doc => doc.data());
    return currentMovieItem;
  }

  if (currentEventTarget.classList.contains('queue-gallery__js')) {
    currentMovieItem = await db
      .doc(`users/${user.uid}/queue/${id}`)
      .get()
      .then(doc => doc.data());
    return currentMovieItem;
  }

  if (currentEventTarget.classList.contains('favorite-gallery__js')) {
    currentMovieItem = await db
      .doc(`users/${user.uid}/favorite/${id}`)
      .get()
      .then(doc => doc.data());
    return currentMovieItem;
  }
}

function showLibraryMovieDetails(user, libraryCollection, id) {
  db.doc(`users/${user.uid}/${libraryCollection}/${id}`)
    .get()
    .then(doc => doc.data())
    .then(movie => {
      innerModalRef.innerHTML = '';
      const modalMarkup = detailTemplate(movie);
      innerModalRef.insertAdjacentHTML('afterbegin', modalMarkup);
    });
}

export { currentMovieItem, innerModalRef };

// Закомментированные ранее отрывки кода
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
