import { createElement } from '../render.js';

const createFilmDetailsCloseButtonTemplate = () => (
  `<div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
  </div>`
);

export default class FilmDetailsCloseButtonView {
  #element = null;

  get template() {
    return createFilmDetailsCloseButtonTemplate();
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
