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
        renderBuddy(doc, fragment);
      }
    });
    buddiesList.appendChild(fragment);
  });
}

function renderBuddy(doc, fragment, userId, collection, id) {
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

  const isInWatched = isInCollection(userId, 'watched', id);
  if (isInWatched) {
    li.appendChild(watchedSpan);
  }
  const isInQueue = isInCollection(userId, 'queue', id);
  if (isInQueue) {
    li.appendChild(queueSpan);
  }
  const isInFavorite = isInCollection(userId, 'favorite', id);
  if (isInFavorite) {
    li.appendChild(favoriteSpan);
  }

  li.appendChild(a);

  fragment.appendChild(li);
}

function isInCollection(userId, collection, id) {
  // body
}

export { findBuddyBtnRef, findBuddy };
