// Getting access to the UP button
const goTopBtn = document.querySelector('.back__to__top');

// Adding event listeners
window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);

// Function to track scroll and window height
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

// Function to scroll the page up and provide animation with the help of setTimout
function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 20);
  }
}
