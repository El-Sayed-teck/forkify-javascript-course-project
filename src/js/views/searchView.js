/*this class is not going to render anything,
all want is to get the query  and eventually to also listen for the click event on the button*/

class SearchView {
  /*this is the html element with class search */
  _parentEl = document.querySelector('.search');

  /*let's create a method, that we then call from the controller.js */
  getQuery() {
    /*from parentEl we want to select the child elemeninput field element with class 'search_field' */
    const query =
      this._parentEl.querySelector(
        '.search__field',
      ).value; /*we get the query */
    this._clearInput(); /*we clear the field input */
    return query; /*the we return thr query */
  }

  /*a method to clear the search box, clearInput */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  /*this is method is going to be the publisher and the controlSearch function is gonna be the subscriber*/
  addhandlerSearch(handler) {
    /*here we'll listen to the submit event,
    so this will work no matter if the user clicks the sumbit button or if the user hits Enter while typing the query */
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); /**the handler shpuld be the controlSearch(), */
    });
  } /**we'll call this method in the init function */
}

export default new SearchView();
