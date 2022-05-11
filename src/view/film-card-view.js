import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, cutStringLength, humanizeUTC } from '../util';

const DESCRIPTION_LENGTH_LIMIT = 140;

const createFilmCardTemplate = (film) => {

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
      description
    }
  } = film;


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
      <div class="film-card__controls"></div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #showFilmDetailsClickArea = null;

  constructor(film) {
    super();
    this.#film = film;
    this.#showFilmDetailsClickArea = this.element.querySelector('.film-card__link');
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get controlsContainer() {
    return this.element.querySelector('.film-card__controls');
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.#showFilmDetailsClickArea.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
