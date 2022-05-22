import FilmCardView from '../view/film-card-view';
import FilmDetailsPresenter from './film-details-presenter';
import { render, replace, remove } from '../framework/render';

export default class FilmCardPresenter {
  #filmId = null;
  #filmData = null;
  #updateUserDetails = null;

  #filmCardContainer = null;
  #filmCardComponent = null;
  #existFilmCardComponent = null;

  #filmDetailsPopupComponent = null;

  constructor(filmCardContainer, callback) {
    this.#filmCardContainer = filmCardContainer;
    this.#updateUserDetails = callback;
  }

  init =  (filmData) => {
    this.#filmData = filmData;
    this.#filmCardComponent = new FilmCardView(this.#filmData);
    this.#filmCardComponent.setShowFilmDetailsHandler(this.#handleShowFilmDetail);
    this.#filmCardComponent.setAddToWatchListHandler(this.#handleAddToWatchList);
    this.#filmCardComponent.setMarkAsWhatchedHandler(this.#handleMarkAsWhatched);
    this.#filmCardComponent.setMarkAsFavoriteHandler(this.#handleMarkAsFavorite);

    if (this.#existFilmCardComponent === null){
      render (this.#filmCardComponent, this.#filmCardContainer);
      return;
    }

    if (this.filmCardContainer.contains(this.#existFilmCardComponent.element)){
      replace(this.#filmCardComponent,this.#existFilmCardComponent);
    }

    remove(this.#existFilmCardComponent);
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

    const dataToUpdate = {};
    dataToUpdate['id'] = this.#filmData.id;
    dataToUpdate['watchlist'] = inWatchlist;

    this.#updateUserDetails(this.#filmData.id, dataToUpdate);
    this.#filmCardComponent.setAddToWatchList(inWatchlist);
  };

  #handleMarkAsWhatched = () => {
    const alreadyWatched = !this.#filmData.userDetails.alreadyWatched;
    this.#filmData.userDetails.alreadyWatched = alreadyWatched;
    const now = new Date();

    const dataToUpdate = {};
    dataToUpdate['id'] = this.#filmData.id;
    dataToUpdate['alreadyWatched'] = alreadyWatched;
    dataToUpdate['watchingDate'] = alreadyWatched ? now : null;

    this.#updateUserDetails(this.#filmData.id, dataToUpdate);
    this.#filmCardComponent.setMarkAsWhatched(alreadyWatched);
  };

  #handleMarkAsFavorite = () => {
    const isFavorite = !this.#filmData.userDetails.favorite;
    this.#filmData.userDetails.favorite = isFavorite;

    const dataToUpdate = {};
    dataToUpdate['id'] = this.#filmData.id;
    dataToUpdate['favorite'] = isFavorite;

    this.#updateUserDetails(this.#filmData.id, dataToUpdate);
    this.#filmCardComponent.setMarkAsFavorite(isFavorite);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
