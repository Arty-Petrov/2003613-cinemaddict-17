import AbstractView from '../framework/view/abstract-view';

const createFilmsListExtraTemplate = (filmListHeaderContent) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${filmListHeaderContent}</h2>
    <div class="films-list__container">
    </div>
  </section>`);

export default class FilmsListExtraView extends AbstractView {
  #filmListHeaderContent = null;

  constructor (data) {
    super();
    this.#filmListHeaderContent = data;
  }

  get template() {
    return createFilmsListExtraTemplate(this.#filmListHeaderContent);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
