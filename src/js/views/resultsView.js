import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel-2

/* The code is defining a class called `ResultsView` that extends the `View` class. */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Recipe Not Found, Please Try Again :)';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');

  }

}

export default new ResultsView();