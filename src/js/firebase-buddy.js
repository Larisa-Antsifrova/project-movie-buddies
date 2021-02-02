import { db, auth, firebase } from './firebase-init';
import { currentMovieItem } from './show-details.js';
import { activeBuddyPage } from './navigation.js';

const findBuddyBtnRef = document.querySelector('.buddy-btn__js');
const buddiesList = document.querySelector('.buddies-list__js');

function findBuddy(e) {
  e.preventDefault();

  activeBuddyPage();

  const detailsModal = document.querySelector('#details-modal');
  M.Modal.getInstance(detailsModal).close();

  const user = auth.currentUser;
  const movieId = currentMovieItem.id;

  const buddies = db.collection('users').where('movies', 'array-contains', movieId);
  buddies.get().then(querySnapshot => {
    const fragment = document.createDocumentFragment();
    querySnapshot.forEach(doc => {
      if (doc.id !== user.uid) {
        console.log(doc.data());
        renderBuddy(doc, fragment, doc.id, movieId);
      }
    });
    buddiesList.innerHTML = '';
    buddiesList.appendChild(fragment);
  });
}

async function renderBuddy(doc, fragment, userId, movieId) {
  const name = doc.data().name;
  const email = doc.data().email;

  const li = document.createElement('li');
  li.classList.add('collection-item');

  const span = document.createElement('span');
  span.textContent = name;

  const watchedSpan = document.createElement('span');
  watchedSpan.textContent = 'in watched';
  const queueSpan = document.createElement('span');
  queueSpan.textContent = 'in queue';
  const favoriteSpan = document.createElement('span');
  favoriteSpan.textContent = 'in favorite';

  const a = document.createElement('a');
  a.setAttribute('href', `mailto:${email}`);
  a.classList.add('secondary-content');

  const i = document.createElement('i');
  i.classList.add('material-icons');
  i.textContent = 'send';

  a.appendChild(i);
  li.appendChild(span);

  // const isInWatched = await isInCollection(userId, 'watched', movieId);
  // if (isInWatched) {
  //   console.log('isInWatched', isInWatched);
  //   li.appendChild(watchedSpan);
  // }
  // const isInQueue = await isInCollection(userId, 'queue', movieId);
  // if (isInQueue) {
  //   console.log('isInQueue', isInQueue);
  //   li.appendChild(queueSpan);
  // }
  // const isInFavorite = await isInCollection(userId, 'favorite', movieId);
  // if (isInFavorite) {
  //   console.log('isInFavorite', isInFavorite);
  //   li.appendChild(favoriteSpan);
  // }

  li.appendChild(a);

  fragment.appendChild(li);
}

async function isInCollection(userId, collection, movieId) {
  const movie = await db.doc(`users/${userId}/${collection}/${movieId}`);
  const movieInCollection = await movie.get();

  if (movieInCollection.exists) {
    console.log('Movie in Collection inside', movieInCollection);
    return true;
  }
  return false;
}

export { findBuddyBtnRef, findBuddy };
