import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { UserDetails } from '../utils/enum';

const CONTROL_GROUP_CLASS = 'film-details__controls';
const CONTROL_ITEM_CLASS = 'film-details__control-button';
const CONTROL_ITEM_ACTIVE_CLASS = 'film-details__control-button--active';

const createFilmDetailsControlsTemplate = (state) => {
  const {
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
    isDisabled,
  } = state;

  const getControlActivityClass = (userDetail) => (userDetail) ? CONTROL_ITEM_ACTIVE_CLASS : '';

  return (
    `<div>
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button ${getControlActivityClass(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist" ${(isDisabled === 'watchlist') ? 'disabled': ''}>Add to watchlist</button>
      <button type="button" class="film-details__control-button ${getControlActivityClass(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched" ${(isDisabled === 'watched') ? 'disabled': ''}>Already watched</button>
      <button type="button" class="film-details__control-button ${getControlActivityClass(favorite)} film-details__control-button--favorite" id="favorite" name="favorite" ${(isDisabled === 'favorite') ? 'disabled': ''}>Add to favorites</button>
    </section>
    </div>`);
};

export default class FilmDetailsControlsView extends AbstractStatefulView {
  #userDetailsControls = null;

  constructor(filmData) {
    super();
    this._state = FilmDetailsControlsView.convertFilmToState(filmData);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsControlsTemplate(this._state);
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
      FilmDetailsControlsView.convertFilmToState(film),
    );
  };

  setUserDetailsControlsHandler(callback) {
    this._callback.userDetailsControlsClick = callback;
    this.#userDetailsControls.addEventListener('click', this.#userDetailsControlsHandler);
  }

  #setInnerHandlers = () => {
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
    this._callback.userDetailsControlsClick(FilmDetailsControlsView.convertStateToFilm(this._state), userDetailId);
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
