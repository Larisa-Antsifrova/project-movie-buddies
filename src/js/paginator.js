import paginationTemplate from '../templates/8pagination.hbs';
import { Api } from './movieApi';
import { toggleRenderPage } from './fetch-functions.js';

export default class PaginationApi {
  constructor(maxPageRadius = 2) {
    this.refs = {
      pagination: document.querySelector('.pagination-container'),
    };
    this.currentPage = 1;
    this.totalPages = 0;
    this.maxPageRadius = maxPageRadius;

    this.refs.pagination.addEventListener(
      'click',
      this.onPaginationClick.bind(this),
    );
  }

  recalculate(currentPage, totalPages) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;

    Api.pageNumber = currentPage; // hack
    Api.totalPages = totalPages;

    const startPage = Math.max(
      1,
      Math.min(
        this.currentPage - this.maxPageRadius,
        this.totalPages - 2 * this.maxPageRadius,
      ),
    );
    const endPage = Math.min(
      this.totalPages,
      startPage + 2 * this.maxPageRadius,
    );
    let pages = [];
    for (let i = startPage; i <= endPage; ++i) {
      pages.push({ idx: i, active: i == this.currentPage ? 'active' : '' });
    }

    this.refs.pagination.innerHTML = paginationTemplate({
      left: this.currentPage === 1 ? 'disabled' : '',
      right: this.currentPage === this.totalPages ? 'disabled' : '',
      pages: pages,
    });
  }

  onPaginationClick(e) {
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
      return;
    }

    if (e.target.hasAttribute('disabled')) {
      return;
    }

    if (
      e.target.nodeName === 'A' &&
      e.target.classList.contains('paginator-page-item')
    ) {
      Api.pageNumber = +e.target.dataset.page;
    }

    if (e.target.textContent === 'first_page') {
      Api.pageNumber = 1;
    }

    if (e.target.textContent === 'chevron_left') {
      Api.pageNumber -= 1;
    }

    if (e.target.textContent === 'last_page') {
      Api.pageNumber = this.totalPages;
    }

    if (
      e.target.textContent === 'chevron_right') {
      Api.pageNumber += 1;
    }

    toggleRenderPage();
  }
}
