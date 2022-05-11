import AbstractButtonView from './abstract-button-view';

const createFilmDetailsCloseButtonTemplate = () => '<button class="film-details__close-btn" type="button">close</button>';

export default class FilmDetailsCloseButtonView extends AbstractButtonView {
  get template() {
    return createFilmDetailsCloseButtonTemplate();
  }
}
