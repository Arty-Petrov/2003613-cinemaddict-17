import FilmDetailsView from '../view/film-details-view';

import { render, replace, remove } from '../framework/render';
import { UpdateType } from '../enum';
import FilmsModel from '../model/films-model';

export default class FilmDetailsPresenter {
  static #instance = null;
  #filmData = null;
  #filmsModel = null;

  #detailsSectionContainer = null;
  #details = null;
  #existDetails = null;

  #handleCardAddToWatchList = null;
  #handleCardMarkAsWhatched = null;
  #handleCardMarkAsFavorite = null;


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
    this.#filmsModel = new FilmsModel();

    const [
      handleAddToWatchList,
      handleMarkAsWhatched,
      handleMarkAsFavorite,
    ] = callback;

    this.#handleCardAddToWatchList = handleAddToWatchList;
    this.#handleCardMarkAsWhatched = handleMarkAsWhatched;
    this.#handleCardMarkAsFavorite = handleMarkAsFavorite;

    this.#renderDetails();
    this.#filmsModel.addObserver(this.#handleModelEvent);
  };

  #renderDetails = () => {
    this.#existDetails = this.#details;
    this.#details = new FilmDetailsView(this.#filmData);
    this.#details.setAddToWatchListHandler(this.#handleCardAddToWatchList);
    this.#details.setMarkAsWhatchedHandler(this.#handleCardMarkAsWhatched);
    this.#details.setMarkAsFavoriteHandler(this.#handleCardMarkAsFavorite);
    if (!this.#existDetails) {
      render(this.#details, this.#detailsSectionContainer);
      this.#existDetails = this.#details;
      return;
    }
    replace(this.#details, this.#existDetails);
    remove(this.#existDetails);
  };

  #handleAddToWatchList = () => {
    const inWatchlist = !this.#filmData.userDetails.watchlist;
    this.#details.setAddToWatchList(inWatchlist);
    this.#handleCardAddToWatchList();
  };

  #handleMarkAsWhatched = () => {
    const isWatched = !this.#filmData.userDetails.alreadyWatched;
    this.#details.setMarkAsWhatched(isWatched);
    this.#handleCardMarkAsWhatched();
  };

  #handleMarkAsFavorite = () => {
    const isFavorite = !this.#filmData.userDetails.favorite;
    this.#details.setMarkAsFavorite(isFavorite);
    this.#handleCardMarkAsFavorite();
  };

  destroy = () => {
    remove(this.#details);
    FilmDetailsPresenter.#instance = null;
  };

  #handleModelEvent = (updateType, data) => {
    if (updateType === UpdateType.MINOR) {
      this.#filmData = data;
      this.#renderDetails();
    }
  };
}
