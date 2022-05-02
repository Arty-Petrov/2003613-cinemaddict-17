import { createElement } from '../render.js';

const createFilmListShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class FilmListShowMoreButtonView {
  getTemplate() {
    return createFilmListShowMoreButtonTemplate();
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
