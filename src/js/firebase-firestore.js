// Imports of firestore services and variables
import { db } from './firebase-init';

// Imports of handlebars function to render gallery card
import libraryGalleryElementTemplate from '../templates/10libraryGalleryElement.hbs';

// Getting references to Buttons in details modal
const watchedBtnRef = document.querySelector('.watched-btn__js');
const queueBtnRef = document.querySelector('.queue-btn__js');
const favoriteBtnRef = document.querySelector('.favorite-btn__js');
const buddyBtnRef = document.querySelector('.buddy-btn__js');
// Getting references to icons in Buttions in details modal
const watchedBtnIconRef = document.querySelector('.watched-btn-icon__js');
const queueBtnIconRef = document.querySelector('.queue-btn-icon__js');
const favoriteBtnIconRef = document.querySelector('.favorite-btn-icon__js');

// Getting references to Library galleries
const watchedGalleryRef = document.querySelector('.watched-gallery__js');
const queueGalleryRef = document.querySelector('.queue-gallery__js');
const favoriteGalleryRef = document.querySelector('.favorite-gallery__js');

// Getting references to gallery messages
const watchedMessageRef = document.querySelector('.watched-message__js');
const queueMessageRef = document.querySelector('.queue-message__js');
const favoriteMessageRef = document.querySelector('.favorite-message__js');

// Function to manage collection in DB
async function manageCollection(e, currentMovieItem, user, collection, btnRef, btnIconRef) {
  e.preventDefault();

  if (btnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .then(() => {
        updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, btnIconRef);
      })
      .catch(error => console.log(error.message));

    db.doc(`users/${user.uid}/library/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
      .delete()
      .then(() => {
        updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, btnIconRef);
      });

    // Condition to remove movie from a library
    const movieInWatchedRef = db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`);
    const movieInWatched = await movieInWatchedRef.get();
    const movieInQueueRef = db.doc(`users/${user.uid}/queue/${currentMovieItem.id}`);
    const movieInQueue = await movieInQueueRef.get();
    const movieInFavoriteRef = db.doc(`users/${user.uid}/favorite/${currentMovieItem.id}`);
    const movieInFavorite = await movieInFavoriteRef.get();

    if (!movieInWatched.exists && !movieInQueue.exists && !movieInFavorite.exists) {
      db.doc(`users/${user.uid}/library/${currentMovieItem.id}`).delete();
    }
  }
}

// Function to set library buttons UI
function updateCollectionManagementdBtn(user, collection, currentMovieItem, btnRef, btnIconRef) {
  if (!user) {
    return;
  }

  db.doc(`users/${user.uid}/${collection}/${currentMovieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        btnRef.dataset.status = 'remove';
        btnIconRef.textContent = 'remove_circle';
      } else {
        btnRef.dataset.status = 'add';
        btnIconRef.textContent = 'add_circle';
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
  buddyBtnRef,
  watchedBtnIconRef,
  queueBtnIconRef,
  favoriteBtnIconRef,
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
};
