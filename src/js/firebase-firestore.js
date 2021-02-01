// Imports of firestore services and variables
import { db, auth } from './firebase-init';

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

// Function to set watched button UI
function updateWatchedBtn(currentMovieItem) {
  const user = auth.currentUser;

  db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        console.log('I am existing movie');
        watchedBtnRef.dataset.status = 'remove';
        watchedBtnRef.textContent = 'Remove from watched';
      } else {
        console.log('I am NOT existing movie');
        watchedBtnRef.dataset.status = 'add';
        watchedBtnRef.textContent = 'Add to watched';
      }
    });
}

// Function to manage Watched collection in DB
function manageWatched(currentMovieItem, e) {
  e.preventDefault();

  const user = auth.currentUser;

  if (watchedBtnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        // updateWatchedGallery();
        console.log('Movie is added to watched!');
      })
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .delete()
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        // updateWatchedGallery();
        console.log('Movie is deleted from watched!');
      });
  }
}

// Function to update watched gallery UI
// function updateWatchedGallery() {
//   const user = auth.currentUser;

//   db.collection(`users`)
//     .doc(user.uid)
//     .collection('watched')
//     .get()
//     .then(snapshot => {
//       if (!snapshot.empty) {
//         watchedMessageRef.style.display = 'none';
//         watchedGalleryRef.innerHTML = '';
//         snapshot.docs.forEach(doc => {
//           const watchedGalleryItem = libraryGalleryElementTemplate(doc.data());
//           watchedGalleryRef.insertAdjacentHTML(
//             'afterbegin',
//             watchedGalleryItem,
//           );
//         });
//       } else {
//         watchedGalleryRef.innerHTML = '';
//         watchedMessageRef.style.display = 'block';
//       }
//     });
// }

// async function getCurrentUser() {
//   const user = auth.currentUser;
//   return user;
// }

// console.log(getCurrentUser());

function updateLibraryMessage(collectionRef, messageRef) {
  collectionRef.get().then(snapshot => {
    if (!snapshot.empty) {
      messageRef.style.display = 'none';
    } else {
      messageRef.style.display = 'block';
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

export {
  updateWatchedBtn,
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  manageWatched,
  watchedMessageRef,
  watchedGalleryRef,
  updateLibraryMessage,
  updateLibraryCollection,
  // updateWatchedGallery,
};
