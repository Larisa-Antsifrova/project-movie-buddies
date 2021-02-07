let hellopreloader = document.getElementById('loader');

function fadeOutnojquery(el) {
  el.style.opacity = 1;
  let interhellopreloader = setInterval(function () {
    el.style.opacity = el.style.opacity - 0.05;
    if (el.style.opacity <= 0.05) {
      clearInterval(interhellopreloader);
      preloader.style.display = 'none';
    }
  }, 200);
}

window.addEventListener('load', () => {
  setTimeout(fadeOutnojquery(hellopreloader), 5000);
});
