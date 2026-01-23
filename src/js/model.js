import { API_URL, RES_PER_PAGE, KEY } from './config.js';
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  /*the state constines all data that we need in order to build our application,
   and all the data about the application might also include the search query itself,
  son in search:{} we'll specify the query, which start with an empty string and then results that will start as an empty arary */
  recipe: {},
  search: {
    query: '' /*it will the input that will do the search, 
    in the search box on the webside */,
    /*the query, we might need it in the future, if we want tp add analitics,
    to know whivh querries are made the most */
    results: [],
    page: 1 /*we'll set page to 1 by default */,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
}; /*This will export an object with a recipe property that is itself an empty object.
so state is an object itself, that has anothe object, so state ={recipe: {something}}*/
//console.log(state.search);

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    /*recipe is gonna be manipulated by the function const state */
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    /*here it says if recipe.key is a falcy value, so doen't exist, 
    then nothing happens here, so then the destructuring with ... does nothing,
    but if it's some value then the second part of the operator is executed and returned,
    and so in that case, its this object {key: recipe.key} is going to be returned,
    so that ...(recipe.key && {key: recipe.key}) will become that whole object and then we can spread that object ti put the ley value here,
    and this would be the same if tha value vas wroye like this: 
    key: recipe.key, but only in case the key does exist*/
  };
};

export const loadRecipe = async function (id) {
  /*we have this async loadRecipe function calling another async function ( getJSON)*/
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    /*here we'll check if there is aleady a recipe with the same IO in the bookmarks state,
    and if it is then we will mark the current recipe,
    then we'll mark the current recipe that we just loaded from the API as bookmarked set to true,
    */
    /*so let's use the some(), it return true or false, so it's great to do an if check,
   the methoe will loop in the array and we return true if any of the condition that we set is true */
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      /*so check if the id of of any bookmark is the same as the id that we recived,
  then we want the current recipe bookmarked as true*/
      state.recipe.bookmarked = true;
    else {
      /*otherwise we want it set to false */
      state.recipe.bookmarked = false;
    }
    /*now with this all the recipes that we have will bookmarked set to be either set to true or false,
    now we actaully used this state.bookmarks fro anyting meanigful,
    up antil now we stored the recipe in the bookmarks array, but it wasn't useful,
    but now here we basically use this array, in order to store all the bookmarks,
    so that when we come back to one of them, we can then mark the recipe as being bookmarked,
    */
  } catch (err) {
    // temporary error handling
    console.error(`${err} 💥💥💥`);
    /*this is error is going to occure in the getJSON() in helpers.js,
    and not here in model.js, but this is not what we want, we want to handle it in model.js ,
    for this we have to re throw the error in helpers.js*/
    /*with this the promise that's being returned from getJSON will actually reject,
    now we'll be able handle the error right here in model.js*/

    /*so basically that's how we propagated the error down from one async function to the other,
     by re-throwing the error in helper.js*/

    //Leture 307
    /*now we want to handle the error into the view,
    now model.js and recipeView.js is connected by controller.js,
    so it's going to be the controller who will call recipeView*/

    /*now we'll re-thow the error to have access to message in recipeView.renderError(),
    and with this we would have access to the exact same error object inthe console.error()*/
    throw err;
    /*note: we needed to throw that error so that that teh failed promise get from a failed fecth() would be rejected,
    after the error was thrown, it was handled in the catch block in controller.js*/
    /*with this the error that getJSON cought(failed fetch = failed promise) in it's catch block it's re-thrown againg,
    and it's then handled in the catch block of controller.js, which then handles it bu calling the function renderError() from recipeVie,
    which then renders it on the UI/webpage, so that the user can see it,
    by the way this failed fetch, so rejected promise comes from a wrong id, so if the id doesn't exist, or the api is down */
  }
};

