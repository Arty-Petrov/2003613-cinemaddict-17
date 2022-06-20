import FilmCardView from '../view/film-card-view';
import FilmPopupPresenter from './film-popup-presenter';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction } from '../enum';

export default class FilmCardPresenter {
  #filmData = null;
  #handleViewActions = null;

  #filmCard = null;
  #filmCardContainer = null;

  #filmPopup = null;

  constructor(filmCardContainer, callback) {
    this.#filmCardContainer = filmCardContainer;
    this.#handleViewActions = callback;
  }

  init = (filmData) => {
    this.#filmData = filmData;
    const prevFilmCardComponent = this.#filmCard;

    this.#filmCard = new FilmCardView(this.#filmData);
    this.#filmCard.setShowFilmDetailsHandler(this.#handleShowFilmDetail);
    this.#filmCard.setAddToWatchListHandler(this.#handleAddToWatchList);
    this.#filmCard.setMarkAsWhatchedHandler(this.#handleMarkAsWhatched);
    this.#filmCard.setMarkAsFavoriteHandler(this.#handleMarkAsFavorite);

    if (prevFilmCardComponent === null){
      render (this.#filmCard, this.#filmCardContainer);
      return;
    }

    replace(this.#filmCard, prevFilmCardComponent);
    remove(prevFilmCardComponent);
  };

  #handleShowFilmDetail = () => {
    const buttonHandlers = [
      this.#handleAddToWatchList,
      this.#handleMarkAsWhatched,
      this.#handleMarkAsFavorite,
    ];

    this.#filmPopup = new FilmPopupPresenter();
    this.#filmPopup.init(this.#filmData, buttonHandlers);
  };

  #handleAddToWatchList = () => {
    const inWatchlist = !this.#filmData.userDetails.watchlist;
    this.#filmData.userDetails.watchlist = inWatchlist;
    console.log(this.#filmData);
    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#filmData);
  };

  #handleMarkAsWhatched = () => {
    const alreadyWatched = !this.#filmData.userDetails.alreadyWatched;
    this.#filmData.userDetails.alreadyWatched = alreadyWatched;
    this.#filmData.userDetails.watchingDate = (alreadyWatched) ? new Date() : null;
    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#filmData);
  };

  #handleMarkAsFavorite = () => {
    const isFavorite = !this.#filmData.userDetails.favorite;
    this.#filmData.userDetails.favorite = isFavorite;

    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR,this.#filmData);
  };

  destroy = () => {
    remove(this.#filmCard);
    this.#filmCard = null;
  };
}
