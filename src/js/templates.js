// import headerTemplate from '../templates/1header.hbs';

// Initialize Home Page 
import homeTemplate from '../templates/2home.hbs';
const inputMarkup = homeTemplate();
const homeRef = document.querySelector('.home__js');
homeRef.insertAdjacentHTML('beforeend', inputMarkup);

// Initialize Library Page 
import libraryTemplate from '../templates/3library.hbs';
const libraryRef = document.querySelector('.library__js');
const libraryMarkup = libraryTemplate();
libraryRef.insertAdjacentHTML('beforeend', libraryMarkup);
// const galleryElementMarkup = galleryElementTemplate();

import galleryElement from '../templates/8galleryElement.hbs';
// const galleryElementRef = document.c

