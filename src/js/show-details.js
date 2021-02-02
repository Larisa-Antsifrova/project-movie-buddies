// Imports of firestore services, template, and variables
import { auth, db } from './firebase-init';
import { currentMoviesList } from './fetch-functions.js';
import detailTemplate from '../templates/4details.hbs';
import {
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  watchedBtnIconRef,
  queueBtnIconRef,
  favoriteBtnIconRef,
  watchedGalleryRef,
  queueGalleryRef,
  favoriteGalleryRef,
  updateCollectionManagementdBtn,
} from './firebase-firestore.js';

//Getting access to DOM elements
const homeGalleryRef = document.querySelector('.home-gallery__js');
const innerModalRef = document.querySelector('.test-drive_js');

//Global lonely variable, but super important one :)
let currentMovieItem = {};

// Adding event listeners
homeGalleryRef.addEventListener('click', onDetailsModalOpen);
watchedGalleryRef.addEventListener('click', onDetailsModalOpen);
queueGalleryRef.addEventListener('click', onDetailsModalOpen);
favoriteGalleryRef.addEventListener('click', onDetailsModalOpen);

// Function to carry out open modal scenario
async function onDetailsModalOpen(e) {
  if (e.target.nodeName === 'UL') {
    return;
  }

  const user = auth.currentUser;
  const id = +e.target.parentElement.dataset.id;

  currentMovieItem = await getCurrentMovieItem(e, user, id);

  if (!currentMovieItem) {
    return;
  }

  // updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, btnIconRef);
  updateCollectionManagementdBtn(user, 'watched', currentMovieItem, watchedBtnRef, watchedBtnIconRef);
  updateCollectionManagementdBtn(user, 'queue', currentMovieItem, queueBtnRef, queueBtnIconRef);
  updateCollectionManagementdBtn(user, 'favorite', currentMovieItem, favoriteBtnRef, favoriteBtnIconRef);

  showDetails(e, currentMovieItem);
}

// Function to render movie details in details modal
async function showDetails(e, currentMovieItem) {
  e.preventDefault();

  if (e.target.parentElement.nodeName !== 'A' && e.target.parentElement.nodeName !== 'LI') {
    return;
  }

  innerModalRef.innerHTML = '';
  const modalMarkup = detailTemplate(currentMovieItem);
  innerModalRef.insertAdjacentHTML('afterbegin', modalMarkup);
}

// Funtion to get the current movie selected for review
async function getCurrentMovieItem(e, user, id) {
  if (e.currentTarget.classList.contains('home-gallery__js')) {
    let movieList = await currentMoviesList;
    currentMovieItem = movieList.find(el => el.id === id);
    return currentMovieItem;
  } else {
    currentMovieItem =
      (await db
        .doc(`users/${user.uid}/watched/${id}`)
        .get()
        .then(doc => doc.data())) ||
      (await db
        .doc(`users/${user.uid}/queue/${id}`)
        .get()
        .then(doc => doc.data())) ||
      (await db
        .doc(`users/${user.uid}/favorite/${id}`)
        .get()
        .then(doc => doc.data()));
    return currentMovieItem;
  }
}

export { currentMovieItem, innerModalRef };

// Закомментированные ранее отрывки кода
// import * as Handlebars from 'handlebars/runtime';
// const sectionDetails = document.querySelector('.details__js'); // доступ к секции с деталями в html
// const titleFilmRef = document.querySelector('.title-film__js');
// const overviewRef = document.querySelector('.overview__js');
// const popularityRef = document.querySelector('.popularity__js');
// const releaseDateRef = document.querySelector('.release-date__js');
// const voteRef = document.querySelector('.vote__js');
// const votesRef = document.querySelector('.votes__js');
// const originalTitleRef = document.querySelector('.original-title__js');
// const modalContent = document.querySelector('.modal-content__js');
// const detailsModalRef = document.querySelector('#details-modal'); //доступ к модалке

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
