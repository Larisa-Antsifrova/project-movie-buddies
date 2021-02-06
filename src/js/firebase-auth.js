import { db, auth, firebase } from './firebase-init';
import {
  watchedBtnRef,
  queueBtnRef,
  favoriteBtnRef,
  buddyBtnRef,
  watchedBtnIconRef,
  queueBtnIconRef,
  favoriteBtnIconRef,
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
import { findBuddyBtnRef, findBuddy } from './firebase-buddy.js';
import { currentMovieItem } from './show-details.js';

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logoutRef = document.querySelector('#logout');
const loggedOutLinks = document.querySelectorAll('.logged-out__js');
const loggedInLinks = document.querySelectorAll('.logged-in__js');
const accountForm = document.querySelector('#account-form');
const avatarUser = document.querySelector('.avatar__js');
const updateNameBtn = document.querySelector('.update-name__js');
const updateEmailBtn = document.querySelector('.update-email__js');
const updateTelegramBtn = document.querySelector('.update-telegram-name__js');
const navLinkAccountRef = document.querySelector('.nav-link-account__js');
const sidenameLinkAccountRef = document.querySelector('.sidenav-link-account__js');
const homeNavLnk = document.querySelector('.home-page-link__js');
const githubSigninRef = document.querySelector('.github-signin__js');
const logoutMobRef = document.querySelector('#logoutMobile__js');
const githubLoginRef = document.querySelector('.github-login__js');
const checkBox = document.querySelector('#checkbox__js');
const telegramName = document.querySelector('#signup-telegram-name__js');

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    //listen updateBtn
    updateNameBtn.addEventListener('click', e => {
      e.preventDefault();
      updateInfo(accountForm['account-name']);
    });
    updateEmailBtn.addEventListener('click', e => {
      e.preventDefault();
      updateInfo(accountForm['account-email']);
    });
    updateTelegramBtn.addEventListener('click', e => {
      e.preventDefault();
      updateInfo(accountForm['account-telegram-name']);
      updateInfo(accountForm['checkbox__js']);
    });

    // accountForm UPDATE
    accountForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!accountForm['account-name'].disabled) {
        user
          .updateProfile({
            displayName: accountForm['account-name'].value,
          })
          .then(() => {
            navLinkAccountRef.textContent = accountForm['account-name'].value;
            accountForm['account-name'].disabled = true;
            // console.log('Ваше имя было успешно изменено');
          })
          .then(() => {
            const modal = document.querySelector('#modal-account');
            M.Modal.getInstance(modal).close();
          });
      }
      if (!accountForm['account-email'].disabled) {
        user
          .updateEmail(`${accountForm['account-email'].value}`)
          .then(() => {
            accountForm['account-email'].disabled = true;
            // console.log('Ваш Email был успешно изменен');
          })
          .then(() => {
            const modal = document.querySelector('#modal-account');
            M.Modal.getInstance(modal).close();
          });
      } else if (!accountForm['account-telegram-name'].disabled) {
        db.collection('users')
          .doc(user.uid)
          .update({
            telegramName: accountForm['account-telegram-name'].value,
          })
          .then(() => {
            // console.log('Ваш никнейм телеграм изменен');
          })
          .then(() => {
            const modal = document.querySelector('#modal-account');
            M.Modal.getInstance(modal).close();
            location.reload();
          });
      }
    });
    watchedBtnRef.classList.remove('disabled');
    queueBtnRef.classList.remove('disabled');
    favoriteBtnRef.classList.remove('disabled');
    buddyBtnRef.classList.remove('disabled');
    setupUI(user);

    // Adding event listeners to the movies collection management buttons
    watchedBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, 'watched', watchedBtnRef, watchedBtnIconRef),
    );
    queueBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, 'queue', queueBtnRef, queueBtnIconRef),
    );
    favoriteBtnRef.addEventListener('click', e =>
      manageCollection(e, currentMovieItem, user, 'favorite', favoriteBtnRef, favoriteBtnIconRef),
    );

    // Adding event listener to the Find Buddy button
    findBuddyBtnRef.addEventListener('click', e => findBuddy(e));

    // Getting references to Firestore collections of movies
    const watchedCollectionRef = db.collection(`users`).doc(user.uid).collection('watched');
    const queueCollectionRef = db.collection(`users`).doc(user.uid).collection('queue');
    const favoriteCollectionRef = db.collection(`users`).doc(user.uid).collection('favorite');
    const libraryCollectionRef = db.collection(`users`).doc(user.uid).collection('library');

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

    // Adding real time listener to the general library collection
    libraryCollectionRef.onSnapshot(snapshot => {
      const libraryIndexes = snapshot.docs.map(doc => +doc.id);
      db.collection(`users`)
        .doc(user.uid)
        .set({ movies: libraryIndexes }, { merge: true })
        .then(() => {
          // console.log(`DONE UPDATING libraryInd`);
        });
    });
  } else {
    watchedBtnRef.classList.add('disabled');
    queueBtnRef.classList.add('disabled');
    favoriteBtnRef.classList.add('disabled');
    buddyBtnRef.classList.add('disabled');
    setupUI();
  }
});

