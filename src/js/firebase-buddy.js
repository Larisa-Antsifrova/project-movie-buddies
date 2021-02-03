import { db, auth } from './firebase-init';
import { currentMovieItem } from './show-details.js';
import { activeBuddyPage } from './navigation.js';

const findBuddyBtnRef = document.querySelector('.buddy-btn__js');
const buddiesList = document.querySelector('.buddies-list__js');

// Function that finds buddies in the scenario of details modal
function findBuddy(e) {
  e.preventDefault();

  activeBuddyPage();

  const detailsModal = document.querySelector('#details-modal');
  M.Modal.getInstance(detailsModal).close();

  const user = auth.currentUser;
  const movieId = currentMovieItem.id;

  const buddies = db.collection('users').where('movies', 'array-contains', movieId).orderBy('name');

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

function renderBuddy(doc, fragment, userId, movieId) {
  const name = doc.data().name;
  const email = doc.data().email;
  const telegram = doc.data().telegram;

  const li = document.createElement('li');
  li.classList.add('collection-item');
  li.classList.add('row');

  const span = document.createElement('span');
  span.textContent = name;
  span.classList.add('col', 's4');

  const collectionDiv = document.createElement('div');
  collectionDiv.classList.add('col', 's4');
  collectionDiv.classList.add('center');

  const watchedSpan = document.createElement('span');
  watchedSpan.textContent = 'in watched';
  const queueSpan = document.createElement('span');
  queueSpan.textContent = 'in queue';
  const favoriteSpan = document.createElement('span');
  favoriteSpan.textContent = 'in favorite';
  collectionDiv.appendChild(watchedSpan);
  collectionDiv.appendChild(queueSpan);
  collectionDiv.appendChild(favoriteSpan);

  const contactDiv = document.createElement('div');
  contactDiv.classList.add('col', 's4');
  contactDiv.classList.add('secondary-content');
  contactDiv.classList.add('right-align');

  const toTelegram = document.createElement('a');
  toTelegram.setAttribute('href', `https://web.telegram.org/#/im?p=${telegram}`);
  toTelegram.setAttribute('target', '_blank');
  // toTelegram.classList.add('secondary-content');

  const ic = document.createElement('i');
  ic.classList.add('material-icons');
  ic.textContent = 'send';

  const toMail = document.createElement('a');
  toMail.setAttribute('href', `mailto:${email}`);
  // toMail.classList.add('secondary-content');

  const i = document.createElement('i');
  i.classList.add('material-icons');
  i.textContent = 'email';

  toMail.appendChild(i);
  toTelegram.appendChild(ic);

  if (telegram) {
    contactDiv.appendChild(toTelegram);
  }
  contactDiv.appendChild(toMail);

  li.appendChild(span);
  li.appendChild(collectionDiv);
  li.appendChild(contactDiv);
  // li.appendChild(queueSpan);
  // li.appendChild(favoriteSpan);

  isInCollection(userId, 'watched', movieId).then(reply => {
    if (reply) {
      watchedSpan.style.display = 'inline-block';
    } else {
      watchedSpan.style.display = 'none';
    }
  });

  isInCollection(userId, 'queue', movieId).then(reply => {
    if (reply) {
      queueSpan.style.display = 'inline-block';
    } else {
      queueSpan.style.display = 'none';
    }
  });

  isInCollection(userId, 'favorite', movieId).then(reply => {
    if (reply) {
      favoriteSpan.style.display = 'inline-block';
    } else {
      favoriteSpan.style.display = 'none';
    }
  });

  // li.appendChild(toMail);

  fragment.appendChild(li);
}

async function isInCollection(userId, collection, movieId) {
  const movie = db.doc(`users/${userId}/${collection}/${movieId}`);
  const movieInCollection = await movie.get();

  if (movieInCollection.exists) {
    console.log('Movie in Collection inside', movieInCollection);
    return true;
  }
  return false;
}

export { findBuddyBtnRef, findBuddy };

// 'https://web.telegram.org/#/im?p=@IgromagClub';
