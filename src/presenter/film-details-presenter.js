import FilmDetailsView from '../view/film-details-view';
import { render, replace, remove } from '../framework/render';
export default class FilmDetailsPresenter {
  static #instance = null;
  #filmData = null;

  #detailsSectionContainer = null;
  #details = null;
  #existDetails = null;

  #handleUserDetailsActions = null;

  constructor(container) {
    this.#detailsSectionContainer = container;

    if (!FilmDetailsPresenter.#instance) {
      FilmDetailsPresenter.#instance = this;
      return;
    }
    return FilmDetailsPresenter.#instance;
  }

  init = (filmData, callback) => {
    this.#filmData = filmData;
    this.#handleUserDetailsActions = callback;

    this.#renderDetails();
  };

  destroy = () => {
    remove(this.#details);
    FilmDetailsPresenter.#instance = null;
  };

  #renderDetails = () => {
    this.#existDetails = this.#details;
    this.#details = new FilmDetailsView(this.#filmData);
    this.#details.setUserDetailsControlsHandler(this.#handleUserDetailsActions);

    if (!this.#existDetails) {
      render(this.#details, this.#detailsSectionContainer);
      this.#existDetails = this.#details;
      return;
    }
    replace(this.#details, this.#existDetails);
    remove(this.#existDetails);
  };
}