// Lecture 308: implementing search functionality
/*we'll create a funtcion that can be exported and used by the controller,
this function is gonna perform ajax calls, so it's gonna be an async function,
this function is gonna be called by the controller, it's the controller.js who will tell this fucntion what it would actually searcg for,
so it will pass in a query like string, which we can then pluck into our API call*/
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    /*we'll use the getJSON to fetch the data and convert it to JSON, and create an error is something went wrong  */
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    /*let's now log that data to the console to take a look at it,*/
    console.log(data);
    /*the result that we get is the data object, that has another data object,
    which then has a recipe's property which is an array, and this array has all the data about the ingredients,
    each of the ingredients is an object itself, so let's take this data and store it in our state,
    we'll create a new object based on this data, let's loop over the array recipe to creata an obejct for it,
    we'll use map() to loop and the return an new array with a new object based made for the data.data.recipe array*/
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    }); /*we'll store this array with object in our state in the results array son state.search.results */
    //console.log(state.search.results); /*we got the object of data  */

    state.search.page = 1;
    /*this is important, because after we doing and changing the pages of a 1°search result,
    when we do a 2° seach, the page number is not resetted, it stayes at the same page number,
    so the state.search.page is non updated when we do a not 1°search, so with state.search.page = 1;
    we reset the page number back to 1 when we do a not 1°search*/
  } catch (err) {
    /*for handling errors, we'll do the same as above, 
    re-throwing the error so that it can be handled in the catchblock of controller.js */
    console.error(`${err} 💥💥💥`);
    throw err;
  }
}; /*we want now to call this fucntion in the controller,js*/
//loadSearchResults('pizza');

/// A function to render the page, to make it show 10 results alla volta
/*this function is not going to be an async function,
because we already have the search results loaded at this point, when we call this function*/
/*we want this function to reach into this state and then get the data for the page that is being requested,
 */
export const getSearchResultsPage = function (page = state.search.page) {
  /*now if we don't pass any thing into the page, then the page w'll be set by default to 1*/
  /*what we'll return is a part of the results, so w'll use slice(),
  so for the 1°page we would like to return from result 1 to result 10*/
  /*we can canculate the arguments in slice() based on the page,
  we'll set a start varaible to set the start and , end variable to set the end, 
  we wan tto calculate them dynamically, how can we do that?
  we can take the page then -1, then * by the amonut of results that we want on the page*/
  //const start = (page - 1) * 10;
  /*let's say that we requasted page1v, 1-1 =0, 0 * 10 = 0, just as we wanted because results it's zero-based array */
  /*when page is 2, 2-1 = 1, 1*10 = 10 results'elements*/

  //const end = page * 10;
  /*here at the end page1*10 = 10, we'll extract 10 results elememnts*/

  /*this imapagination data can be factured and then put in the state so,
   */

  /*we'll have to store the pages numbers to use in our application,
  it's good to know that in any point of time we can know in our application on which page we currently are in the earch results*/
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  /*so we would like to start at a certain point and end at a certain point */
  return state.search.results.slice(start, end);
};

/*a function to implememt updating the serving, so the recipes nd their quantity,
this fucntion will rearch into the state, inparticular into the recipe ingredients,
and then change the quantity in each ingredient for how amny serving we insert in the UI,
so in the end we'll manipulate the ingredients array*/
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity =
      // new quantity = old quantity * newServing / old servings -> example: 2 * 8/4 = 4
      /*so if we double the servings we double then we need to double the quantity*/
      (ing.quantity * newServings) / state.recipe.servings;
  });
  /*with this we're changing all the ingredients, 
  and we also need to update the servings in the state,
  because otherwise, if we tried to update ther servings twice,
  then by the 2° time we would still be using the old value of two servings(state.recipe.servings),
  so ofcourse we need to update this value*/
  state.recipe.servings = newServings;
  /*with this the old servings become the now one, so it's preservsed */
  /*all of this works because we have the recipe in the state */
};
/*nota: in order for this function to work without any error,
keep in mind the the asyncronous nature of fetch(), to take recipes from,
we can't updating old recipes if they haven't been uploaded yet, we'll get an error,
so it's better to call this function in the controller.js AFTER the data of the old recipe was loaded */
/*right now we made a addeventListener in recipeView.js, that will make the user increase serving after the data of recipe was uploaded */

