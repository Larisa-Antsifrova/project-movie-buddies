// Initialize header
import headerTemplate from '../templates/1header.hbs';
const headerMarkup = headerTemplate();
const headerRef = document.querySelector('.header__js');
headerRef.insertAdjacentHTML('afterbegin', headerMarkup);

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

// Initialize details modal
import detailTemplate from '../templates/4details.hbs';
const detailMarkup = detailTemplate();

import detailsContainerTemplate from '../templates/4detailsContainer.hbs';
const detailsContainerMarkup = detailsContainerTemplate();
const detailsContainerRef = document.querySelector('.details-modal__js');
detailsContainerRef.insertAdjacentHTML('beforeend', detailsContainerMarkup);

// Initialize Buddies
import buddiesTemplate from '../templates/5buddies.hbs';
const buddiesMarkup = buddiesTemplate();
const buddiesSectionRef = document.querySelector('.buddies__js');
buddiesSectionRef.insertAdjacentHTML('beforeend', buddiesMarkup);

// UP button
import buttonUpTemplate from '../templates/9buttonUp.hbs';
const buttonUp = buttonUpTemplate();
homeRef.insertAdjacentHTML('beforeend', buttonUp);

// Initialize Footer
import footerTemplate from '../templates/7footer.hbs';
const footerMarkup = footerTemplate();
const footerRef = document.querySelector('.footer__js');
footerRef.insertAdjacentHTML('beforeend', footerMarkup);
