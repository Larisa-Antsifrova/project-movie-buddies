// Imports of Firebase services and required variables/functions
import { db, auth } from './firebase-init';
import { currentMovieItem } from './show-details.js';
import { activeBuddyPage } from './fetch-functions.js';
import { Api } from './movieApi';
import { SECURE_TOKEN, PROVIDER } from './apiKey.js';

// Getting access to DOM elements
const findBuddyBtnRef = document.querySelector('.buddy-btn__js');
const moviesToDiscussListRef = document.querySelector('.movies-list__js');
const buddiesListRef = document.querySelector('.buddies-list__js');
const searchFormRef = document.querySelector('#search-form');
const sendEmailBtnRef = document.querySelector('.email-send-btn__js');

// Helper variables
let moviesToChoose = [];
let email = '';

//Adding event listeners
// searchFormRef.addEventListener('submit', searchFilmsForBuddy);
moviesToDiscussListRef.addEventListener('click', findBuddySearch);
sendEmailBtnRef.addEventListener('click', sendEmail);

// Function for searchind buddy in scenario when the movie is searched on the Buddies page
function findBuddySearch(e) {
  e.preventDefault();

  const id = +e.target.dataset.id;

  const chosenMovie = moviesToChoose.find(movie => movie.id === id);

  moviesToDiscussListRef.innerHTML = '';
  const moviePreview = renderMoviePreview(chosenMovie);
  moviesToDiscussListRef.appendChild(moviePreview);

  const user = auth.currentUser;

  const buddies = db.collection('users').where('movies', 'array-contains', id).orderBy('name');

  buddies.get().then(querySnapshot => {
    if (querySnapshot.docs.length < 2) {
      renderNoBuddyFound();
    } else {
      const fragment = document.createDocumentFragment();

      querySnapshot.forEach(doc => {
        if (doc.id !== user.uid) {
          renderBuddy(doc, fragment, doc.id, id);
        }
      });

      buddiesListRef.innerHTML = '';
      buddiesListRef.appendChild(fragment);
    }
  });
}

// Function to handle input serch for a movie
function searchFilmsForBuddy(e) {
  e.preventDefault();

  moviesToDiscussListRef.innerHTML = '';
  buddiesListRef.innerHTML = '';

  Api.searchQuery = e.target.elements.query.value.trim();

  Api.fetchSearchFilmsForBuddy(Api.searchQuery)
    .then(movies => {
      moviesToChoose = movies;
      const moviesListFragment = document.createDocumentFragment();
      movies.forEach(movie => {
        const moviePreview = renderMoviePreview(movie);
        moviesListFragment.appendChild(moviePreview);
      });
      moviesToDiscussListRef.appendChild(moviesListFragment);
    })
    .catch(error => {
      console.log(error);
    });
}

// Function that finds buddies in the scenario of details modal
function findBuddy(e) {
  e.preventDefault();

  activeBuddyPage();

  const detailsModal = document.querySelector('#details-modal');
  M.Modal.getInstance(detailsModal).close();
  moviesToChoose = [currentMovieItem];

  const moviePreview = renderMoviePreview(currentMovieItem);
  moviesToDiscussListRef.appendChild(moviePreview);

  const user = auth.currentUser;
  const movieId = currentMovieItem.id;

  const buddies = db.collection('users').where('movies', 'array-contains', movieId).orderBy('name');

  buddies.get().then(querySnapshot => {
    if (querySnapshot.docs.length < 2) {
      renderNoBuddyFound();
    } else {
      const fragment = document.createDocumentFragment();

      querySnapshot.forEach(doc => {
        if (doc.id !== user.uid) {
          renderBuddy(doc, fragment, doc.id, movieId);
        }
      });

      buddiesListRef.innerHTML = '';
      buddiesListRef.appendChild(fragment);
    }
  });
}

// Funtion to render notification that no buddy was found
function renderNoBuddyFound() {
  const li = document.createElement('li');
  li.classList.add('collection-item', 'center-align', 'red-text', 'text-lighten-1');
  li.textContent = 'No buddies have the movie in their collection.';
  buddiesListRef.innerHTML = '';
  buddiesListRef.appendChild(li);
}

// Function to render movies previews
function renderMoviePreview(currentMovieItem) {
  moviesToDiscussListRef.innerHTML = '';

  const title = currentMovieItem.title || currentMovieItem.name;
  const id = currentMovieItem.id;
  const a = document.createElement('a');
  a.classList.add('collection-item', 'valign-wrapper', 'avatar');
  a.setAttribute('href', '#!');
  a.setAttribute('data-id', id);

  const img = document.createElement('img');
  const src = currentMovieItem.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${currentMovieItem.backdrop_path}`
    : 'https://cdn.pixabay.com/photo/2015/09/09/17/51/film-932154_960_720.jpg';
  img.setAttribute('src', src);
  img.setAttribute('alt', `${title}`);
  img.classList.add('circle');
  img.setAttribute('data-id', id);

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('movie-title', 'title');
  titleSpan.setAttribute('data-id', id);

  titleSpan.textContent = title;
  a.appendChild(img);
  a.appendChild(titleSpan);
  return a;
}

// Function to render one Buddy preview
function renderBuddy(doc, fragment, userId, movieId) {
  // Getting info to fill in Buddy search result
  const name = doc.data().name;
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
    toTelegram.classList.add('btn-floating', 'waves-effect', 'waves-light', 'contact-btn');
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
  toMail.classList.add('btn-floating', 'waves-effect', 'waves-light', 'modal-trigger', 'contact-btn');
  toMail.setAttribute('href', '#email-modal');
  toMail.setAttribute('data-email', `${doc.id}`);

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

  // Adding event-listener that passes target e-mail
  toMail.addEventListener('click', async e => {
    email = await db
      .collection('users')
      .doc(e.target.parentElement.dataset.email)
      .get()
      .then(doc => doc.data().email);
  });
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

// Function to send e-mail with SMTP service
function sendEmail(e) {
  e.preventDefault();

  const emailFormRef = document.getElementById('email-form');

  const toEmail = email;
  const fromEmail = PROVIDER;
  const subject = emailFormRef['subject'].value;
  const replyEmail = emailFormRef['reply-to'].value;
  const message = emailFormRef['email-body'].value;

  const emailBody = `${message}
  p.s. Reply to ${replyEmail} :)`;

  // Script to send an e-mail with SMTP. Commented at the moment to keep the subscription safe :)
  // Email.send({
  //   SecureToken: SECURE_TOKEN,
  //   To: toEmail,
  //   From: fromEmail,
  //   Subject: subject,
  //   Body: emailBody,
  // }).then(message => {
  //   console.log(message);
  //   emailFormRef.reset();
  //   const modal = document.querySelector('#email-modal');
  //   M.Modal.getInstance(modal).close();
  //   M.toast({ html: 'Your email is sent!', classes: 'rounded orange darken-1 center' });
  // });

  // Console for checking and demo
  console.log({
    toEmail: toEmail,
    fromEmail: fromEmail,
    subject: subject,
    replyEmail: replyEmail,
    message: message,
    emailBody: emailBody,
  });

  // Notifications for demo
  emailFormRef.reset();
  const modal = document.querySelector('#email-modal');
  M.Modal.getInstance(modal).close();
  M.toast({ html: 'Your email is sent!', classes: 'rounded orange darken-1 center' });
}

export { findBuddyBtnRef, findBuddy, searchFilmsForBuddy };
