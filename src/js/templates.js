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
const detailRef = document.querySelector('.details__js');
detailRef.insertAdjacentHTML('beforeend', detailMarkup);

