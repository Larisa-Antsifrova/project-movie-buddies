// КНОПКА ВВЕРХ получение доступа и логика
const goTopBtn = document.querySelector('.back__to__top');

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);

// функция получения скролла страници и получние высоты одного экрана
function trackScroll() {
  const scrolled = window.pageYOffset;

  const coords = document.documentElement.clientHeight;
  if (scrolled > coords) {
    goTopBtn.classList.add('back__to__top-show');
  }
  if (scrolled < coords) {
    goTopBtn.classList.remove('back__to__top-show');
  }
}
// функция скролла вверх и ацнимация с помощью setTimout
function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 20);
  }
}
