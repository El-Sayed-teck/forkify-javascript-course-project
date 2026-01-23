import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationsView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//import icons from '../img/icons.svg'; // parcel1
//import icons from 'url:../img/icons.svg'; // parcel2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
//import { async } from 'regenerator-runtime/runtime';

/*if (module.hot) {
  module.hot.accept();
}

//const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// Lecture 300
//console.log('prova');
//console.log(window.location); /*it's an object, it's the entire URL */

const controllRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    /*we'll check if there is id or not becasue, because without id we'll get an error*/
    if (!id) return;

    recipeView.renderSpiner();

    // 0) Update results views to mark selected search result
    //resultsView.render(model.getSearchResultsPage());
    /*render will do the same as update, but there will be a flicker,
    thats why i used update */
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarksview
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    /*https://forkify-api.jonas.io/api/v2/recipes,
     this path will takes us to all the recipes there are for a cartian search query */

    // 3) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    //console.log(err);
    /*her we'll handle the error to the UI,
    we'll call the method renderError(message) from recipe.view,
    but where are we gonna get 'messege' from? to have the message we'll have to re throw it in the catch block in model.js*/
    recipeView.renderError();
    console.error(err);
  }
};
//controllRecipes();

// lecture 308
/*let's create a new fucntion, a new controller to call async function loadSearchResults()*/
const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();
    console.log(resultsView);
    /*the prototype of resultView is the class View in view.js */

    // 1) get search query
    /*here we'll get the query */
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    /*in it we'll passe a query,
    also we don't store the result into a variabel, becasue this function doesn't return anything,
    all it does is to manipulate the state */
    //await model.loadSearchResults('pizza');
    /*we used 'pizza' as an example, but we wantto get the query from the input field,
    and the search will happen after we clicked on the search button, so we'll create a view for this search part,
    the new view will give us the content of the search view, something that shoul be in the dom, so in a view and not in  the controller */
    await model.loadSearchResults(query);
    /*this method will handle the query that is returnd from getQuery method */

    // 3) render results
    // console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    /*at the start we wanted all the results, but now we want some of the results */
    resultsView.render(model.getSearchResultsPage());
    /*let's say we want to start from page1, now 1 became the default page number if we don't entering any number */
    //resultsView.render(model.getSearchResultsPage(1));
    /*the was a small bug, that doesn't reset the number of pages when we do a not 1°search,
    we could have put 1 to this function and it's still works(for comment solution),
    but jonas decided to fix the bug in the loadRecipe(), in modal.js */

    // 4) Render initial pagination buttons
    /*in this fucntion we'll pass in the entire search object */
    paginationsView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/*let's create a new controller, that will be excuted whenever one of the 2 arrow button is clicked */
const controlPagination = function (goToPage) {
  //console.log(goToPage);

  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  /*the method render() will work because it will overwrite the markup that was there previously,
  because it has the clear(), so before any new HTML is insterted into the page,
  the parentElements is first cleared/emptied, taht means that render overwrite everything that was there first,
  and puts the new content in the same place*/

  // Render NEW pagination buttons
  paginationsView.render(model.state.search);
};

/*this function will controllo, la quantita di porzioni, e cambiando la quantita di ingredienti per un tot di porzioni */
const controlServings = function (newServings) {
  // Update the recipe servings
  /*updating the erving in the state has ofcourse to do with the model.js */
  model.updateServings(newServings);
  // Update the recipeView
  /*now what we'll do is overwrite the complete recipe,
  basically we will render it again */
  //recipeView.render(model.state.recipe);

  /* here we want to call the update method, al posto di render menthod,
  this new method will still need al the data like the render method */
  recipeView.update(model.state.recipe);
};

/*let's add controller for adding new bookmark and remove it, when w click again*/
/*we can call this function with and eventlistener */
const controlAddBookmark = function () {
  // 1) Add/Remove bookmarks
  /*we want to add a bookmark when the recipe is not bookmarked, so let's do a check*/
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deteleBookmarks(model.state.recipe.id);

  // 2) Update recipeView
  // model.addBookmark(model.state.recipe);
  console.log(model.state.bookmarks);
  /*it gives us the object recipe, bookmarked is set to true */
  /*after the book mark is done we'll update the recipe with update() */
  recipeView.update(model.state.recipe);

  // 3) Rendering bookmarks
  /*the bookmarked recipes are add and rendered to the bookmark panel */
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Function to help making api calles
const controlAddRecipe = async function (newRecipe) {
  //console.log(newRecipe);
  /*newRecipe is the 'const dataArr' in the addHandlerUpload function,
  so from 'newFormData'*/
  /*this data now newRecipe give ua an arra of arrays */
  /*now thanks to Object.fromEntries(dataArr) we got the dataArr converted to an object,
  it misses come data like the id, but we'll take care of that in the model.js */

  try {
    // Show loading spinner
    addRecipeView.renderSpiner();

    //  function to upload the new recipe data
    await model.uploadRecipe(newRecipe);
    /*if some error occurs in this function,
  then it goes to the catch block  */
    console.log(model.state.recipe);

    // Render the uploaded recipe
    recipeView.render(model.state.recipe);

    // Seccess Message
    addRecipeView.renderMessage();

    // Render the bookmark view
    /*we don't use update because we want to insert a new element and not re-render it */
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addhandlerSearch(controlSearchResults);
  paginationsView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome from git');
};
init();