checkBox.addEventListener('click', e => {
  if (e.target.checked) {
    telegramName.disabled = false;
  } else {
    telegramName.disabled = true;
  }
});

// signup
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const displayName = signupForm['signup-name'].value;
  const telegramName = signupForm['signup-telegram-name__js'].value;
  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userData => {
      userData.user.updateProfile({
        displayName: displayName,
      });
      db.collection('users')
        .doc(userData.user.uid)
        .set({
          name: displayName,
          telegramName: telegramName === '@' ? null : telegramName,
          email: email,
          movies: [],
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
githubLoginRef.addEventListener('click', githubSignin);

function githubSignin() {
  const gitHub = new firebase.auth.GithubAuthProvider();
  auth
    .signInWithPopup(gitHub)
    .then(() => {
      // close the signup modal & reset form
      const nav = document.querySelector('#mobile-links');
      M.Sidenav.getInstance(nav).close();
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .then(() => {
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .then(function (result) {
      const token = result.credential.accessToken;
      const user = result.user;
      console.log('GH reg', user);

      // console.log(token);
      // console.log(user);
      db.collection('users').doc(user.uid).set({
        name: displayName,
        email: email,
        movies: [],
      });
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // console.log(error.code);
      // console.log(error.message);
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
    navLinkAccountRef.textContent = user.displayName;
    sidenameLinkAccountRef.textContent = user.displayName;
    user.photoURL
      ? (avatarUser.src = `${user.photoURL}`)
      : (avatarUser.src =
          'https://rdihub.b-cdn.net/wp-content/uploads/2020/01/black-and-white-panda-logo-users-group-encapsulated-postscript-user-profile-group-png-clip-art.png');

    accountForm['account-name'].value = user.displayName;
    accountForm['account-email'].value = user.email;
    accountForm['account-telegram-name'].value = '@';

    db
      .collection('users')
      .doc(user.uid)
      .get()
      .then(col => {
        if (col.data().telegramName) {
          accountForm['checkbox__js'].checked = true;
          accountForm['account-telegram-name'].value = col.data().telegramName;
        }
      }),
      // toggle user UI elements
      (homeNavLnk.style.display = 'block');
    loggedInLinks.forEach(item => (item.style.display = 'block'));
    loggedOutLinks.forEach(item => (item.style.display = 'none'));
  } else {
    navLinkAccountRef.textContent = 'Account';
    sidenameLinkAccountRef.textContent = 'Account';
    // clear account info
    // accountDetails.innerHTML = '';
    // toggle user elements
    homeNavLnk.style.display = 'block';
    loggedInLinks.forEach(item => (item.style.display = 'none'));
    loggedOutLinks.forEach(item => (item.style.display = 'block'));
  }
}

function updateInfo(link) {
  if (link.disabled) {
    link.disabled = false;
  } else {
    link.disabled = true;
  }
}
