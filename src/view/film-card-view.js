import { createElement } from '../render';
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
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get showFilmDetailsButton() {
    return this.#element.querySelector('.film-card__link');
  }

  get addToWatchListButton() {
    return this.#element.querySelector('.film-card__controls-item--add-to-watchlist');
  }

  get markAsWhatchedButton() {
    return this.#element.querySelector('.film-card__controls-item--mark-as-watched');
  }

  get markAsFavoriteButton() {
    return this.#element.querySelector('.film-card__controls-item--favorite');
  }
}
