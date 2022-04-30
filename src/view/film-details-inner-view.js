import { createElement } from '../render.js';

const createFilmDetailsInnerTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FilmDetailsInnerView {
  getTemplate() {
    return createFilmDetailsInnerTemplate();
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
