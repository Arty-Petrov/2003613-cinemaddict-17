import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, humanizeUTC } from '../utils/util';

const CONTROL_ITEM_CLASS = 'film-details__control-button';
const CONTROL_ITEM_ACTIVE_CLASS = 'film-details__control-button--active';

const createFilmDetailsTemplate = (filmData) => {
  const {
    filmInfo : {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release : {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
  } = filmData;

  const genreString = (genre.length === 1) ? 'Genre' : 'Genres';

  const createGenreList = () => {
    const genresList = [];
    for (const el of genre) {
      genresList.push(`<span class="film-details__genre">${el}</span>`);
    }
    return genresList.join('\n');
  };

  const getControlActivityClass = (userDetail) => (userDetail) ? 'film-details__control-button--active' : '';

  return (
    `<div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${poster}" alt="">

        <p class="film-details__age">${ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeUTC(date, 'DD MMMM YYYY')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${convertMinutesToHM (runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${genreString}</td>
            <td class="film-details__cell">${createGenreList()}</td>
          </tr>
        </table>

        <p class="film-details__film-description">${description}</p>
      </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${getControlActivityClass(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${getControlActivityClass(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${getControlActivityClass(favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>`);
};

export default class FilmDetailsView extends AbstractView {
  #filmData = null;
  #userDetailsControls = null;

  constructor(filmData) {
    super();
    this.#filmData = filmData;
    this.#userDetailsControls = this.element.querySelector('.film-details__controls');
  }

  get template() {
    return createFilmDetailsTemplate(this.#filmData);
  }

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
