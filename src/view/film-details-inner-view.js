import { createElement } from '../render.js';

const createFilmDetailsInnerTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FilmDetailsInnerView {
  #element = null;

  get template() {
    return createFilmDetailsInnerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
