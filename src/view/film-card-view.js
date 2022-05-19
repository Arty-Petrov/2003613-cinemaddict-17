import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, cutStringLength, humanizeUTC } from '../util';

const DESCRIPTION_LENGTH_LIMIT = 140;

const createFilmCardTemplate = (filmData) => {

  const {
    comments,
    filmInfo : {
      title,
      totalRating,
      poster,
      release : {
        date,
      },
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
  } = filmData;

  const getControlActivityClass = (userDetail) => (userDetail) ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeUTC(date, 'YYYY')}</span>
          <span class="film-card__duration">${convertMinutesToHM(runtime)}</span>
          <span class="film-card__genre">${genre[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${cutStringLength(description, DESCRIPTION_LENGTH_LIMIT)}</p>
        <span class="film-card__comments">${comments.length} ${(comments.length === 1) ? 'comment': 'comments'}</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActivityClass(watchlist)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActivityClass(alreadyWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActivityClass(favorite)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #filmData = null;
  #showFilmDetailsClickArea = null;
  #addToWatchListButton = null;
  #markAsWhatchedButton = null;
  #markAsFavoriteButton = null;
  #controlActivityClass = null;

  constructor(filmData) {
    super();
    this.#filmData = filmData;
    this.#showFilmDetailsClickArea = this.element.querySelector('.film-card__link');
    this.#addToWatchListButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    this.#markAsWhatchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    this.#markAsFavoriteButton = this.element.querySelector('.film-card__controls-item--favorite');
    this.#controlActivityClass = 'film-card__controls-item--active';
  }

  get template() {
    return createFilmCardTemplate(this.#filmData);
  }

  #updateButtonStatus (element, status) {
    if (status) {
      element.classList.add(this.#controlActivityClass);
    } else {
      element.classList.remove(this.#controlActivityClass);
    }
  }

  setAddToWatchList(buttonStatus) {
    this.#updateButtonStatus(this.#addToWatchListButton, buttonStatus);
  }

  setMarkAsWhatched(buttonStatus) {
    this.#updateButtonStatus(this.#markAsWhatchedButton, buttonStatus);
  }

  setMarkAsFavorite(buttonStatus) {
    this.#updateButtonStatus(this.#markAsFavoriteButton, buttonStatus);
  }

  setShowFilmDetailsHandler(callback) {
    this._callback.showFilmDetailsClick = callback;
    this.#showFilmDetailsClickArea.addEventListener('click', this.#showFilmDetailsClickHandler);
  }

  setAddToWatchListHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this.#addToWatchListButton.addEventListener('click', this.#addToWatchListHandler);
  }

  setMarkAsWhatchedHandler(callback) {
    this._callback.markAsWhatchedClick = callback;
    this.#markAsWhatchedButton.addEventListener('click', this.#markAsWhatchedHandler);
  }

  setMarkAsFavoriteHandler(callback) {
    this._callback.markAsFavoriteClick = callback;
    this.#markAsFavoriteButton.addEventListener('click', this.#markAsFavoriteHandler);
  }

  #showFilmDetailsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showFilmDetailsClick();
  };

  #addToWatchListHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  };

  #markAsWhatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWhatchedClick();
  };

  #markAsFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsFavoriteClick();
  };
}
