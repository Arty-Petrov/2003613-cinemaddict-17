import { createElement } from '../render.js';

const createFilmListShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class FilmListShowMoreButtonView {
  #element = null;

  get template() {
    return createFilmListShowMoreButtonTemplate();
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
