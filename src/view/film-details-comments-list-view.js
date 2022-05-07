import { createElement } from '../render.js';

const createFilmDetailsCommentsListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class FilmDetailsCommentsListView {
  #element = null;

  get template() {
    return createFilmDetailsCommentsListTemplate();
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
