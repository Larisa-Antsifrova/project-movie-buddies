// Imports of Firebase services and required variables/functions
import { db, auth } from './firebase-init';
import { currentMovieItem } from './show-details.js';
import { activeBuddyPage } from './navigation.js';

// Getting access to DOM elements
const findBuddyBtnRef = document.querySelector('.buddy-btn__js');
const moviesToDiscussListRef = document.querySelector('.movies-list__js');
const buddiesListRef = document.querySelector('.buddies-list__js');

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

    buddiesListRef.innerHTML = '';
    buddiesListRef.appendChild(fragment);
  });
}

function renderBuddy(doc, fragment, userId, movieId) {
  const name = doc.data().name;
  const email = doc.data().email;
  const telegram = doc.data().telegram;

  const li = document.createElement('li');
  li.classList.add('collection-item', 'row', 'valign-wrapper');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;
  nameSpan.classList.add('col', 's4');

  const collectionDiv = document.createElement('div');
  collectionDiv.classList.add('col', 's4');
  collectionDiv.classList.add('center');

  const watchedSpan = document.createElement('span');
  watchedSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');
  watchedSpan.textContent = 'watched';
  const queueSpan = document.createElement('span');
  queueSpan.textContent = 'queue';
  queueSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');

  const favoriteSpan = document.createElement('span');
  favoriteSpan.textContent = 'favorite';
  favoriteSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');

  isInCollection(userId, 'watched', movieId).then(reply => {
    if (reply) {
      collectionDiv.appendChild(watchedSpan);
    }
  });

  isInCollection(userId, 'queue', movieId).then(reply => {
    if (reply) {
      collectionDiv.appendChild(queueSpan);
    }
  });

  isInCollection(userId, 'favorite', movieId).then(reply => {
    if (reply) {
      collectionDiv.appendChild(favoriteSpan);
    }
  });

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

  li.appendChild(nameSpan);
  li.appendChild(collectionDiv);
  li.appendChild(contactDiv);
  // li.appendChild(queueSpan);
  // li.appendChild(favoriteSpan);

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

// 'https://web.telegram.org/#/im?p=@IgromagClub';
// 'https://t.me/larisa_antsifrova';

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

export { findBuddyBtnRef, findBuddy };
