import icons from 'url:../../img/icons.svg';

import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    /*we'll use event delegation becaue we have 2 buttons */
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      /*to make the button know and go to page 1 and 2 and 3 ecc, we'll get the value of the attribute data-...,
      in our case it's data-goto from the clicked button, we'll use the method dataset.goto,
      to extract the value, if we click on empty space in the parentelemnt we get null and an erro,
      because it will tru to read the data value of null, to prevent that from happenning,
      we'll use guard cloase and check of the clicked button exict or not*/
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      /*the numbers/values of dataset that we get we acn pass them into the controller,
      and with it we can finally use that number to render the result on the page UI*/
      console.log(goToPage);
      handler(goToPage); /*let's now pass that page into the handler,
      so that it can accept it in the controller.js*/
    });
  }

  _generateMarkupButton(num) {
    /*ignora per un attimo questo method */
    return `
      <button class="btn--inline pagination__btn--${num > 0 ? 'next' : 'prev'}">
      <span>Page ${num + curPage}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${num > 0 ? 'right' : 'left'}"></use>
      </svg>
    </button> `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    /*let's account for the 3 scenarions fof the 2 arrow buttons,
    we need to know how amny pages there are, let's compute that*/
    /*also how do we know the number of pages? 
    we need the numebr of results divided by the number of pages,
    so we need the number of results per page, so 60 results and 10 pages, 
    60/10=6, so we have 6 pages for these 60 results */
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    //console.log(numPages);

    // Page 1, and there are other
    /*the current page needs to be less then the numeber of pages,
    that basically means that number of pages here is greater than 1,*/
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto= "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
     </button>`;
    }

    /*we'll need the seacrh object in model.js, to figur out if we are on page 1 and/or if there are other pages */
    /*so in the current exsample we have 6 pages, and if the current page is 6,
    then that means we are on the last page*/
    // Last page
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto= "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
     </button>`;
    }
    /*being on the last page means that the current page,
    is the same as the number of pages*/

    // Other page
    /*this means the current page is less then the number of pages */
    if (curPage < numPages) {
      return `
      <button data-goto= "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
     </button>
     
       <button data-goto= "${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
     </button>`;
    }
    /* if none of these scenarions are met, then it means we're in page one */
    return ``;
  }
}
export default new PaginationView();
