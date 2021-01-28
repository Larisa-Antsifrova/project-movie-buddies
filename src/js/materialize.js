import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
// Здесь происходит инициализация компонентов materialize'а
// Setting up materialize components
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll(".tabs");
  M.Tabs.init(tabs);
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});
