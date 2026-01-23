/*this is going to be very similar to recipeView.js */
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view.js';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet, find a nicd recipe and bookmark it ;)`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    console.log(this._data);

    /*in map() we want to loop over this._data, which is still all of the bookmarks,
    but now what we want to do here is to call basically this generate markup in previewView.js,
    but wouldn't really work, instead ww'll use this 'bookmark' */
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    /*so for each of the bookmark we want to render a perview, but here we want to return a string,
    that should return from the generateMarkup(), so that in the view.js,
    in render() it can insert that markUp into the DOM, 
    however by having a render here, previewView.js itself will try to render some markup,
    and that is not going to work, so we'll change render() and a second parameter to it,
    it's 'render' and setted to true by default*/
    /*why don't we simpley call generated markup itself without messing with the whole render()?,
 so here in bookingmarksView.js, why don't we simply call 'previewView.generate.markup'?
  becasue we still need it to set the _data property to the data that we pass in render(),
  so that in previewView.js we can use this keyword*/
    /*we want to render this._data of previewView and set the render() parameter to false */
  }
}
export default new BookmarkView();
