/*this file is gonna be the parent of resultView.js and bookmarksView.js,
this file wuill generate one 'preview' element like the one on the returned markup*/
/*this previewView.js will generate markup for one of these 'perview elements */

import icons from 'url:../../img/icons.svg';

import View from './view.js';

class PreviewView extends View {
  _parentElement = '';

  /*we want to mark the link of the selected recipe,
  the sected recipe mut have a css class,
  we'll do this by checking the id of the selected recipe */

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
            <a class="preview__link ${this._data.id === id ? 'preview__link--active' : ''}" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>               
              
               <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
                  <svg>
                   <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>  
            </a>
          </li>`;
  }
}
export default new PreviewView();
