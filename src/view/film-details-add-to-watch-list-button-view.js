import AbstractButton from './abstract-button-view';

const createFilmDetailsAddToWatchListButtonTemplate = () => '<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';

export default class FilmDetailsAddToWatchListButton extends AbstractButton {
  get template() {
    return createFilmDetailsAddToWatchListButtonTemplate();
  }
}
