/*this view is gonna be quite different from the other views,
because we already have the view in the HTML, 
the form that we want to display it's already in the code,
we ahve the element for the overlay and 'add-recipe' and they both have the hidden class.
so showing the window and the overlay is gonnabe as simple as removing this hidden class*/
/*we are interested in the 'upload' element, so we're gonna make it the parent element of AddRecipeView */
import icons from 'url:../../img/icons.svg';
import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  /*we'll also have to select some other elements,
  the window and the overlay*/
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  /*we'll also select the button that will beclicked to open the window,
  and the button to close the window */
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  /*let's add a constructor method */
  constructor() {
    /*we'll use super() because we extends to the parent view class, in view.js,
    after that we can use the this keyword form view */
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // A function to help 'this' where to point correctly
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /*let's now listen for the events of clicking, 
  for opening*/
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    /*we want to remove the hidden class in overlay and window */
    /*the is a bug, the this keyword inside of a handler function point to the elements,
       on which that listener is attached to, so in this case it this _btnOpen*/
    //this._overlay.classList.toggle('hidden');
    //this._window.classList.toggle('hidden');
    /*so to fix this we'll export this entire function into another method,
      then call that method with the correct this keyword bounded to it,
      the function will be toggleWindo with bind() to correctly bind this keyword*/
  }
  /*we want this handler function to be called as soon as the page loads,
  this has nothing to do with the controller becsue there is nothing special happening here that the controller need to tell us,
  we can run this function as soon the object is created, so we'll add a contructor method*/

  /*with bind() we manually seting the this keyword inside of this toggleWindow() function,
    now to the this keyword that we actually want it to be, so now with toggleWindow.bind(this),
    the this keyword point to the current object and not to the btn element  */

  // event for closing the window
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // A method to take care form submition
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      /*to select all the html inputs, we can select them one by one, or better we'll use form data,
        a moder browser API */
      /*into FormDate() will pass in an element that is a form,
        and so that form in this case is the this keyword,
        becasue we are inside of the handler function, and so this point to the parentElement  */
      const dataArr = [...new FormData(this)];
      /*new FormData(data) will retrun us a wird object that we can't use,
        so we'll spread it and this will give us an array thayt conatines all the field with all the values in there*/
      //console.log(data);
      /**this data we want to upload it into an api,
      and uploading the data is just gonna be another AOI call,
      these calls happen in teh model so we'll need a way of getting this data to the model,
       so for this weill need to create a controller function,
       which then will be the handler of this event*/

      /*here we'll use Object.fromEntries to convert entries array into an object */
      const data = Object.fromEntries(dataArr);

      handler(data);
      /*we got an array of arrays */
      /*now usually our recipe data is always an object not an array of entries like this,
      so in js sice ES 2019, there is a new and very handy method, that we can use to convert entries to an object,
      it's Object.fromEntries*/
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
/*in the controller we will have to import this object,
couse otherwise our main stript/controller will never execute this file,
and so then this object here will never ne created and so the eventListenr will never be added,
so we'll add it in the controller*/

/*note about FormData:

FormData in JavaScript is a built-in API that allows you to easily construct and send form data to a server, especially useful for asynchronous submissions via fetch or XMLHttpRequest.  It mimics the structure of an HTML form, enabling you to collect input values—including files—into key-value pairs. 

Creating a FormData object:
- From an HTML form: const formData = new FormData(formElement);
- From scratch: const formData = new FormData()
check link: https://search.brave.com/search?q=formdata+in+javascript&source=desktop&summary=1&conversation=08a47eebe81e0001cc866513f3c01dc7e880
*/
