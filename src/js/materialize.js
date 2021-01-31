import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import { showDetails } from './show-details.js';
// Здесь происходит инициализация компонентов materialize'а
// Setting up materialize components

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs);
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, { edge: 'right', draggable: true });
  // activeModal = M.Modal.getInstance('#details-modal');
  // activeModal.open();
  // const detailsModal = document.getElementById('details-modal');
  // M.Modal.init(detailsModal, {
  //   onOpenEnd: e => {
  //     console.log('test event', e);
  //     showDetails(e);
  //   },
  // });
});
