import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { convertMinutesToHM, cutStringLength, humanizeUTC } from '../utils/util';
import { UserDetails } from '../utils/enum';

const CLICK_ARIA_CLASS = 'film-card__link';
const CONTROL_GROUP_CLASS = 'film-card__controls';
const CONTROL_ITEM_CLASS = 'film-card__controls-item';
const DESCRIPTION_LENGTH_LIMIT = 140;

const createFilmCardTemplate = (state) => {

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
    isDisabled,
  } = state;

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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActivityClass(watchlist)}" type="button" id="watchlist" ${(isDisabled === 'watchlist') ? 'disabled': ''}>Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActivityClass(alreadyWatched)}" type="button" id="watched" ${(isDisabled === 'watched') ? 'disabled': ''}>Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActivityClass(favorite)}" type="button" id="favorite"  ${(isDisabled === 'favorite') ? 'disabled': ''}>Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractStatefulView {
  #showFilmDetailsClickArea = null;
  #userDetailsControls = null;

  constructor(filmData) {
    super();
    this._state = FilmCardView.convertFilmToState(filmData);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  get controls() {
    return this.element.querySelector(`.${CONTROL_GROUP_CLASS}`);
  }

  static convertFilmToState = (film) => ({...film,
    isDisabled: false,
  });

  static convertStateToFilm = (state) => {
    const film = {...state};
    delete film.isDisabled;
    return film;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  reset = (film) => {
    this.updateElement(
      FilmCardView.convertFilmToState(film),
    );
    // this.#setInnerHandlers();
  };

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

  #setInnerHandlers = () => {
    this.#showFilmDetailsClickArea = this.element.querySelector(`.${CLICK_ARIA_CLASS}`);
    this.#userDetailsControls = this.element.querySelector(`.${CONTROL_GROUP_CLASS}`);
  };

  #userDetailsControlsHandler = (evt) => {
    if (!evt.target.classList.contains(CONTROL_ITEM_CLASS)){
      return;
    }
    evt.preventDefault();
    const userDetailId = evt.target.id;
    switch (userDetailId) {
      case UserDetails.WATCHLIST:
        this.#toggleWatchlist();
        break;
      case UserDetails.WATCHED:
        this.#toggleWatched();
        break;
      case UserDetails.FAVORITE:
        this.#toggleFavorite();
        break;
    }
    this._callback.userDetailsControlsClick(FilmCardView.convertStateToFilm(this._state), userDetailId);
  };

  #toggleWatchlist = () => {
    this.updateElement({
      userDetails:{
        watchlist: !this._state.userDetails.watchlist,
        alreadyWatched: this._state.userDetails.alreadyWatched,
        watchingDate: this._state.userDetails.watchingDate,
        favorite: this._state.userDetails.favorite,
      }
    });
  };

  #toggleWatched = () => {
    this.updateElement({
      userDetails:{
        watchlist: this._state.userDetails.watchlist,
        alreadyWatched: !this._state.userDetails.alreadyWatched,
        watchingDate: (this._state.userDetails.alreadyWatched) ? new Date() : null,
        favorite: this._state.userDetails.favorite,
      }
    });
  };

  #toggleFavorite =() => {
    this.updateElement({
      userDetails:{
        watchlist: this._state.userDetails.watchlist,
        alreadyWatched: this._state.userDetails.alreadyWatched,
        watchingDate: this._state.userDetails.watchingDate,
        favorite: !this._state.userDetails.favorite,
      }
    });
  };
}
