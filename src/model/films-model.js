import { generateFilm } from '../mock/film-data';

export default class FilmsModel {
  #films = Array.from({length: 30}, (v, k) => generateFilm(k));
  get films () {return this.#films;}
}
