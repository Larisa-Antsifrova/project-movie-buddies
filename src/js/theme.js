const togleSwitchBtn = document.querySelector('[data-action-togle]');
const mainRef = document.querySelector('main');

togleSwitchBtn.addEventListener('click', switchTheme);

function switchTheme(e) {
  if (e.target.textContent === 'brightness_6') {
    mainRef.classList.add('dark-theme');
    localStorage.setItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
  } else if (e.target.textContent === 'brightness_5') {
    mainRef.classList.remove('dark-theme');
    localStorage.removeItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_6';
  }
}

if (localStorage.getItem('Theme') === 'DARK') {
  mainRef.classList.add('dark-theme');
  togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
}