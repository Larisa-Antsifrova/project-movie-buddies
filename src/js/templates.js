// Initialize Home Page
import homeTemplate from '../templates/2home.hbs';
const inputMarkup = homeTemplate();
const homeRef = document.querySelector('.home__js');
homeRef.insertAdjacentHTML('beforeend', inputMarkup);

// Initialize Library Page
import libraryTemplate from '../templates/3library.hbs';
const libraryMarkup = libraryTemplate();
const libraryRef = document.querySelector('.library__js');
libraryRef.insertAdjacentHTML('beforeend', libraryMarkup);

// Initialize GalleryElement
import galleryElementTemplate from '../templates/8galleryElement.hbs';
const galleryElementMarkup = galleryElementTemplate();
const galleryElementRef = document.getElementById('library-gallery');
galleryElementRef.insertAdjacentHTML('beforeend', galleryElementMarkup);
