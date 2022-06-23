
import FilmsModel from '../model/films-model';

import FilmDetailsPresenter from './film-details-presenter';
import FilmCommentsPresenter from './film-comments-presenter';
import FilmPopupView from '../view/film-popup-view';
import { remove, render } from '../framework/render';
import { UpdateType } from '../enum';

const BLOCK_SCROLL_CLASS = 'hide-overflow';

export default class FilmPopupPresenter {
  static #instance = null;
  #filmData = null;
  #filmsModel = null;
  #filmDetailsHanler = null;
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
    if (this.#filmData !== null && this.#filmData.id === filmData.id) {
      return;
    }
    this.#filmData = filmData;
    this.#filmsModel = new FilmsModel();
    this.#filmDetailsHanler = callback;
    this.#existFilmPopup = this.#filmPopup;
    this.#renderPopup();
    this.#renderDetails();
    this.#renderComments();

    this.#filmsModel.addObserver(this.#handleModelEvent);
  };

  destroy = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmCommentsPresenter.destroy();

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

  #renderDetails = () => {
    this.#filmDetailsPresenter = new FilmDetailsPresenter(
      this.#filmPopup.filmDetailsContainer
    );
    this.#filmDetailsPresenter.init(this.#filmData, this.#filmDetailsHanler);
  };

  #renderComments = () => {
    if (this.#filmCommentsPresenter){
      this.#filmCommentsPresenter.destroy();
    }
    this.#filmCommentsPresenter = new FilmCommentsPresenter(
      this.#filmPopup.filmCommentsContainer
    );
    this.#filmCommentsPresenter.init(this.#filmData);
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

  #handleModelEvent = async (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCommentsPresenter.updateFilmInfo(data);
        break;
      case UpdateType.MINOR:
        this.#filmData = data;
        this.#filmDetailsPresenter.init(this.#filmData, this.#filmDetailsHanler);
        break;
      case UpdateType.MAJOR:
        break;
      case UpdateType.INIT:
        break;
    }
  };
}
