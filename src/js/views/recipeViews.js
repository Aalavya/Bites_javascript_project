// import
import icons from "url:../../img/icons.svg"; // parcel -2
import View from './View.js';
// import { Fraction } from "fractional";
import fracty from 'fracty';
import { async } from 'regenerator-runtime';
/* The RecipeView class is a subclass of the View class in JavaScript that handles rendering and
displaying recipe information on a webpage. */

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = 'We could not find the Recipe. Please try another one!';
  _message = '';
  // Listening for load and hashing events
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, handler)
    );
  };
  /**
   * The function adds an event listener to the parent element that listens for clicks on a button with
   * the class 'btn--update-servings', and if the button has a 'data-updateTo' attribute with a positive
   * value, it calls the provided handler function with that value.
   * @param handler - The `handler` parameter is a function that will be called when the event is
   * triggered. It takes one argument, which is the value of `updateTo` from the clicked button's
   * dataset.
   * @returns Nothing is being returned in this code snippet.
   */

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  };

  // BookMark
  /**
   * The addHandlerAddBookmark function adds a click event listener to the parent element and calls the
   * provided handler function when a button with the class 'btn--bookmark' is clicked.
   * @param handler - The `handler` parameter is a function that will be executed when the bookmark
   * button is clicked.
   * @returns There is no explicit return statement in the code snippet provided. Therefore, the
   * function does not return anything.
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  };

  /* The `_generateMarkup()` function is responsible for generating the HTML markup for the recipe
  view. It uses the data stored in the `this._data` property to dynamically insert values into the
  markup. The generated markup includes the recipe image, title, cooking time, servings, ingredient
  list, directions, and other details. The function also calls the `_generateMarkupIngredient()`
  function to generate the HTML markup for each ingredient in the recipe. */

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title
      }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime
      }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings
      }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1
      }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1
      }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''
      }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher
      }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  };

  /* The `_generateMarkupIngredient` function is responsible for generating the HTML markup for each
  ingredient in the recipe. It takes an `ing` parameter, which represents an ingredient object, and
  returns a string of HTML markup that represents that ingredient. The markup includes an SVG icon,
  the quantity (if available), the unit, and the description of the ingredient. */
  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
  };
};
export default new RecipeView();
