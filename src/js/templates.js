//Подключение header'а
import headerTemplate from '../templates/1header.hbs';
const headerMarkup = headerTemplate();
const headerRef = document.querySelector('.header__js');
headerRef.insertAdjacentHTML('beforeend', headerMarkup);
