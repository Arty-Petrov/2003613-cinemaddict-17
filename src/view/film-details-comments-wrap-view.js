import { createElement } from '../render.js';

const createFilmDetailsCommentsWrapTemplate = () => (
  `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Co
  </section>`
);

export default class FilmDetailsCommentsWrapView {
  getTemplate() {
    return createFilmDetailsCommentsWrapTemplate();
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
