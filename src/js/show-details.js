// Imports of firestore services, template, and variables
import { auth, db } from './firebase-init';
import { currentMoviesList } from './input.js';
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
import { Api } from './movieApi.js';

// Getting access to DOM elements
const homeGalleryRef = document.querySelector('.home-gallery__js');
const innerModalRef = document.querySelector('.test-drive_js');

// Global lonely variable, but super important one :)
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

  const trailerKey = await Api.fetchTrailersAPI(currentMovieItem.id).catch(error => {
    // console.log(currentMovieItem);
    // console.error("Error: ", error);
  });
  if (!trailerKey) {
    currentMovieItem['trailer_key'] = '';
  } else {
    currentMovieItem['trailer_key'] = trailerKey.key;
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
