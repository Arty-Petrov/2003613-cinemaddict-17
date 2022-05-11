import AbstractButton from './abstract-button-view';

const createFilmDetailsAddToFavoriteButtonTemplate = () => '<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';

export default class FilmDetailsAddToFavoriteButtonView extends AbstractButton {
  get template() {
    return createFilmDetailsAddToFavoriteButtonTemplate();
  }
}
