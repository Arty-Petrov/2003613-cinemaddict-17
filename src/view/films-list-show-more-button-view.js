import AbstractView from '../framework/view/abstract-view';

const createFilmsListShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsListShowMoreButtonView extends AbstractView {
  get template() {
    return createFilmsListShowMoreButtonTemplate();
  }
}
