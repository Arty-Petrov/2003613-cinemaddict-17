import AbstractButtonView from './abstract-button-view';

const createFilmsListShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsListShowMoreButtonView extends AbstractButtonView {
  get template() {
    return createFilmsListShowMoreButtonTemplate();
  }
}
