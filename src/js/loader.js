// let hellopreloader = document.getElementById('hellopreloader_preload');

// function fadeOutnojquery(el) {
//   el.style.opacity = 1;
//   let interhellopreloader = setInterval(function () {
//     el.style.opacity = el.style.opacity - 0.05;
//     if (el.style.opacity <= 0.05) {
//       clearInterval(interhellopreloader);
//       hellopreloader.style.display = 'none';
//     }
//   }, 16);
// }

// window.addEventListener('load', () => {
//   setTimeout(fadeOutnojquery(hellopreloader), 3000);
// });

let hellopreloader = document.getElementById('loader');

function fadeOutnojquery(el) {
  el.style.opacity = 1;
  let interhellopreloader = setInterval(function () {
    el.style.opacity = el.style.opacity - 0.05;
    if (el.style.opacity <= 0.05) {
      clearInterval(interhellopreloader);
      preloader.style.display = 'none';
    }
  }, 16);
}

window.addEventListener('load', () => {
  setTimeout(fadeOutnojquery(hellopreloader), 3000);
});
