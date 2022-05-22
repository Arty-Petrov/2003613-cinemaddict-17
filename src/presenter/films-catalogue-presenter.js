/* eslint-disable indent */
import dayjs from 'dayjs';
import FilmsModel from '../model/films-model';
import { generateFilter } from '../mock/filter.js';
import { SortType } from '../enum';

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
  #filmsDataSource = null;
  #currentSortType = SortType.DEFAULT;
  #renderedFilms = new Map();
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
    this.#filmsModel = new FilmsModel();
    this.#filmsData = [...this.#filmsModel.films];
    this.#filmsDataSource = [...this.#filmsModel.films];

    render(this.#profileMenu, this.#profileMenuContainer);
    render(this.#navigationMenu, this.#filmsContainer);
    this.#renderFilmsSortMenu();

    render(this.#filmsList, this.#filmsContainer);
    this.#renderFilmCards();
  };

  #renderFilmCard = (filmData) => {
    const filmCardComponent = new FilmCardPresenter(this.#filmsList.container, this.#updateUserDetails);
    filmCardComponent.init(filmData);
    this.#renderedFilms.set(filmData.id, filmCardComponent);
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

  #renderFilmsSortMenu = () => {
    render(this.#filmsSortMenu, this.#filmsContainer);
    this.#filmsSortMenu.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#sortFilmsList(sortType);
    this.#cleanUpFilmsList();
    this.#renderFilmCards();
  };

  #sortFilmsList = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#sortByDate();
        break;
      case SortType.RATING:
        this.#sortByRating();
        break;
      default:
        this.#filmsData = [...this.#filmsDataSource];
  }
};

  #sortByDate = () => {
    this.#filmsData.sort((a, b) => dayjs(a.filmInfo.release.date).isBefore(dayjs(b.filmInfo.release.date)));
  };

  #sortByRating = () => {
    this.#filmsData
    .sort((a, b) => parseFloat(b.filmInfo.totalRating) - parseFloat(a.filmInfo.totalRating));
  };

  #cleanUpFilmsList = () => {
    this.#renderedFilms.forEach((presenter) => presenter.destroy());
    this.#renderedFilms.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this.#showMoreButton.destroy();
  };

  #updateUserDetails = (filmId, dataToUpdate) => {
    for (const key in dataToUpdate) {
      this.#filmsData[filmId][key] = dataToUpdate[key];
    }
  };

  get filmCount() {
    return this.#filmsData.length;
  }
}
