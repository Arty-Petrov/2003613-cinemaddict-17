import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, cutStringLength, humanizeUTC } from '../utils/util';

const CONTROL_ITEM_CLASS = 'film-card__controls-item';
const CONTROL_ITEM_ACTIVE_CLASS = 'film-details__control-button--active';
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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActivityClass(watchlist)}" type="button" id="watchlist">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActivityClass(alreadyWatched)}" type="button" id="watched">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActivityClass(favorite)}" type="button" id="favorite">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #filmData = null;
  #showFilmDetailsClickArea = null;
  #userDetailsControls = null;

  constructor(filmData) {
    super();
    this.#filmData = filmData;
    this.#showFilmDetailsClickArea = this.element.querySelector('.film-card__link');
    this.#userDetailsControls = this.element.querySelector('.film-card__controls');
  }

  get template() {
    return createFilmCardTemplate(this.#filmData);
  }

  setShowFilmDetailsHandler(callback) {
    this._callback.showFilmDetailsClick = callback;
    this.#showFilmDetailsClickArea.addEventListener('click', this.#showFilmDetailsClickHandler);
  }

  #showFilmDetailsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showFilmDetailsClick();
  };

  setUserDetailsControlsHandler(callback) {
    this._callback.userDetailsControlsClick = callback;
    this.#userDetailsControls.addEventListener('click', this.#userDetailsControlsHandler);
  }

  #userDetailsControlsHandler = (evt) => {
    if (!evt.target.classList.contains(CONTROL_ITEM_CLASS)){
      return;
    }
    evt.preventDefault();
    const userDetailId = evt.target.id;
    this._callback.userDetailsControlsClick(userDetailId);
    const buttonElement = this.element.querySelector(`#${userDetailId}`);
    buttonElement.classList.toggle(CONTROL_ITEM_ACTIVE_CLASS);
  };
}
