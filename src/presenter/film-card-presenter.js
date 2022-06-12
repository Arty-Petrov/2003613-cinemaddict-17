import FilmCardView from '../view/film-card-view';
import FilmDetailsPresenter from './film-details-presenter';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction } from '../enum';

export default class FilmCardPresenter {
  #filmData = null;
  #handleViewActions = null;

  #filmCardContainer = null;
  #filmCardComponent = null;

  #filmDetailsPopupComponent = null;

  constructor(filmCardContainer, callback) {
    this.#filmCardContainer = filmCardContainer;
    this.#handleViewActions = callback;
  }

  init =  (filmData) => {
    this.#filmData = filmData;
    const prevfilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#filmData);
    this.#filmCardComponent.setShowFilmDetailsHandler(this.#handleShowFilmDetail);
    this.#filmCardComponent.setAddToWatchListHandler(this.#handleAddToWatchList);
    this.#filmCardComponent.setMarkAsWhatchedHandler(this.#handleMarkAsWhatched);
    this.#filmCardComponent.setMarkAsFavoriteHandler(this.#handleMarkAsFavorite);

    if (prevfilmCardComponent === null){
      render (this.#filmCardComponent, this.#filmCardContainer);
      return;
    }

    replace(this.#filmCardComponent,prevfilmCardComponent);
    remove(prevfilmCardComponent);
  };

  #handleShowFilmDetail = () => {
    const buttonHandlers = [
      this.#handleAddToWatchList,
      this.#handleMarkAsWhatched,
      this.#handleMarkAsFavorite,
    ];

    this.#filmDetailsPopupComponent = new FilmDetailsPresenter();
    this.#filmDetailsPopupComponent.init(this.#filmData, buttonHandlers);
    this.#filmDetailsPopupComponent = null;
  };

  #handleAddToWatchList = () => {
    const inWatchlist = !this.#filmData.userDetails.watchlist;
    this.#filmData.userDetails.watchlist = inWatchlist;

    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR,this.#filmData);
    this.#filmCardComponent.setAddToWatchList(inWatchlist);
  };

  #handleMarkAsWhatched = () => {
    const alreadyWatched = !this.#filmData.userDetails.alreadyWatched;
    this.#filmData.userDetails.alreadyWatched = alreadyWatched;
    this.#filmData.userDetails.watchingDate = (alreadyWatched) ? new Date() : null;

    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR,this.#filmData);
    this.#filmCardComponent.setMarkAsWhatched(alreadyWatched);
  };

  #handleMarkAsFavorite = () => {
    const isFavorite = !this.#filmData.userDetails.favorite;
    this.#filmData.userDetails.favorite = isFavorite;

    this.#handleViewActions(UserAction.UPDATE_FILM, UpdateType.MINOR,this.#filmData);
    this.#filmCardComponent.setMarkAsFavorite(isFavorite);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
