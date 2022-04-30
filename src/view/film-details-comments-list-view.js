import { createElement } from '../render.js';

const createFilmDetailsCommentsListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class FilmDetailsCommentsListView {
  getTemplate() {
    return createFilmDetailsCommentsListTemplate();
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
