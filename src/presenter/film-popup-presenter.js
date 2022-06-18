
import FilmDetailsPresenter from './film-details-presenter';
import FilmCommentsPresenter from './film-comments-presenter';
import FilmPopupView from '../view/film-popup-view';
import { remove, render } from '../framework/render';

const BLOCK_SCROLL_CLASS = 'hide-overflow';

export default class FilmPopupPresenter {
  static #instance = null;
  #filmData = null;
  #filmDetailsHanlers = null;
  #filmPopup = null;
  #existFilmPopup = null;
  #filmPopupContainer = null;
  #filmDetailsPresenter = null;
  #filmCommentsPresenter = null;

  constructor() {
    this.#filmPopupContainer = document.body;
    if (!FilmPopupPresenter.#instance) {
      FilmPopupPresenter.#instance = this;
      return;
    }
    return FilmPopupPresenter.#instance;
  }

  init = (filmData, callback) => {
    this.#filmData = filmData;
    this.#filmDetailsHanlers = callback;
    this.#existFilmPopup = this.#filmPopup;
    this.#renderPopup();

    this.#filmDetailsPresenter = new FilmDetailsPresenter(
      this.#filmPopup.filmDetailsContainer
    );
    this.#filmDetailsPresenter.init(this.#filmData, this.#filmDetailsHanlers);

    this.#filmCommentsPresenter = new FilmCommentsPresenter(
      this.#filmPopup.filmCommentsContainer
    );
    this.#filmCommentsPresenter.init(this.#filmData);
  };

  destroy = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#filmCommentsPresenter.destroy();
    this.#filmCommentsPresenter = null;

    this.#filmPopupContainer.classList.toggle(BLOCK_SCROLL_CLASS);
    remove(this.#filmPopup);
    FilmPopupPresenter.#instance = null;
  };

  #renderPopup = () => {
    if (!this.#existFilmPopup) {
      document.addEventListener('keydown', this.#handleEscKeydown);
      this.#filmPopup = new FilmPopupView();
      this.#filmPopup.setCloseButtonHandler(this.#handleClosePopup);
      this.#filmPopupContainer.classList.toggle(BLOCK_SCROLL_CLASS);
      render(this.#filmPopup, this.#filmPopupContainer);
      this.#existFilmPopup = this.#filmPopup;
    }
  };

  #handleClosePopup = () => {
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.destroy();
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Esc' || evt.code === 'Escape') {
      this.#handleClosePopup();
    }
  };
}
