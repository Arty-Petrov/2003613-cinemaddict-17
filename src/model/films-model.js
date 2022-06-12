import Observable from '../framework/observable';
import { DATA_LENGTH } from '../enum';
import { generateFilm } from '../mock/film-data';

export default class FilmsModel extends Observable{
  #films = null;

  constructor() {
    super();
    this.#films = Array.from({length: DATA_LENGTH}, () => generateFilm());
  }

  get films () {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
