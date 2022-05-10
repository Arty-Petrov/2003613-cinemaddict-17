import AbstractButton from './abstract-button-view';

const createFilmCardAddToWatchListButtonTemplate = () => '<button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>';

export default class FilmCardAddToWatchListButton extends AbstractButton {
  get template() {
    return createFilmCardAddToWatchListButtonTemplate();
  }
}
