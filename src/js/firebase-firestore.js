// Imports of firestore services and variables
import { db, auth } from './firebase-init';

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
  console.log(
    'watched collections',
    db
      .collection('users')
      .doc(user.uid)
      .collection('watched')
      .get()
      .then(snapshot => console.log(snapshot.docs.map(doc => doc.data()))),
  );
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
function updateWatchedBtn(currentMovieItem) {
  // let movieItem = await currentMovieItem;
  console.log('ID in update', currentMovieItem.id);

  const user = auth.currentUser;

  console.log('USER ID IN ', user);

  db.doc(`users/${user.uid}/watched/${currentMovieItem.id}`)
    .get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        console.log('I am in EXISTS');
        watchedBtnRef.dataset.status = 'remove';

        console.log('DATA STATUS', watchedBtnRef.dataset.status);
        console.log('button', watchedBtnRef);
        watchedBtnRef.textContent = 'Remove from watched';
      } else {
        console.log('I DONT EXIST');
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
