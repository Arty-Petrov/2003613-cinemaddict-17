import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, humanizeUTC } from '../utils/util';

const createFilmDetailsTemplate = (filmData) => {
  const {
    comments,
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
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
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
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">${(comments.length === 1) ? 'Comment': 'Comments'} <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list"></ul>
          </section>
        </div>
      </form>
    </section>`);
};

export default class FilmDetailsView extends AbstractView {
  #filmData = null;
  #closePopupButton = null;
  #addToWatchListButton = null;
  #markAsWhatchedButton = null;
  #markAsFavoriteButton = null;
  #controlActivityClass = null;

  constructor(filmData) {
    super();
    this.#filmData = filmData;
    this.#closePopupButton = this.element.querySelector('.film-details__close-btn');
    this.#addToWatchListButton = this.element.querySelector('.film-details__control-button--watchlist');
    this.#markAsWhatchedButton = this.element.querySelector('.film-details__control-button--watched');
    this.#markAsFavoriteButton = this.element.querySelector('.film-details__control-button--favorite');
    this.#controlActivityClass = 'film-details__control-button--active';
  }

  get template() {
    return createFilmDetailsTemplate(this.#filmData);
  }

  get commentsContainer() {
    return this.element.querySelector('.film-details__comments-list');
  }

  get newCommentContainer() {
    return this.element.querySelector('.film-details__comments-wrap');
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

  setCloseButtonHandler(callback) {
    this._callback.closePopupButtonClick = callback;
    this.#closePopupButton.addEventListener('click', this.#closeButtonHandler);
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

  #closeButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupButtonClick();
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
