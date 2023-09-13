import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
/* The code `export const state = {...}` is creating an object called `state` that stores the current
state of the application. It has three properties: */
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

// converting the data into machine readable type
/**
 * The function `createRecipeObject` takes in a data object and returns a new object with specific
 * properties extracted from the `recipe` property of the data object.
 * @param data - The `data` parameter is an object that contains the recipe data.
 * @returns The function `createRecipeObject` returns an object with the following properties:
 */
const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
};

// load Recipe Function
export const loadRecipe = async function (id) {
    try {
        /* This code is responsible for loading a specific recipe based on its ID. */
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        // 1) just showing recipe
        /* This code is responsible for setting the `state.recipe` object with the recipe data obtained
        from the API response. */
        state.recipe = createRecipeObject(data);
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        console.error(`${err} 💣💣💣 `);
        throw err;
    }
};

// Searching Function
export const loadSearchResults = async function (query) {
    try {
        /* The code is updating the `state.search.query` property with the value of the `query`
    parameter. It then makes an AJAX request to the API URL with the provided search query and
    API key. The response data is stored in the `data` variable. */

        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        // console.log(data);

        /* This code is updating the `state.search.results` array with the search results obtained from
        the API response. It maps over each recipe object in the `data.data.recipes` array and
        creates a new object with the desired properties (`id`, `title`, `publisher`, `image`). */
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            };
        });
        state.search.page = 1;
    } catch (err) {
        console.error(`${err} 💣💣💣 `);
        throw err;
    }
};

// Pagination 
/**
 * The function `getSearchResultPage` returns a subset of search results based on the specified page
 * number.
 * @param [page] - The `page` parameter is used to specify the page number of the search results to
 * retrieve. It has a default value of `state.search.page`, which means if no value is provided for
 * `page`, it will use the current page number stored in the `state.search.page` variable.
 * @returns a portion of the search results array based on the current page number and the number of
 * results per page.
 */
export const getSearchResultPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;//0;
    const end = page * state.search.resultsPerPage; //9;
    return state.search.results.slice(start, end);
};

// Updating the servings 
/**
 * The function updates the quantity of ingredients in a recipe based on the new number of servings.
 * @param newServings - The `newServings` parameter is the desired number of servings for the recipe.
 */
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

// Hold BookMarks
const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
// BookMark
export const addBookmark = function (recipe) {
    // Add Bookmark to the list
    state.bookmarks.push(recipe);

    // Show bookmark to current recipe 
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();

};

// Delete BookMark
export const deleteBookmark = function (id) {
    // Remove from Bookmark List
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Remove bookmark from the  current recipe 
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

// showing bookmarks after refresh
const init = function () {
    /* The code is retrieving the bookmarks data from the local storage. */
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// debugging 
const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};
// clearBookmarks();

// add new recipe
export const uploadRecipe = async function (newRecipe) {
    try {
        /* The code is extracting the ingredients from the `newRecipe` object and converting them into
        an array of objects. */
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3) throw new Error('Wrong Format! Please Use Correct Format:)');
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });

        /* The code is creating a `recipe` object using the `newRecipe` data provided. It assigns the
        `title`, `source_url`, `image_url`, `publisher`, `cooking_time`, and `servings` properties
        from the `newRecipe` object to the corresponding properties in the `recipe` object. */
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        /* This code is making an AJAX request to the API URL with the provided recipe data and API
        key. It then creates a recipe object using the response data and adds it to the state.
        Finally, it adds the recipe to the bookmarks list. */
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;

    }
};