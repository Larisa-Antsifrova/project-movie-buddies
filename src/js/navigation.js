const logoNavRef = document.querySelector('.logo__js');
const homeNavLinkRef = document.querySelector('.home-page-link__js');
const homeSectionRef = document.querySelector('.home__js');
const libraryNavLinkRef = document.querySelector('.library-page-link__js');
const librarySectionRef = document.querySelector('.library__js');
const buddyNavLinkRef = document.querySelector('.buddy-page-link__js');
const buddySectionRef = document.querySelector('.buddies__js');
const navigationRefs = document.querySelector('.navigation__js');
const searchForm = document.querySelector('.search-form__js');
const tabsLibrary = document.querySelector('.tabs__js');
// mobile menu
const homeMobNavRef = document.querySelector('.home-page-link-mobile__js');
const libraryMobNavRef = document.querySelector('.library-page-link-mobile__js');
const buddyMobNavRef = document.querySelector('.buddy-page-link-mobile__js');

logoNavRef.addEventListener('click', activeHomePage);
homeNavLinkRef.addEventListener('click', activeHomePage);
libraryNavLinkRef.addEventListener('click', activeLibraryPage);
buddyNavLinkRef.addEventListener('click', activeBuddyPage);
homeMobNavRef.addEventListener('click', activeHomePage);
libraryMobNavRef.addEventListener('click', activeLibraryPage);
buddyMobNavRef.addEventListener('click', activeBuddyPage);

function activeHomePage(e) {
  homeMobNavRef.classList.add('sidenav-close');
  location.reload();
  toggleActiveLink(homeNavLinkRef.firstElementChild);
  homeSectionRef.classList.remove('hide');
  librarySectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  searchForm.classList.remove('hide');
  tabsLibrary.classList.add('hide');
}
function activeLibraryPage(e) {
  libraryMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(libraryNavLinkRef.firstElementChild);
  librarySectionRef.classList.remove('hide');
  searchForm.classList.add('hide');
  homeSectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  tabsLibrary.classList.remove('hide');
}
function activeBuddyPage(e) {
  buddyMobNavRef.classList.add('sidenav-close');
  toggleActiveLink(buddyNavLinkRef.firstElementChild);
  buddySectionRef.classList.remove('hide');
  homeSectionRef.classList.add('hide');
  librarySectionRef.classList.add('hide');
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.current');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('current');
  }
  link.classList.add('current');
}
