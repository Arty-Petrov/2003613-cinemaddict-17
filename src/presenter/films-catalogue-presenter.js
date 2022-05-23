import FilmsModel from '../model/films-model';
import { generateFilter } from '../mock/filter.js';

import HeaderProfileView from '../view/header-profile-view';
import MainNavigationView from '../view/main-navigation-view';
import MainSortView from '../view/main-sort-view';

import FilmsListView from '../view/films-list-view';
import FilmsListEmptyView from '../view/films-list-empty-view';
import ShowMoreButtonPresenter from './show-more-button-presenter';

import FilmCardPresenter from './film-card-presenter';
import { render } from '../framework/render';

const FILMS_COUNT_PER_STEP = 5;
export default class FilmsCataloguePresenter {
  #profileMenuContainer = null;
  #profileMenu = null;
  #navigationMenu = null;
  #filmsSortMenu = null;
  #filmsContainer = null;
  #filmsList = null;
  #showMoreButton = null;
  #filmListEmpty = null;

  #filmsModel = null;
  #filmsData = null;
  #filmsFilters = null;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  init = () => {
    this.#filmsModel = new FilmsModel();
    this.#filmsData = [...this.#filmsModel.films];
    this.#filmsFilters = generateFilter(this.#filmsData);

    this.#profileMenuContainer = document.querySelector('.header');
    this.#filmsContainer = document.querySelector('main');

    this.#profileMenu = new HeaderProfileView(this.#filmsFilters);
    this.#navigationMenu = new MainNavigationView(this.#filmsFilters);
    this.#filmsSortMenu = new MainSortView();

    this.#filmsList = new FilmsListView();
    this.#filmListEmpty = new FilmsListEmptyView();
    this.#showMoreButton = new ShowMoreButtonPresenter();

    render(this.#profileMenu, this.#profileMenuContainer);
    render(this.#navigationMenu, this.#filmsContainer);
    render(this.#filmsSortMenu, this.#filmsContainer);

    render(this.#filmsList, this.#filmsContainer);
    this.#renderFilmCards();
  };

  #renderFilmCard = (filmData) => {
    const filmCardComponent = new FilmCardPresenter(this.#filmsList.container);
    filmCardComponent.init(filmData, this.updateUserDetails);
  };

  #renderFilmCards = () => {
    if (this.#filmsData.length === 0) {
      render(this.#filmListEmpty, this.#filmsList.container);
    } else {
      for (let i = 0; i < Math.min(this.#filmsData.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilmCard(this.#filmsData[i]);
      }
      this.#showMoreButton.init(this.#filmsList.element, this.#handleShowMoreButton);
    }
  };

  #handleShowMoreButton = () => {
    this.#filmsData
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#filmsData.length) {
      this.#showMoreButton.destroy();
    }
  };

  updateUserDetails = (filmId, dataToUpdate) => {
    for (const key in dataToUpdate) {
      this.#filmsData[filmId][key] = dataToUpdate[key];
    }
  };

  get filmCount() {
    return this.#filmsData.length;
  }
}
