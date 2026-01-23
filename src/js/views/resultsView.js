/*this is going to be very similar to recipeView.js */
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! please try again`;
  _message = '';

  _generateMarkup() {
    console.log(this._data);

    /*in map() we want to loop over this._data, which is still all of the bookmarks,
      but now what we want to do here is to call basically this generate markup in previewView.js,
      but wouldn't really work, instead ww'll use this 'bookmark' */
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
