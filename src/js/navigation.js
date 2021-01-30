import { Api, currentMoviesList, genres } from './movieApi';
import galleryElementTemplate from '../templates/8galleryElement.hbs';

const homeNavLinkRef = document.querySelector('.home-page-link__js');
const homeSectionRef = document.querySelector('.home__js');
const libraryNavLinkRef = document.querySelector('.library-page-link__js');
const librarySectionRef = document.querySelector('.library__js');
const buddyNavLinkRef = document.querySelector('.buddy-page-link__js');
const buddySectionRef = document.querySelector('.buddies__js');
const navigationRefs = document.querySelector('.navigation__js');
const searchForm = document.querySelector('.search-form__js');
const tabsLibrary = document.querySelector('.tabs__js');

homeNavLinkRef.addEventListener('click', e => {
  toggleActiveLink(homeNavLinkRef.firstElementChild);
  homeSectionRef.classList.remove('hide');
  librarySectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  searchForm.classList.remove('hide');
  tabsLibrary.classList.add('hide');
});

libraryNavLinkRef.addEventListener('click', e => {
  toggleActiveLink(libraryNavLinkRef.firstElementChild);
  librarySectionRef.classList.remove('hide');
  searchForm.classList.add('hide');
  homeSectionRef.classList.add('hide');
  buddySectionRef.classList.add('hide');
  tabsLibrary.classList.remove('hide');
});

buddyNavLinkRef.addEventListener('click', e => {
  toggleActiveLink(buddyNavLinkRef.firstElementChild);
  buddySectionRef.classList.remove('hide');
  homeSectionRef.classList.add('hide');
  librarySectionRef.classList.add('hide');
});

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.current');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('current');
  }
  link.classList.add('current');
}
