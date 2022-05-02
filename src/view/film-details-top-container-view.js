import { createElement } from '../render.js';

const createFilmDetailsTopContainerTemplate = () => '<div class="film-details__top-container"></div>';

export default class FilmDetailsTopContainerView {
  getTemplate() {
    return createFilmDetailsTopContainerTemplate();
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
