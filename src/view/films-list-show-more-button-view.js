import { createElement } from '../render.js';

const createFilmsListShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class FilmsListShowMoreButtonView {
  #element = null;

  get template() {
    return createFilmsListShowMoreButtonTemplate();
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
