import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data the data to render (e.g. recipe)
   * @param {boolean} [render=true] if false create markupstrings instead of rendering to the DOM
   * @returns {undefined | string} A markup string is rendered if render=false
   * @this {Obejct} View instance
   * @autor Esraà El Sayed
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /*nota: Array.isArray() is a static method in JavaScript,
   used to determine whether a given value is an array. */

  /*Let's add an update method, to use it for many views, in many situations*/
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      // return this.renderError();
      /*joans said to remove the check for update(), but it's better to comment the error,
    tead of removing the check, we can keep it and returns immediately, rather than returning this.renderError()*/

      /*once we update the data, we want the view's data to become that new data,
    the view's data is this._data, and the new data is just data, so this._data=data*/
      this._data = data;
    /*we also want to generato some new markup,
    and it will be the entire markup as if we wanted to render a new view,
    we are gonna to update the entire markup, and for doing that we still need the entire markup,
    so that we can compare itt to the old markup basically */
    const newMarkup = this._generateMarkup();
    /*so in this new method, we'll create a new markup but we're not gonna render it,
    instead all we gonna do is to generate this Markup and thencomapre that new html to the current html,
    and then only change text and attribute that actually have changed from the old version to the new version,
    */

    /*the markup that we have right now is a string,
    so it's will be dificult to compare to the DOM elements that we urrently have on the page,
    to fix that problem we can use a nice trick, 
    we'll convert the markup string to a DOM object that's living in the memeory,
    adn we can then use to compare with the actual DOM that's on the page*/
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    /*this function will create a range, and on the range we can call yet another method,
   .createContextualFragment(), in it we'll pass a string of markup, so like a string of html,
   createContexttualFragment() will then convet that string into a real DOM node objects,
   so basically newDOM will become like a big object, which is like a virtual DOM,
   so a DOM that is not really living on the page but which lives in our memory,
   so now we can use that DOM as if it was the real DOM on our page,
   right now our newDOM is base on the newMarkup, which is the old one*/

    /*so we can do something like this*/
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElemnts);
    /*we can see all the elements that will becaonatiner inside of this newDOM element,
   that we basically craeted form generating newMarkup for the updated data*/
    /*after cliking we got all the elements in the new DOM,
   the reason for that is that this here is now basically the DOM that would be rendered on the page,
   if we simply used the render method from before*/
    /*now with this we can compare this dom to the actual dom that is really on the page,
     */
    /*in order to be able to actually do that comparison we now also need to get all the actual elements,
   that are on teh page/UI(not from the virtual dom), so let's select them all with *, and covert the nodelist into an array*/
    const curElements = Array.from(this._parentElement.querySelectorAll(`*`));
    //console.log(curElements);
    /*this is the current dom that we see in the UI */
    //console.log(newElements);
    /*and this is the new dom that we get it from createContextualFragment(newMarkup) */
    /*these two as you can see are different so we can compare themone by one*/
    /*so we are gonna loop over the newElements array with forEach(),
    and the callback is the newEl and index so that we can grap the current element,
    form curElemnts array, basially we need to loop over the 2 array at the same time*/
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      /*now how acan we compare these 2 elemnts, curEl and newEl?
      we can use a handy method that is available on all nodes, its isEqualNode()*/
      /*now we will log each iteration with this method to see,
      this method we compare the content of newEl and CurEl,
      so it doesn't have to be the exact same node, 
      all that matters is that the content in these nodes is the same*/
      //console.log(curEl, newEl.isEqualNode(curEl));
      /*with this we saw that most of our nodes are the same, so we got true, but some are diffenet so its false,
      they are false, in some containers something in them changed,
      for example the curEl is different from newEl, because curEl has 4 serving(that we see in the UI),
      and the newEl has 5 servings(that we got when we click on +)*/
      /*the same also for + and - buttons, because their data atribute would be diffenet,
      also in some parent elements, lat's use this for our advantage */

      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' &&
        newEl.firstChild?.nodeValue.trim() !== undefined
      ) {
        /*newEl.firstChild.nodeValue.trim() !== '', means that if the 1°child of newEl isn't equal to and empty space then ...,
        trim() per togliere empty spaces*/
        /*if they are not equal, 
        we want to change the textContent of the curEl(from the UI) to the textContent of newEl*/
        //console.log('💥💥', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
        /*so this will update the dom only in places where it has changed,
        or where it was about to change, remember that curEl is the one that we want to change*/
        /*what we only want to replace is the text of curEl not the whole textContent of the elememts of curEl,
        to solv this matter there is a method/property that is available on all nodes,
        it's nodeValue(), it works like this, if the value on nodevalue is and element,
        or most of ather values in teh ducumentation, will be null,
        but if it's a text then we actually get the content of the text node, and this is useful,
        so we can do this check in the () of the if-statment, we'll check the 1° child of the node,
        that will return a node, the child node is actually what conatins the text,
        so the newEl is really just an element node and not a text node, the text is the 1° child*/

        /*after all of this all the elements which don't have a text node, the nodeVale() is null,
        therefor the whole condition of if-statemnt will be false and the textContent repòacment will not take place,
        also we'll add optional chaining ?. perche non è detti che il 1° child esiste*/
        /*now after all of this, there is no flickering, because nothing is being replaced,
        except the texts, everything else is staying the same,
        however we are still not updating the attributes, 
        so for seving we are stack with 3 4 and 5, and whenever an element changes we also want to change attributs,
        not just texts when the conditions of if-statemnt is met */
      }

      // update changes attributs
      /*here we can change attributs when newEl is not equal to curEl */
      if (!newEl.isEqualNode(curEl))
        /*here we'll log the attributs properties of all the elemnts that have changed */
        // console.log(newEl.attributes);
        /*we got an object for every changed attribut,
        and we'll convert it into an array. so that we can loop over it,
        and copy from  new element to the current another */
        // console.log('💎', Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value),
          /*forEach attribute of the newEl, we want to set its name and value to the name and value of the curEl*/
        );
      /*for every curEl we want to set an attribute, we want to take it's name and it's value,
      the name and the value from the array of objects from Array.from(newEl.attributes) */
      /*what we want is take the name and the value and set it into the curEl,
      we'll replace all the attributes in the currEl by the attributs comming from the newEl,
      this will replace the current 5 with 6, also the name because of attr.name
      */
    });
  }
  /*with this we successfuly implement a method for uploading the ,
 only in places where the text or the attributes actually changed*/
  /*this algorithm is not very rubost for a big real world application,
 but it's fine for small application like this */

  _clear() {
    // console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  renderSpiner = function () {
    const markup = `
             <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>`;
    //this._parentElement.innerHTML = '';
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  /*a method to handle errors in the UI, so in the view*/
  renderError(message = this._errorMessage) {
    /*if no error passed in we'll set a default */
    const markup = `<div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /*a method to handel succesful promises/messages, the opposite of renderError() */
  renderMessage(message = this._message) {
    /*if no error passed in we'll set a default */
    const markup = `<div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
