import { DATA_LENGTH } from '../enum';
import { generateFilm } from '../mock/film-data';

export default class FilmsModel {
  #films = Array.from({length: DATA_LENGTH}, () => generateFilm());
  get films () {return this.#films;}
}
