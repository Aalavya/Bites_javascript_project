
import icons from "url:../../img/icons.svg"; // parcel -2


export default class View {
  _data;
  /**
   * The `render` function takes in data, generates HTML markup using the data, clears the parent
   * element, and inserts the markup into the parent element.
   * @param data - The `data` parameter is the data that will be used to generate the markup for
   * rendering. It could be an object, an array, or any other data structure that contains the necessary
   * information for rendering.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  };

  // Update : only update certain part of the page 
  /* The `update` function is responsible for updating the DOM (Document Object Model) based on changes
  in the data. */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // compare the cur and new 
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update Changed TeXt
      if (!newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Update Changed Attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });


  }
  //to clear
  /**
   * The clear function clears the inner HTML of the parent element.
   */
  _clear() {
    this._parentElement.innerHTML = '';
  };

  /* The `renderSpinner` function is responsible for rendering a spinner on the page while the recipe
  data is being loaded or processed. */
  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // error Message
  /* The `renderError` function is responsible for rendering an error message on the page. It takes an
  optional `message` parameter, which defaults to the `_errorMessage` property of the class. */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
      `
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // success Message 
  /* The `renderMessage` function is responsible for rendering a success message on the page. It takes
  an optional `message` parameter, which defaults to the `_message` property of the class. */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
      `
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

}