///////
/*for lecture 317 */
/*when we add a bookmark or delete it, we want that data to persist,
so we'll add a function which we can then call in these 2 add and delete bookmarks functions */

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Bookmark function

/*this function will recive a recipe, and then it will set it as a bookmark,
we'll the update the bookMark array in the state,
we also want to mark the current recipe as being bookmarked, 
so atleast if the current recipe is the same as the onme in the function parameter, 
that we are adding in thh array*/
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  /*this will allow us to display the current recipe as bookmarked in the recipe view,
  so we'll check if the inserted recipe.id is equal to the id of the current recipe,
  so the one that is currently loaded in our application, 
  if so, then we'll set a new property for the inserted recipe object */
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
/*we can now use the data that is stored in the bookmark array,
is basically mark any recipe that we loaded as bookmarked if it's already in the bookmarks array,
to basically mark any recipe that we load as bookmarked if it's already in the bookmarks array,
*/

// delete bookmark function

/*now when we click on the button we want to unbook the bookmark, 
so remove it from the bookmarks array, so we'll need a new function for this, to remove the bookmark */
/*the function will use an id, this a common patern in programming becasue that is actually simpler,
when we add something we get the entire data(recipe in this case),
and when we want to delete something, we only get the ID */
export const deteleBookmarks = function (id) {
  // DElete bookmark
  /*what we ant to do is to delete the recipe that has this id from the bookmarks array,
  so will use the splice(), in it we'll need the index(that we need to calculate) where the element is located,
  that we want to delete, and how amny items we want to delete, which is 1*/
  /**to calculate the index, we'll use findIndex() method */
  const index = state.bookmarks.findIndex(el => el.id === id);
  /*here we are looking for the element which has the ID equal to the ID that was passed in,
  so there is going to be one bookmark for which this condition here is true,
  so where the current bookmark.id is equal to this ID, so for this element where this condition is true,
  the index will be returned, and then we can take this index and delete from the array*/
  state.bookmarks.splice(index, 1);

  // Mark
  /*after this we'll mark the current recipe as not a book mark anymore*/
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/*let's code for taking the bookmarks out of the storage, so the opposite of persistBookmarks(),
for this we'll start with an initialisation function ,
in this function we'll do the opposite of setitems, we'll get them from the localstorage*/
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  /*getItem() will take the data converted to string out of the localstorage */
  if (storage) state.bookmarks = JSON.parse(storage);
  /*if there is something in localstorage/if storage exist, then convert it back to an object and set it in state.bookmarks*/
};
init();
//console.log(state.bookmarks);

/*let's a quick function for debuggin */
/*it's a functions that at some point we might want to call,
but only during development */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
/*this function by default would be turned off otherwise it'll not clear the bookmark array */
//clearBookmarks();
/*if you wish to call this function, comment init() above, then you can use it */

