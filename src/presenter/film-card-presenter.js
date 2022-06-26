import FilmCardView from '../view/film-card-view';
import FilmPopupPresenter from './film-popup-presenter';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction } from '../utils/enum';

export default class FilmCardPresenter {
  #filmData = null;
  #handleFilmCardActions = null;

  #filmCard = null;
  #filmCardContainer = null;

  #filmPopup = null;

  constructor(filmCardContainer, callback) {
    this.#filmCardContainer = filmCardContainer;
    this.#handleFilmCardActions = callback;
  }

  init = (filmData) => {
    this.#filmData = filmData;
    const prevFilmCardComponent = this.#filmCard;

    this.#filmCard = new FilmCardView(this.#filmData);
    this.#filmCard.setShowFilmDetailsHandler(this.#handleShowPopup);
    this.#filmCard.setUserDetailsControlsHandler(this.#handleViewActions);

    if (prevFilmCardComponent === null){
      render (this.#filmCard, this.#filmCardContainer);
      return;
    }

    replace(this.#filmCard, prevFilmCardComponent);
    remove(prevFilmCardComponent);
    if (this.#filmPopup !== null) {
      this.#filmPopup.init(this.#filmData, this.#handleViewActions);
    }
  };

  destroy = () => {
    remove(this.#filmCard);
    this.#filmCard = null;
  };

  setSaving = (userDetailsType) => {
    this.#filmCard.updateElement({
      isDisabled: userDetailsType,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#filmCard.reset(this.#filmData);
    };

    this.#filmCard.shake(resetFormState);
  };

  #handleShowPopup = () => {
    if (FilmPopupPresenter.instance === null){
      this.#filmPopup = new FilmPopupPresenter();
    }
    this.#filmPopup = FilmPopupPresenter.instance;
    this.#filmPopup.init(this.#filmData, this.#handleFilmCardActions,);
  };

  #handleViewActions = (updateData, userDetailsType) => {
    this.#handleFilmCardActions(UserAction.UPDATE_DETAILS, UpdateType.MINOR, updateData, userDetailsType);
  };
}
