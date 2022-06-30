import AbstractView from '../framework/view/abstract-view';

const createFilmPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
      </div>
      <div class="film-details__bottom-container">    
      </div>
    </form>
  </section>`);

export default class FilmPopupView extends AbstractView {

  get template() {
    return createFilmPopupTemplate();
  }

  get filmDetailsContainer () {
    return this.element.querySelector('.film-details__top-container');
  }

  get filmCommentsContainer () {
    return this.element.querySelector('.film-details__bottom-container');
  }

  setCloseButtonClickHandler(callback) {
    const closePopupButton = this.element.querySelector('.film-details__close-btn');
    this._callback.closePopupButtonClick = callback;
    closePopupButton.addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupButtonClick();
  };
}
