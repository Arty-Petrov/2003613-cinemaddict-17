import AbstractButton from './abstract-button-view';

const createFilmDetailsMarkAsWhatchedButtonTemplate = () => '<button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>';

export default class FilmDetailsMarkAsWhatchedButton extends AbstractButton {
  get template() {
    return createFilmDetailsMarkAsWhatchedButtonTemplate();
  }
}
