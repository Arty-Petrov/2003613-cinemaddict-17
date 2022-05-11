import AbstractButton from './abstract-button-view';

const createFilmCardMarkAsWhatchedButtonTemplate = () => '<button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>';

export default class FilmCardMarkAsWhatchedButton extends AbstractButton {
  get template() {
    return createFilmCardMarkAsWhatchedButtonTemplate();
  }
}
