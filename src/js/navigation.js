import { Api } from './movieApi';
import { searchFilmsForBuddy } from './firebase-buddy';
import { input } from './input';

const logoNavRef = document.querySelector('.logo__js');
const homeNavLinkRef = document.querySelector('.home-page-link__js');
const homeGalleryListRef = document.querySelector('.home-gallery__js');
const homeSectionRef = document.querySelector('.home__js');
const libraryNavLinkRef = document.querySelector('.library-page-link__js');
const librarySectionRef = document.querySelector('.library__js');
const buddyNavLinkRef = document.querySelector('.buddy-page-link__js');
const buddySectionRef = document.querySelector('.buddies__js');
const navigationRefs = document.querySelector('.navigation__js');
const searchFormRef = document.querySelector('.search-form__js');
const tabsLibrary = document.querySelector('.tabs__js');
const headerNavRef = document.querySelector('.header__js');
const searchFormLabelTextRef = document.querySelector('.label-text__js');
// mobile menu
const homeMobNavRef = document.querySelector('.home-page-link-mobile__js');
const libraryMobNavRef = document.querySelector('.library-page-link-mobile__js');
const buddyMobNavRef = document.querySelector('.buddy-page-link-mobile__js');
// Buddy page lists
const moviesToDiscussListRef = document.querySelector('.movies-list__js');
const buddiesListRef = document.querySelector('.buddies-list__js');

logoNavRef.addEventListener('click', activeHomePage);
homeNavLinkRef.addEventListener('click', activeHomePage);
libraryNavLinkRef.addEventListener('click', activeLibraryPage);
buddyNavLinkRef.addEventListener('click', activeBuddyPage);
homeMobNavRef.addEventListener('click', activeHomePage);
libraryMobNavRef.addEventListener('click', activeLibraryPage);
buddyMobNavRef.addEventListener('click', activeBuddyPage);

function activeHomePage(e) {
  homeMobNavRef.classList.add('sidenav-close');
  Api.resetPage();
  input.clearGallery(homeGalleryListRef);
  input.clearInput();
  input.renderPopularFilms();
  searchFormRef.removeEventListener('submit', searchFilmsForBuddy);
  toggleActiveLink(homeNavLinkRef.firstElementChild);
  homeSectionRef.classList.remove('hide');
  librarySectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  searchFormRef.classList.remove('hide');
  searchFormLabelTextRef.textContent = "Let's find a movie for you!";
  tabsLibrary.classList.add('hide');
  headerNavRef.classList.add('bg-home');
  headerNavRef.classList.remove('bg-buddies');
  headerNavRef.classList.remove('bg-library');
}

function activeLibraryPage(e) {
  libraryMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(libraryNavLinkRef.firstElementChild);
  librarySectionRef.classList.remove('hide');
  searchFormRef.classList.add('hide');
  homeSectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  tabsLibrary.classList.remove('hide');
  headerNavRef.classList.remove('bg-home');
  headerNavRef.classList.add('bg-library');
  headerNavRef.classList.remove('bg-buddies');
}
function activeBuddyPage(e) {
  cleanBuddyPage();
  input.clearInput();
  searchFormRef.removeEventListener('submit', (e)=>{input.searchFilms(e)});
  searchFormRef.addEventListener('submit', searchFilmsForBuddy);
  buddyMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(buddyNavLinkRef.firstElementChild);
  buddySectionRef.classList.remove('hide');
  homeSectionRef.classList.add('hide');
  librarySectionRef.classList.add('hide');
  headerNavRef.classList.add('bg-buddies');
  headerNavRef.classList.remove('bg-home');
  headerNavRef.classList.remove('bg-library');
  tabsLibrary.classList.add('hide');
  searchFormRef.classList.remove('hide');
  searchFormLabelTextRef.textContent = 'Movie to discuss';
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.current');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('current');
  }
  link.classList.add('current');
}

function cleanBuddyPage() {
  moviesToDiscussListRef.innerHTML = '';
  buddiesListRef.innerHTML = '';
}

export { activeBuddyPage };