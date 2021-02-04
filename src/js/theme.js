const togleSwitchBtn = document.querySelector('[data-action-togle]');
const mainRef = document.querySelector('main');
const footerRef = document.querySelector('.site-footer');
const headerRef = document.querySelector('header');
const bodyRef = document.querySelector('body');
togleSwitchBtn.addEventListener('click', switchTheme);

function switchTheme(e) {
  if (e.target.textContent === 'brightness_6') {
    mainRef.classList.add('dark-theme');
    footerRef.classList.add('dark-theme');
    headerRef.classList.add('dark-theme');
    bodyRef.classList.add('dark-theme');
    localStorage.setItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
  } else if (e.target.textContent === 'brightness_5') {
    mainRef.classList.remove('dark-theme');
    footerRef.classList.remove('dark-theme');
    headerRef.classList.remove('dark-theme');
    bodyRef.classList.remove('dark-theme');
    localStorage.removeItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_6';
  }
}

if (localStorage.getItem('Theme') === 'DARK') {
  mainRef.classList.add('dark-theme');
  footerRef.classList.add('dark-theme');
  headerRef.classList.add('dark-theme');
  bodyRef.classList.add('dark-theme');
  togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
}
