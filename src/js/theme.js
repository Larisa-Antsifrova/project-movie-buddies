const checkBtnRef = document.querySelector('#theme-switch-toggle');
const bodyRef = document.querySelector('body');

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};


function updateThemeLS() {
  if (localStorage.setting === Theme.DARK) {
    bodyRef.classList.add(Theme.DARK);
    checkBtnRef.checked = true;
  } else {
    bodyRef.classList.add(Theme.LIGHT);
  }
}

function changeTheme(e) {
  bodyRef.classList.toggle(Theme.LIGHT);
  bodyRef.classList.toggle(Theme.DARK);
  if (!e.target.checked) {
    localStorage.setItem('setting', Theme.LIGHT);
  } else {
    localStorage.setItem('setting', Theme.DARK);
  }
}


updateThemeLS();
checkBtnRef.addEventListener('change', changeTheme);