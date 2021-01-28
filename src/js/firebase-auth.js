import { db, auth } from './firebase-init';
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logout = document.querySelector('#logout');
const loggedOutLinks = document.querySelectorAll('.logged-out__js');
const loggedInLinks = document.querySelectorAll('.logged-in__js');
const accountDetails = document.querySelector('.account-details__js');
const homeNavLnk = document.querySelector('.home-page-link__js');

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    console.log(user);
    setupUI(user);
    // console.log('user logged in: ', user);
  } else {
    setupUI();
    console.log('user logged out');
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
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

// login

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
// logout

logout.addEventListener('click', e => {
  e.preventDefault();
  console.log('logout');
  auth.signOut();
});

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
