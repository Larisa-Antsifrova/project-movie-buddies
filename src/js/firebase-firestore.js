// Imports of firestore services and variables
import { db, auth } from './firebase-init';
import { currentMoviesList, currentMovieItem, genres } from './movieApi';

// Getting references to DOM elements
const watchedBtnRef = document.querySelector('.watched-btn__js');
const queueBtnRef = document.querySelector('.queue-btn__js');
const favoriteBtnRef = document.querySelector('.favorite-btn__js');

// Adding event listeners
// watchedBtnRef.addEventListener('click', e => manageWatched(e));

// Function to manage Watched collection in DB
async function manageWatched(currentMovieItem) {
  let movieItem = await currentMovieItem;
  console.log('CURRENT IN EVENT ON BUTTON', movieItem);
  const user = auth.currentUser;

  if (watchedBtnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/watched/${movieItem.id}`)
      .set(movieItem)
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        console.log('Document successfully written!');
      })
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/watched/${movieItem.id}`)
      .delete()
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        console.log('movie deleted');
      });
  }
}

// Function to set buttons UI
async function updateWatchedBtn(currentMovieItem) {
  let movieItem = await currentMovieItem;
  console.log('ID in update', movieItem.id);

  const user = auth.currentUser;

  db.doc(`users/${user.uid}/watched/${movieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        watchedBtnRef.dataset.status = 'remove';
        watchedBtnRef.textContent = 'Remove from watched';
      } else {
        watchedBtnRef.dataset.status = 'add';
        watchedBtnRef.textContent = 'Add to watched';
      }
    });
}

export {
  updateWatchedBtn,
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  manageWatched,
};
