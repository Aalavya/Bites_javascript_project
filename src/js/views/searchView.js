/* The SearchView class is responsible for getting the search query from the user and clearing the
input field. */
class SearchView {
    _parentEl = document.querySelector('.search');

    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }

    // listening to search 
    /* The `addHandlerSearch` method is adding an event listener to the `_parentEl` element (which is a
    form element with the class "search"). When the form is submitted, the event listener prevents the
    default form submission behavior (which would refresh the page) using `e.preventDefault()`. Then,
    it calls the `handler` function provided as an argument. This allows the handler function to be
    executed when the form is submitted. */
    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }

}

export default new SearchView();