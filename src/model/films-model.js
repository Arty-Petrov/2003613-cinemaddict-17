import { DATA_LENGTH } from '../enum';
import { generateFilm } from '../mock/film-data';

export default class FilmsModel {
  #films = Array.from({length: DATA_LENGTH}, (v, k) => generateFilm(k));
  get films () {return this.#films;}
}
