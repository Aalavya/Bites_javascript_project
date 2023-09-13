import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel-2
/* The code is defining a class called `PaginationView` that extends the `View` class. */

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            // console.log(goToPage);
            handler(goToPage);

        })
    };

    /**
     * The `_generateMarkup()` function generates the HTML markup for pagination buttons based on the
     * current page and the total number of pages.
     * @returns a string of HTML markup based on the current page and the total number of pages. The
     * returned markup includes buttons for navigating to the previous and next pages, along with the
     * corresponding page numbers. If the current page is the first page and there are more than one
     * page, only the next page button is included. If the current page is the last page and there are
     * more than one page
     */
    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );

        // Page 1 with other page 
        if (curPage === 1 && numPages > 1) {
            return `
            <button  data-goto= "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span> Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
          `;
        }
        // Last Page 
        if (curPage === numPages && numPages > 1) {
            return `
            <button  data-goto= "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${curPage - 1}  </span >
            </button > 
        `;
        }
        // Other Page
        if (curPage < numPages) {
            return `
            <button  data-goto= "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${curPage - 1}  </span >
            </button > 

            <button  data-goto= "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span> Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button> `
        }
        // Page 1 with NO other page
        return '';
    }
}

export default new PaginationView();