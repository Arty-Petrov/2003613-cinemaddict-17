import { EmptyListMessage } from '../utils/enum';
import AbstractView from '../framework/view/abstract-view';

const createFilmsListEmptyTemplate = (filterType) => {
  const message = EmptyListMessage[filterType.toUpperCase()];
  return `<h2 class="films-list__title">${message}</h2>`;
};

export default class FilmsListEmptyView extends AbstractView {
  #filterType = null;

  init = (filterType) => {
    this.#filterType = filterType;
  };

  get template () {
    return createFilmsListEmptyTemplate(this.#filterType);
  }
}
