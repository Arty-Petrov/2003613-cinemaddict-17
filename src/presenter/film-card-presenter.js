import FilmCardView from '../view/film-card-view';
import FilmPopupPresenter from './film-popup-presenter';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction, UserDetails } from '../enum';

export default class FilmCardPresenter {
  #filmData = null;
  #handleUserDetailsActions = null;

  #filmCard = null;
  #filmCardContainer = null;

  #filmPopup = null;

  constructor(filmCardContainer, callback) {
    this.#filmCardContainer = filmCardContainer;
    this.#handleUserDetailsActions = callback;
  }

  init = (filmData) => {
    this.#filmData = filmData;
    const prevFilmCardComponent = this.#filmCard;

    this.#filmCard = new FilmCardView(this.#filmData);
    this.#filmCard.setShowFilmDetailsHandler(this.#handleShowFilmDetail);
    this.#filmCard.setUserDetailsControlsHandler(this.#handleCardViewActions);

    if (prevFilmCardComponent === null){
      render (this.#filmCard, this.#filmCardContainer);
      return;
    }

    replace(this.#filmCard, prevFilmCardComponent);
    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCard);
    this.#filmCard = null;
  };

  #handleShowFilmDetail = () => {
    this.#filmPopup = new FilmPopupPresenter();
    this.#filmPopup.init(this.#filmData, this.#handleCardViewActions);
  };

  #handleCardViewActions = (detailsType) => {
    switch (detailsType) {
      case UserDetails.WATCHLIST:
        this.#filmData.userDetails.watchlist = !this.#filmData.userDetails.watchlist;
        break;
      case UserDetails.WATCHED:
        this.#filmData.userDetails.alreadyWatched = !this.#filmData.userDetails.alreadyWatched;
        this.#filmData.userDetails.watchingDate = (this.#filmData.userDetails.alreadyWatched) ? new Date() : null;
        break;
      case UserDetails.FAVORITE:
        this.#filmData.userDetails.favorite = !this.#filmData.userDetails.favorite;
        break;
    }
    this.#handleUserDetailsActions(UserAction.UPDATE_FILM ,UpdateType.MINOR, this.#filmData);
  };
}
