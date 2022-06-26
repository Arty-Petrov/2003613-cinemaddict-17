import FilmsModel from '../model/films-model';

import FilmDetailsPresenter from './film-details-presenter';
import FilmCommentsPresenter from './film-comments-presenter';
import FilmPopupView from '../view/film-popup-view';
import { remove, render, replace } from '../framework/render';
import { UpdateType } from '../utils/enum';

const BLOCK_SCROLL_CLASS = 'hide-overflow';

export default class FilmPopupPresenter {
  static #instance = null;
  #filmData = null;
  #filmsModel = null;
  #handleFilmCardActions = null;
  #filmPopup = null;
  #existFilmPopup = null;
  #filmPopupContainer = null;
  #filmDetailsPresenter = null;
  #filmCommentsPresenter = null;

  constructor() {
    if (!FilmPopupPresenter.#instance) {
      this.#filmsModel = new FilmsModel();
      this.#filmsModel.addObserver(this.#handleModelPopEvent);
      this.#filmPopupContainer = document.body;
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
    this.#handleFilmCardActions = callback;
    this.#renderPopup();
    this.#renderDetails();
    this.#renderComments();
  };

  destroy = () => {
    this.#filmsModel.removeObserver(this.#handleModelPopEvent);
    this.#filmDetailsPresenter.destroy();
    this.#filmCommentsPresenter.destroy();

    this.#filmPopupContainer.classList.toggle(BLOCK_SCROLL_CLASS);
    remove(this.#filmPopup);
    FilmPopupPresenter.#instance = null;
  };

  static get instance() {
    return this.#instance;
  }

  #renderPopup = () => {
    this.#existFilmPopup = this.#filmPopup;
    this.#filmPopup = new FilmPopupView();
    if (!this.#existFilmPopup) {
      document.addEventListener('keydown', this.#handleEscKeydown);
      this.#filmPopup.setCloseButtonHandler(this.#handleClosePopup);
      this.#filmPopupContainer.classList.toggle(BLOCK_SCROLL_CLASS);
      render(this.#filmPopup, this.#filmPopupContainer);
      return;
    }
    replace(this.#filmPopup, this.#existFilmPopup);
    remove(this.#existFilmPopup);
  };

  #renderDetails = () => {
    this.#filmDetailsPresenter = new FilmDetailsPresenter(
      this.#filmPopup.filmDetailsContainer, this.#handleViewAction);
    this.#filmDetailsPresenter.init(this.#filmData);
  };

  #renderComments = () => {
    if (this.#filmCommentsPresenter){
      this.#filmCommentsPresenter.destroy();
    }
    this.#filmCommentsPresenter = new FilmCommentsPresenter(
      this.#filmPopup.filmCommentsContainer, this.#handleFilmCardActions
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

  #handleModelPopEvent = async (updateType, updateData) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCommentsPresenter.updateFilmInfo(updateData);
        break;
      case UpdateType.MINOR:
        this.#filmData = updateData;
        this.#filmDetailsPresenter.init(updateData);
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, updateData, userDetailsType = null) => {
    try {
      this.#filmDetailsPresenter.setSaving(userDetailsType);
      await this.#filmsModel.updateFilm(updateType, updateData);
    } catch (err) {
      this.#filmDetailsPresenter.setAborting();
    }
  };
}