// Function to upload data/recipe into the api
/*this function will make a request to the api,
so it's gonna be an async function and it'll recipe the new data for the new recipe*/
export const uploadRecipe = async function (newRecipe) {
  try {
    /*the 1° task is to take the raw input data form the UI(added by the user) and trasfrom it into the same format as the data,
  that we also get out of the API */
    /*we got the data from addRecipeView.js,
  but we want it to oragnize them a little better, separating the quantity and ingredients,
  and put them all into objects, like the recipie that we get from data from the API */

    // taking raw input data
    /*let's create an array of ingredients,
  for this we'll use map method, we'll create new arrays base on some existing data,
  to get the arrays we'll use objects with Object.entries(),
   which is the opposite of Object.fromEntries(), because it convert objects into a pair of arrays*/
    /*we'll also use fiter, because we just want ingredient 1 2 3 until 6*/
    const ingredients = Object.entries(newRecipe)
      /*let's see this data without filter() */
      //console.log(Object.entries(newRecipe))
      /*we got an arrar of arrays, they are pairs, thanks to Object.entries() */
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      /* we'll filter this array, each element in filter() is an array itself,
  it's an entries, we'll filter the first elements that starts with ingredients,
  and the 2° parte of the last elements shouldn't be empty,
  we'll also use startWith() string method */

      /*nota su startsWith(): .startsWith() is a JavaScript method that checks,
   whether a string begins with a specified substring.  
  It returns true if the string starts with the given characters, otherwise false. */
      /*so in the end in filter() the first element should starts with 'ingredient' and the 2° shoudn't be an empty string*/
      //console.log(ingredient);
      /*we got what we were looking for now,now all we need to do is to basically take the data out of the string,
  and then put that into an object,
   for that we'll fianlly use the map(),
   in map() we'll use replaceAll('') to replace white space with an empty string in the 2° element of the array, and split(',') to split each ingredient by comma,
   that's a separator*/
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        /*we'll use a different aproch, we'll split the string into multiple parts,
        which will the return an array, them we'll loop over it and trim each of the elements*/
        const ingArr = ing[1].split(',').map(el => el.trim());
        /*we need thischeck because the ingredient input want 3 thing,
      and if the use gice only one, in the 3 objects some properties get empty spaces,
      to fix that we throw an error if the the lenght of the input array is less then 3 */
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, please use the correct format',
          );

        /*after this the function will immedediatlty exit,
        we want to use this thrown error to render an error in the view, to the addRecipeView
        we can do that in teh contriller in controlAddRecipe, by using try and catch*/
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    /*all of this should return an array of 3 element, so let's destruct it with const[quantity, unit, description],
  then we'll return an object with the decintructed array's elemnts into variable as object properties,
  after this we want to some properties that are empty to be null, otherwithe it's atually a number,
  for this we'll use a ternary operator, so if there is a quantity then convert that to a number,
  and if not (which is this situation, we have an empty string), then we want to return null */

    console.log(ingredients);
    /*infact we got an array of three objects */

    /*let's now create the object to be uploaded,
  it will be the opposite of recipe in loadRecipe function,
  because in the 2° we'll send data, note recive it */
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //console.log(recipe);
    /*so it looks great and it can be sent to our API*/
    /*we had a method for getting json getJSON,
    now we'll create the method for sending JSON in helpers.js*/
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    /*we not only need the api url, but also the api key, ican get it in the documentation,
    and i can see the instruction on how to add it in the url
    the key is store in config.js, we'll also add recipe from const recipe in loadRecipe,
    because sendJSON ha 2 parameters the url and the data to JSON.strigify() */
    /*this sendJSON() will send the recipe back to us, solet's store that */
    console.log(data);
    /*the data that we get we want to render it in the UI after closing the addRecipe pannel,
    so we'll need to conver that in teh format in our application*/
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

/*nota su Object.entries():
converts an object into an array of key-value pairs (as two-element arrays). 
It returns only own, enumerable properties with string keys, 
ignoring inherited properties and symbol keys.

const obj = { name: 'Alice', age: 30 };
console.log(Object.entries(obj)); // [['name', 'Alice'], ['age', 30]]   

///////////

Object.fromEntries():
does the reverse: it takes an iterable (like an array or Map) of key-value pairs,
and returns a new object. It can handle both string and symbol keys, unlike Object.entries().
This makes it useful for reconstructing objects from transformed arrays or converting Maps back to plain objects.

const entries = [['name', 'Alice'], ['age', 30]];
console.log(Object.fromEntries(entries)); // { name: 'Alice', age: 30 }   

//////
Key differences:

Object.entries() → object → array of pairs.
Object.fromEntries() → array/Map of pairs → object.
Object.fromEntries() supports symbol keys, while Object.entries() does not.
Both methods are not destructive—they return new objects/arrays without modifying the original. 
These methods are especially useful for transforming objects using array methods like filter, 
map, or reduce while preserving the object structure at the end. 
*/
