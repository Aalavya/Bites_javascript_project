import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel-2

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe Was Successfully  Uploaded!';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    // button to close and open add 
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    /**
     * The constructor function adds event handlers for showing and hiding a window.
     */
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    };

    /* The `toggleWindow()` function is a method of the `AddRecipeView` class. It is responsible for
    toggling the visibility of the overlay and the window elements. */
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    };

    /**
     * The function adds a click event handler to a button element to toggle the visibility of a
     * window.
     */
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    };

    /**
     * The function adds event listeners to the close button and overlay element to toggle the
     * visibility of a window.
     */
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))
    };

    // Upload Button
    /**
     * The `addHandlerUpload` function attaches an event listener to a form submission and converts the
     * form data into an object before passing it to a handler function.
     * @param handler - The `handler` parameter is a function that will be called when the form is
     * submitted. It takes one argument, `data`, which is an object containing the form data.
     */
    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    };

    _generateMarkup() { }
}

export default new AddRecipeView();