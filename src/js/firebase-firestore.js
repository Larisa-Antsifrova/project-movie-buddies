// Imports of firestore services and variables
import { db, auth } from './firebase-init';
import { currentMoviesList, currentMovieItem, genres } from './movieApi';

// Getting references to DOM elements
const watchedBtnRef = document.querySelector('.watched-btn__js');
const queueBtnRef = document.querySelector('.queue-btn__js');
const favoriteBtnRef = document.querySelector('.favorite-btn__js');

// Function to set buttons UI
function updateBtn() {
  const user = auth.currentUser;

  db.collection('users')
    .doc(user.uid)
    .collection('watched')
    .doc('85271')
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        watchedBtnRef.dataset.status = 'remove';
        watchedBtnRef.textContent = 'Remove';
      }
    });
}

updateBtn();
watchedBtnRef.addEventListener('click', addToWatched);

// Function to add to Watched
async function addToWatched() {
  updateBtn();
  const user = auth.currentUser;
  let currentMovieItem = await currentMoviesList.then(array =>
    array.find(item => item.id === 85271),
  );

  console.log('currentMovieItem in addWatched', currentMovieItem);
  console.log('currentMoviesList in Watched', currentMoviesList[0]);

  if (watchedBtnRef.dataset.status === 'add') {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .set(currentMovieItem)
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(error => console.log(error.message));
  } else {
    db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
      .delete()
      .then(() => {
        console.log('movie deleted');
      });
  }
}
