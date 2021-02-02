// Imports of firestore services and variables
import { db } from './firebase-init';

// Imports of handlebars function to render gallery card
import libraryGalleryElementTemplate from '../templates/10libraryGalleryElement.hbs';

// Getting references to Buttons in details modal
const watchedBtnRef = document.querySelector('.watched-btn__js');
const queueBtnRef = document.querySelector('.queue-btn__js');
const favoriteBtnRef = document.querySelector('.favorite-btn__js');

// Getting references to Library galleries
const watchedGalleryRef = document.querySelector('.watched-gallery__js');
const queueGalleryRef = document.querySelector('.queue-gallery__js');
const favoriteGalleryRef = document.querySelector('.favorite-gallery__js');

// Getting references to gallery messages
const watchedMessageRef = document.querySelector('.watched-message__js');
const queueMessageRef = document.querySelector('.queue-message__js');
const favoriteMessageRef = document.querySelector('.favorite-message__js');

// Function to manage collection in DB
function manageCollection(e, currentMovieItem, user, btnRef, collection, text) {
  e.preventDefault();
  if (btnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .then(() => {
        updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, text, e);
        console.log(`Movie is added to ${collection}!`);
      })
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
      .delete()
      .then(() => {
        updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, text, e);
        console.log(`Movie is deleted from ${collection}!`);
      });
  }
}

// Function to set library buttons UI
function updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, text, e) {
  if (!user) {
    return;
  }
  db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        if (e.target.classList.contains('favorite-btn__js') || e.target.classList.contains('favorite-icon__js')) {
          console.log(`I am existing movie in ${collection}`);
          btnRef.dataset.status = 'remove';
          const favoriteBtnIcon = document.querySelector('.favorite-icon__js');
          favoriteBtnIcon.textContent = 'favorite';
        } else {
          console.log(`I am existing movie in ${collection}`);
          btnRef.dataset.status = 'remove';
          btnRef.textContent = `Remove from ${text}`;
        }
      } else {
        if (e.target.classList.contains('favorite-btn__js') || e.target.classList.contains('favorite-icon__js')) {
          console.log(`I am NOT existing movie in ${collection}`);
          btnRef.dataset.status = 'add';
          const favoriteBtnIcon = document.querySelector('.favorite-icon__js');
          favoriteBtnIcon.textContent = 'favorite_border';
        } else {
          console.log(`I am NOT existing movie in ${collection}`);
          btnRef.dataset.status = 'add';
          btnRef.textContent = `Add to ${text}`;
        }
      }
    });
}

function updateFavoriteCollectionBtn(user, collection, currentMovieItem, btnRef, text, e) {
  if (!user) {
    return;
  }
  db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        console.log(`I am existing movie in ${collection}`);
        btnRef.dataset.status = 'remove';
        const favoriteBtnIcon = document.querySelector('.favorite-icon__js');
        favoriteBtnIcon.textContent = 'favorite';
      } else {
        console.log(`I am NOT existing movie in ${collection}`);
        btnRef.dataset.status = 'add';
        const favoriteBtnIcon = document.querySelector('.favorite-icon__js');
        favoriteBtnIcon.textContent = 'favorite_border';
      }
    });
}

function updateLibraryCollection(changes, libraryGalleryRef) {
  changes.forEach(change => {
    if (change.type === 'added') {
      const galleryItem = libraryGalleryElementTemplate(change.doc.data());
      libraryGalleryRef.insertAdjacentHTML('afterbegin', galleryItem);
    } else if (change.type === 'removed') {
      let li = libraryGalleryRef.querySelector(`[data-id="${change.doc.id}"]`);
      libraryGalleryRef.removeChild(li);
    }
  });
}

function updateLibraryMessage(collectionRef, messageRef) {
  collectionRef.get().then(snapshot => {
    if (!snapshot.empty) {
      messageRef.style.display = 'none';
    } else {
      messageRef.style.display = 'block';
    }
  });
}

export {
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
  updateFavoriteCollectionBtn,
  updateLibraryCollection,
  updateLibraryMessage,
};
