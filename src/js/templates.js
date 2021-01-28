import headerTemplate from '../templates/1header.hbs';
import homeTemplate from '../templates/2home.hbs';

const inputMarkup = homeTemplate();
const headerMarkup = headerTemplate();

const homeRef = document.querySelector('.home__js');
const headerRef = document.querySelector('.header__js');

homeRef.insertAdjacentHTML('beforeend', inputMarkup);
headerRef.insertAdjacentHTML('beforeend', headerMarkup);
