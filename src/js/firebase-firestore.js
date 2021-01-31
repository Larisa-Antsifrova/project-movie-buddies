// Imports of firestore services and variables
import { db, auth } from './firebase-init';

// Getting references to DOM elements
const watchedBtnRef = document.querySelector('.watched-btn__js');
const queueBtnRef = document.querySelector('.queue-btn__js');
const favoriteBtnRef = document.querySelector('.favorite-btn__js');

// Function to manage Watched collection in DB
async function manageWatched(currentMovieItem, e) {
  e.preventDefault();
  const user = auth.currentUser;
  // console.log(
  //   'watched collections',
  //   db
  //     .collection('users')
  //     .doc(user.uid)
  //     .collection('watched')
  //     .get()
  //     .then(snapshot => console.log(snapshot.docs.map(doc => doc.data()))),
  // );
  if (watchedBtnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        console.log('Movie is added to watched!');
      })
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .delete()
      .then(() => {
        updateWatchedBtn(currentMovieItem);
        console.log('Movie is deleted from watched!');
      });
  }
}

// Function to set buttons UI
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

export {
  updateWatchedBtn,
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  manageWatched,
};
