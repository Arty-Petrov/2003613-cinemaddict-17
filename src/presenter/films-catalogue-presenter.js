import { sortByDate, sortByRating } from '../utils/filter';
import { SortType, UpdateType, UserAction, FilterType } from '../enum';


import { filter } from '../utils/filter';
import FilmsListView from '../view/films-list-view';
import MainSortView from '../view/main-sort-view';
import FilmsListEmptyView from '../view/films-list-empty-view';
import ShowMoreButtonPresenter from './show-more-button-presenter';

import FilmCardPresenter from './film-card-presenter';
import { render, remove } from '../framework/render';

const FILMS_COUNT_PER_STEP = 5;
export default class FilmsCataloguePresenter {
  #filmsSortMenu = null;
  #mainContainer = null;
  #filmsList = null;
  #showMoreButton = null;
  #filmListEmpty = null;
  #existfilmListEmpty = false;

  #filmsModel = null;
  #filmsData = null;
  #filterModel = null;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #renderedFilms = new Map();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor (mainContainer ,filmsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredFilms].sort(sortByDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortByRating);
      default:
        return [...filteredFilms];
    }
  }

  init = () => {
    this.#filmsData = this.films;
    this.#filmsList = new FilmsListView();
    this.#filmsSortMenu = new MainSortView();
    this.#filmListEmpty = new FilmsListEmptyView();
    this.#showMoreButton = new ShowMoreButtonPresenter();

    this.#renderFilmsSortMenu();
    this.#renderFilmCatalogue();
  };

  #renderFilmsSortMenu = () => {
    if (this.#filmsData.length) {
      render(this.#filmsSortMenu, this.#mainContainer);
      this.#filmsSortMenu.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
  };

  #renderFilmCard = (filmData) => {
    const filmCardComponent = new FilmCardPresenter(this.#filmsList.container, this.#handleViewAction);
    filmCardComponent.init(filmData);
    this.#renderedFilms.set(filmData.id, filmCardComponent);
  };

  #renderFilmCatalogue = () => {
    render(this.#filmsList, this.#mainContainer);
    const filmsCount = this.#filmsData.length;
    if (filmsCount === 0) {
      this.#existfilmListEmpty = !this.#existfilmListEmpty;
      this.#filmListEmpty.init(this.#filterType);
      render(this.#filmListEmpty, this.#filmsList.container);
    } else {
      for (let i = 0; i < Math.min(filmsCount, this.#renderedFilmsCount); i++) {
        this.#renderFilmCard(this.#filmsData[i]);
      }
      if (filmsCount > this.#renderedFilmsCount) {
        this.#showMoreButton.init(this.#filmsList.element, this.#handleShowMoreButton);
      }
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#filmsData = this.films;
    this.#cleanUpFilmsList();
    this.#renderFilmCatalogue();
  };

  #cleanUpFilmsList = (updateType) => {
    this.#renderedFilms.forEach((presenter) => presenter.destroy());
    this.#renderedFilms.clear();
    this.#showMoreButton.destroy();

    if (this.#existfilmListEmpty) {
      this.#existfilmListEmpty = !this.#existfilmListEmpty;
      remove(this.#filmListEmpty);
    }
    const filmsCount = this.#filmsData.length;
    const currentUpdateType = (updateType);
    if (currentUpdateType === UpdateType.MAJOR || !(filmsCount > 0)) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
      remove(this.#filmsSortMenu);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#renderedFilms.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#cleanUpFilmsList();
        this.#renderFilmCatalogue();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DEFAULT;
        this.#filmsData = this.films;
        this.#cleanUpFilmsList(UpdateType.MAJOR);
        this.#renderFilmsSortMenu();
        this.#renderFilmCatalogue();
        break;
      case UpdateType.INIT:
        this.init();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, updateData) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, updateData);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, updateData);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, updateData);
        break;
    }
  };
}
