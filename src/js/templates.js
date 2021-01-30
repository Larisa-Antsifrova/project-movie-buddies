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

//Подключение header'а
import headerTemplate from '../templates/1header.hbs';
const headerMarkup = headerTemplate();
const headerRef = document.querySelector('.header__js');
headerRef.insertAdjacentHTML('beforeend', headerMarkup);

//Подключение Footer
import footerTemplate from '../templates/7footer.hbs';
const footerMarkup = footerTemplate();
const footerRef = document.querySelector('.footer__js');
footerRef.insertAdjacentHTML('beforeend', footerMarkup);

//Подключение разметки модального окна с деталями фильма
import detailTemplate from '../templates/4details.hbs';
const detailMarkup = detailTemplate();
// const detailRef = document.querySelector('.details__js');
// detailRef.insertAdjacentHTML('beforeend', detailMarkup);

// UP button
import buttonUpTemplate from '../templates/9buttonUp.hbs';
const buttonUp = buttonUpTemplate();
homeRef.insertAdjacentHTML('beforeend', buttonUp);
console.log(buttonUp, homeRef);
