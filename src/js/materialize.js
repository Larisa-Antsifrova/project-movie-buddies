import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import { innerModalRef } from './show-details.js';

// Setting up materialize components

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs);

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, { edge: 'right', draggable: true });

  const detailsModal = document.getElementById('details-modal');
  M.Modal.init(detailsModal, {
    onCloseEnd: () => {
      innerModalRef.innerHTML = '';
    },
  });
});
