import { db, auth, firebase } from './firebase-init';
import {
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  watchedGalleryRef,
  queueGalleryRef,
  favoriteGalleryRef,
  watchedMessageRef,
  queueMessageRef,
  favoriteMessageRef,
  manageCollection,
  updateLibraryCollection,
  updateLibraryMessage,
} from './firebase-firestore.js';
import { currentMovieItem } from './show-details.js';

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logoutRef = document.querySelector('#logout');
const loggedOutLinks = document.querySelectorAll('.logged-out__js');
const loggedInLinks = document.querySelectorAll('.logged-in__js');
const accountDetails = document.querySelector('.account-details__js');
const homeNavLnk = document.querySelector('.home-page-link__js');
const githubSigninRef = document.querySelector('.github-signin__js');

const logoutMobRef = document.querySelector('#logoutMobile__js');

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user);
    // Adding event listeners to the movies collection management buttons
    watchedBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, watchedBtnRef, 'watched', 'watched'),
    );
    queueBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, queueBtnRef, 'queue', 'queue'),
    );
    favoriteBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, favoriteBtnRef, 'favorite'),
    );

    // Getting references to Firestore collections of movies
    const watchedCollectionRef = db.collection(`users`).doc(user.uid).collection('watched');
    const queueCollectionRef = db.collection(`users`).doc(user.uid).collection('queue');
    const favoriteCollectionRef = db.collection(`users`).doc(user.uid).collection('favorite');

    // Adding Firestore real time listeners to collections of movies
    watchedCollectionRef.onSnapshot(snapshot => {
      const changes = snapshot.docChanges();
      updateLibraryMessage(watchedCollectionRef, watchedMessageRef);
      updateLibraryCollection(changes, watchedGalleryRef);
    });

    queueCollectionRef.onSnapshot(snapshot => {
      const changes = snapshot.docChanges();
      updateLibraryMessage(queueCollectionRef, queueMessageRef);
      updateLibraryCollection(changes, queueGalleryRef);
    });

    favoriteCollectionRef.onSnapshot(snapshot => {
      const changes = snapshot.docChanges();
      updateLibraryMessage(favoriteCollectionRef, favoriteMessageRef);
      updateLibraryCollection(changes, favoriteGalleryRef);
    });
  } else {
    setupUI();
  }
});

// signup

signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userData => {
      userData.user.updateProfile({
        displayName: signupForm['signup-name'].value,
      });
      db.collection('users').doc(userData.user.uid).set({
        library: [],
        watched: [],
        queue: [],
        favorite: [],
      });
    })
    .then(() => {
      const nav = document.querySelector('#mobile-links');
      M.Sidenav.getInstance(nav).close();
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});
// login github
githubSigninRef.addEventListener('click', githubSignin);

function githubSignin() {
  const gitHub = new firebase.auth.GithubAuthProvider();
  auth
    .signInWithPopup(gitHub)

    .then(function (result) {
      const token = result.credential.accessToken;
      const user = result.user;

      console.log(token);
      console.log(user);
      db.collection('users').doc(user.uid).set({
        library: [],
        watched: [],
        queue: [],
        favorite: [],
      });
    })
    .then(() => {
      // close the signup modal & reset form
      const nav = document.querySelector('#mobile-links');
      M.Sidenav.getInstance(nav).close();
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(error.code);
      console.log(error.message);
    });
}

// login

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const nav = document.querySelector('#mobile-links');
    M.Sidenav.getInstance(nav).close();
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
// logout

logoutRef.addEventListener('click', logout);
logoutMobRef.addEventListener('click', logout);

function logout(e) {
  e.preventDefault();
  logoutMobRef.classList.add('sidenav-close');
  auth.signOut();
  location.reload();
}

function setupUI(user) {
  if (user) {
    accountDetails.innerHTML = `
    <div> Logged in as: ${user.email}</div>
    <div> User Name: ${user.displayName}</div>
    `;

    // toggle user UI elements
    homeNavLnk.style.display = 'block';
    loggedInLinks.forEach(item => (item.style.display = 'block'));
    loggedOutLinks.forEach(item => (item.style.display = 'none'));
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    homeNavLnk.style.display = 'block';
    loggedInLinks.forEach(item => (item.style.display = 'none'));
    loggedOutLinks.forEach(item => (item.style.display = 'block'));
  }
}
