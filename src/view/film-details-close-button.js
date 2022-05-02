import { createElement } from '../render.js';

const createFilmDetailsCloseButtonTemplate = () => (
  `<div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
  </div>`
);

export default class FilmDetailsCloseButtonView {
  getTemplate() {
    return createFilmDetailsCloseButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
