import { createElement } from '../render.js';

const createFilmDetailsTopContainerTemplate = () => '<div class="film-details__top-container"></div>';

export default class FilmDetailsTopContainerView {
  #element = null;

  get template() {
    return createFilmDetailsTopContainerTemplate();
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
