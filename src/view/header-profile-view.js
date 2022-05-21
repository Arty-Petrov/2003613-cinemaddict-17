import AbstractView from '../framework/view/abstract-view';
import { UserRank } from '../enum';

const getWatchedFilmsCount = (filters) => filters.filter((entrie) => (entrie['name'] === 'history'))[0].count;

const getUserRank = (filters) => {
  const watchedFilms = getWatchedFilmsCount(filters);
  const rank = UserRank
    .filter((entrie) => (watchedFilms >= entrie['watchedMin'] && watchedFilms <= entrie['watchedMax']))[0].rankName;

  return rank;
};

const createHeaderProfileTemplate = (filters) => (
  `<section class="header__profile profile">
  ${getWatchedFilmsCount(filters)
    ? `<p class="profile__rating">${getUserRank(filters)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></img>`
    :''
  } 
  </section>`
);

export default class HeaderProfileView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createHeaderProfileTemplate(this.#filters);
  }
}
