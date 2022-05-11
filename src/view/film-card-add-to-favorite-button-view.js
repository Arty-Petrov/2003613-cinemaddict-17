import AbstractButton from './abstract-button-view';

const createFilmCardAddToFavoriteButtonTemplate = () => '<button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>';

export default class FilmCardAddToFavoriteButtonView extends AbstractButton {
  get template() {
    return createFilmCardAddToFavoriteButtonTemplate();
  }
}
