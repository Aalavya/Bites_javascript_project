// import from files
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// imports 
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// Parcel 
// if (module.hot) {
//   module.hot.accept();
// }

// calling the api
/**
 * The function `controlRecipes` is an asynchronous function that controls the flow of loading and
 * rendering a recipe based on the ID provided in the URL hash.
 * @returns If the `id` is not truthy (i.e., it is empty or undefined), then nothing is returned and
 * the function execution stops.
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Bookmark highlighted
    bookmarksView.update(model.state.bookmarks);

    //1) Udate Result View To Mark Selected 
    resultsView.update(model.getSearchResultPage());

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Calling Search
/**
 * The function `controlSearchResults` is responsible for handling the search functionality, including
 * getting the search query, loading the search results, rendering the results and pagination, and
 * handling any errors.
 * @returns If the query is empty, nothing is returned. Otherwise, the search results are rendered and
 * the pagination is rendered.
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;
    // Load Search Results
    await model.loadSearchResults(query);

    // 3) Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4) Render The Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Pagination Controller 
/**
 * The controlPagination function renders new page results and updates the pagination.
 * @param goToPage - The `goToPage` parameter is the page number that the user wants to navigate to. It
 * is used to determine which page of search results to display and which pagination to render.
 */
const controlPagination = function (goToPage) {
  // 1) Render New Page Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 4) Render New Pagination
  paginationView.render(model.state.search);
};

// Controlling the recipe serving 
/**
 * The controlServings function updates the recipe serving size and updates the recipe view.
 * @param newServings - The new number of servings for the recipe.
 */
const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// For BookMark
/**
 * The controlAddBookmark function adds or removes a bookmark for a recipe, updates the recipe view,
 * and renders the bookmarks.
 */
const controlAddBookmark = function () {
  // Add or Remove BookMark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render The BookMarks
  bookmarksView.render(model.state.bookmarks);
};

// show bookmark after refresh
/**
 * The controlBookmarks function renders the bookmarks in the model state.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// controller for upload
/**
 * The `controlAddRecipe` function handles the process of adding a new recipe, including uploading the
 * recipe data, rendering the recipe view, displaying success messages, rendering bookmarks, changing
 * the URL, and closing the form window.
 * @param newRecipe - The `newRecipe` parameter is an object that represents the new recipe to be
 * added. It contains the following properties:
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Showing Spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);
    // success Message 
    addRecipeView.renderMessage();

    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URl
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error('🔥🔥🔥💣', err);
    addRecipeView.renderError(err.message);
  }
};


/**
 * The `init` function initializes the application by adding event handlers to various views and
 * calling their respective control functions.
 */

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();