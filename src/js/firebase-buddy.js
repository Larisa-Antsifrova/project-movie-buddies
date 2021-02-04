// Imports of Firebase services and required variables/functions
import { db, auth } from './firebase-init';
import { currentMovieItem } from './show-details.js';
import { activeBuddyPage } from './fetch-functions.js';
import { Api } from './movieApi';
import searchGalleryElement from '../templates/5buddies.hbs';
// import { clearInput } from './fetch-functions.js';



// Getting access to DOM elements
const findBuddyBtnRef = document.querySelector('.buddy-btn__js');
const moviesToDiscussListRef = document.querySelector('.movies-list__js');
const buddiesListRef = document.querySelector('.buddies-list__js');

const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', searchFilmsForBuddy);

function searchFilmsForBuddy(e) {
  e.preventDefault();
    moviesToDiscussListRef.innerHTML = '';
  Api.searchQuery = e.target.elements.query.value.trim();
  Api.fetchSearchFilmsForBuddy(Api.searchQuery).then(arr => {
      const galleryListMarkup = searchGalleryElement(arr);
  moviesToDiscussListRef.insertAdjacentHTML('afterbegin', galleryListMarkup);
  }).catch(error => {
    console.log(error);
  });
}

// Function that finds buddies in the scenario of details modal
function findBuddy(e) {
  e.preventDefault();

  activeBuddyPage();

  const detailsModal = document.querySelector('#details-modal');
  M.Modal.getInstance(detailsModal).close();

  const moviePreview = renderMoviePreview(currentMovieItem);
  moviesToDiscussListRef.appendChild(moviePreview);

  const user = auth.currentUser;
  const movieId = currentMovieItem.id;

  const buddies = db.collection('users').where('movies', 'array-contains', movieId).orderBy('name');

  buddies.get().then(querySnapshot => {
    const fragment = document.createDocumentFragment();

    querySnapshot.forEach(doc => {
      if (doc.id !== user.uid) {
        renderBuddy(doc, fragment, doc.id, movieId);
      }
    });

    buddiesListRef.innerHTML = '';
    buddiesListRef.appendChild(fragment);
  });
}

// Function to render movies previews
function renderMoviePreview(currentMovieItem) {
  moviesToDiscussListRef.innerHTML = '';

  const title = currentMovieItem.title || currentMovieItem.name;

  const a = document.createElement('a');
  a.classList.add('collection-item', 'valign-wrapper', 'avatar');
  a.setAttribute('href', '#!');

  const img = document.createElement('img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500${currentMovieItem.backdrop_path}`);
  img.setAttribute('alt', `${title}`);
  img.classList.add('circle');

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('movie-title', 'title');

  titleSpan.textContent = title;
  a.appendChild(img);
  a.appendChild(titleSpan);
  return a;
}

// Function to render one Buddy preview
function renderBuddy(doc, fragment, userId, movieId) {
  // Getting info to fill in Buddy search result
  const name = doc.data().name;
  const email = doc.data().email;
  const telegram = doc.data().telegram;

  // Creating container to contain Buddy's info
  const li = document.createElement('li');
  li.classList.add('collection-item', 'row', 'valign-wrapper');

  // Creating element to hold Buddy's name
  const nameSpan = document.createElement('span');
  nameSpan.classList.add('col', 's4', 'buddy-name');
  nameSpan.textContent = name;

  // Creating element to contain collection chips
  const collectionDiv = document.createElement('div');
  collectionDiv.classList.add('col', 's4');

  // Checking conditions for each collection to render corresponding chips
  isInCollection(userId, 'watched', movieId).then(reply => {
    if (reply) {
      const watchedSpan = document.createElement('span');
      watchedSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');
      watchedSpan.textContent = 'watched';
      collectionDiv.appendChild(watchedSpan);
    }
  });

  isInCollection(userId, 'queue', movieId).then(reply => {
    if (reply) {
      const queueSpan = document.createElement('span');
      queueSpan.textContent = 'queue';
      queueSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');
      collectionDiv.appendChild(queueSpan);
    }
  });

  isInCollection(userId, 'favorite', movieId).then(reply => {
    if (reply) {
      const favoriteSpan = document.createElement('span');
      favoriteSpan.textContent = 'favorite';
      favoriteSpan.classList.add('chip', 'orange', 'darken-2', 'white-text');
      collectionDiv.appendChild(favoriteSpan);
    }
  });

  // Creating element to contain contact info
  const contactDiv = document.createElement('div');
  contactDiv.classList.add('col', 's4', 'right-align');

  // Creating element for telegram contact
  if (telegram) {
    const deviceType = getDeviceType();

    const toTelegram = document.createElement('a');
    toTelegram.classList.add('btn-floating', 'waves-effect', 'waves-light', 'telegram-btn');
    if (deviceType === 'desktop') {
      toTelegram.setAttribute('href', `https://web.telegram.org/#/im?p=${telegram}`);
    } else {
      toTelegram.setAttribute('href', `https://t.me/${telegram.slice(1)}`);
    }
    toTelegram.setAttribute('target', '_blank');

    const telegramIcon = document.createElement('i');
    telegramIcon.classList.add('material-icons');
    telegramIcon.textContent = 'send';
    toTelegram.appendChild(telegramIcon);

    contactDiv.appendChild(toTelegram);
  }

  // Creating element for email contact
  const toMail = document.createElement('a');
  toMail.classList.add('btn-floating', 'waves-effect', 'waves-light');
  toMail.setAttribute('href', `mailto:${email}`);

  const emailIcon = document.createElement('i');
  emailIcon.classList.add('material-icons');
  emailIcon.textContent = 'email';

  toMail.appendChild(emailIcon);

  // Appending elements to Buddy item
  contactDiv.appendChild(toMail);
  li.appendChild(nameSpan);
  li.appendChild(collectionDiv);
  li.appendChild(contactDiv);

  // Preparing the fragment
  fragment.appendChild(li);
}

// Function to check what collection the chosen movie is in
async function isInCollection(userId, collection, movieId) {
  const movie = db.doc(`users/${userId}/${collection}/${movieId}`);
  const movieInCollection = await movie.get();

  if (movieInCollection.exists) {
    return true;
  }
  return false;
}

// Funtion to get user's device to provide with corresponding messanger link
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

// Examples of Telegram links
// 'https://web.telegram.org/#/im?p=@IgromagClub';
// 'https://t.me/larisa_antsifrova';

//=======Experiments=========
const button = document.querySelector('.e-mail-buddy__js');
console.log('button', button);

// button.addEventListener('click', sendEmail);

function sendEmail() {
  Email.send({
    SecureToken: '8df58ccc-9817-4ece-ac78-f1dabcd6b9ce',
    To: 'thecarrot@ukr.net',
    From: 'thecarrot@ukr.net',
    Subject: 'This is the subject',
    Body: 'And this is the body',
  }).then(message => alert(message));
}
