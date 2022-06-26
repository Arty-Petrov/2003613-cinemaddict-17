/* eslint-disable no-trailing-spaces */
import { render, remove, RenderPosition, replace } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { filter, getTwoMostCommented, getTwoTopRated } from '../utils/filter';
import { sortByDate, sortByRating } from '../utils/filter';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/enum';

import FilmsListView from '../view/films-list-view';
import FilmsListExtraView from '../view/films-list-extra-view';
import MainSortView from '../view/main-sort-view';
import FilmsListEmptyView from '../view/films-list-empty-view';
import LoadingView from '../view/loading-view';
import FilmCardPresenter from './film-card-presenter';
import HeaderProfileView from '../view/header-profile-view';
import MainNavigationView from '../view/main-navigation-view';
import FooterStatisticsView from '../view/footer-statistics-view';

import ShowMoreButtonPresenter from './show-more-button-presenter';

const FILMS_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const FilmLists = {
  CATALOGUE: 'CATALOGUE',
  TOP_RATED: 'TOP_RATED',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

const ExtraFilmsLists = {
  TOP_RATED: {
    heading:'Top rated',
    films: null
  },
  MOST_COMMENTED: {
    heading:'Most commented',
    films: null
  },
};

const FilmCardMethod = {
  UPDATE: 'init',
  SAVING: 'setSaving',
  ABORTING: 'setAborting',
  DESTROY: 'destroy',
};

export default class CataloguePresenter {
  #mainContainer = null;
  #filmsSortMenu = new MainSortView();
  #loadingComponent = new LoadingView();
  #filmsList = new FilmsListView();
  #showMoreButton = new ShowMoreButtonPresenter();
  #filmListEmpty = new FilmsListEmptyView();
  #profileMenu = null;
  #profileMenuContainer = null;
  #navigationMenu = null;
  #footerStatisticsContent = null;
  #footerStatisticsContainer = null;

  #filmsModel = null;
  #filmsData = null;
  #filtersModel = null;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #existfilmListEmpty = false;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #renderedTopFilmsSection = new Map();
  #renderedFilms = {
    CATALOGUE: new Map(),
    TOP_RATED: new Map(),
    MOST_COMMENTED: new Map(),
  };

  constructor (mainContainer, profileContainer, footerContainer, filmsModel, filtersModel) {
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#mainContainer = mainContainer;
    this.#profileMenuContainer = profileContainer;
    this.#footerStatisticsContainer = footerContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filtersModel.filter;
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

  get filters() {
    const films = this.#filmsModel.films;
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Whatchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    this.#renderLoading();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsList.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilters = () => {

    const filters = this.filters;
    const prevNavigationMenu = this.#navigationMenu;
    const prevProfileMenu = this.#profileMenu;

    this.#profileMenu = new HeaderProfileView (filters);
    this.#navigationMenu = new MainNavigationView(filters, this.#filtersModel.filter);
    this.#footerStatisticsContent = new FooterStatisticsView(this.#filmsModel.films.length);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (prevNavigationMenu === null) {
      render(this.#profileMenu, this.#profileMenuContainer);
      render(this.#navigationMenu, this.#mainContainer);
      this.#navigationMenu.setNavigationTypeChangeHandler(this.#handleNavigationTypeChange);
      render(this.#footerStatisticsContent, this.#footerStatisticsContainer);
      return;
    }
    replace(this.#profileMenu, prevProfileMenu);
    remove(prevProfileMenu);
    replace(this.#navigationMenu, prevNavigationMenu);
    remove(prevNavigationMenu);
    this.#navigationMenu.setNavigationTypeChangeHandler(this.#handleNavigationTypeChange);
  };

  #renderFilmsSortMenu = () => {
    if (this.#filmsData.length) {
      render(this.#filmsSortMenu, this.#filmsList.element, RenderPosition.BEFOREBEGIN);
      this.#filmsSortMenu.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
  };

  #renderFilmCatalogue = () => {
    render(this.#filmsList, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#filmsData = this.films;
    const filmsCount = this.#filmsData.length;

    this.#renderFilmsSortMenu();

    if (filmsCount === 0) {
      this.#existfilmListEmpty = !this.#existfilmListEmpty;
      this.#filmListEmpty.init(this.#filterType);
      render(this.#filmListEmpty, this.#filmsList.container);
      return;
    }

    for (let i = 0; i < Math.min(filmsCount, this.#renderedFilmsCount); i++) {
      this.#renderFilmCard(this.#filmsData[i], FilmLists.CATALOGUE, this.#filmsList.container);
    }
    if (filmsCount > this.#renderedFilmsCount) {
      this.#showMoreButton.init(this.#filmsList.element, this.#handleShowMoreButton);
    }
  };

  #renderTopRatedFilms = () => {
    const filmsDataAll = this.#filmsModel.films;
    ExtraFilmsLists.TOP_RATED.films = getTwoTopRated(filmsDataAll);
    ExtraFilmsLists.MOST_COMMENTED.films = getTwoMostCommented(filmsDataAll);

    for (const filmList in ExtraFilmsLists) {
      const filmsCount = ExtraFilmsLists[filmList].films.length;
      const existTopFilstSection = this.#renderedTopFilmsSection.get(filmList);

      if (!existTopFilstSection) {
        if (!filmsCount) {
          continue;
        }
        this.#renderTopRatedFilmsSection(filmList);
        continue;
      }
      if (filmsCount) {
        this.#cleanUpTopRatedFilms(filmList);
        this.#renderTopRatedFilmsSection(filmList);
      }
    }
  };

  #renderTopRatedFilmsSection = (filmList) => { 
    this.#renderedTopFilmsSection.set(
      filmList, new FilmsListExtraView(ExtraFilmsLists[filmList].heading));

    const filmCardsContainer = this.#renderedTopFilmsSection.get(filmList).container;
    render(this.#renderedTopFilmsSection.get(filmList), this.#filmsList.element);

    ExtraFilmsLists[filmList].films.forEach((filmData) => {
      this.#renderFilmCard(filmData, FilmLists[filmList], filmCardsContainer);
    });
  };

  #cleanUpTopRatedFilms = (filmList) => {
    this.#renderedFilms[filmList].forEach((presenter) => presenter.destroy());
    this.#renderedFilms[filmList].clear();
    this.#removeTopRatedFilmsSection(filmList);  
  };

  #removeTopRatedFilmsSection = (filmList) => {
    if (this.#renderedTopFilmsSection.get(filmList)){
      remove(this.#renderedTopFilmsSection.get(filmList));
      this.#renderedTopFilmsSection.delete(filmList);
    }
  };

  #upadateMostCommentedList = (updateData) => {
    const renderedMostCommented = [...this.#renderedFilms[FilmLists.MOST_COMMENTED]];
    const index = renderedMostCommented.findIndex((film) => film.id === updateData.id);
    
    if (index) {
      this.#renderTopRatedFilmsSection(FilmLists.MOST_COMMENTED);
    }
  };      

  #renderFilmCard = (filmData, filmList, element) => {
    const filmCardComponent = new FilmCardPresenter(element, this.#handleViewAction);
    filmCardComponent.init(filmData);
    this.#renderedFilms[filmList].set(filmData.id, filmCardComponent);
  };

  #setFilmCards = (filmCardMethod, updateData = '', payload = '') => {
    for (const filmList in this.#renderedFilms) {
      if (!updateData) {
        this.#renderedFilms[filmList].forEach((presenter) => presenter[filmCardMethod]());
        continue;
      }
      if (this.#renderedFilms[filmList].get(updateData.id)) {
        this.#renderedFilms[filmList].get(updateData.id)[filmCardMethod](payload);
      }
    }
    
  };

  #handleShowMoreButton = () => {
    this.#filmsData
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film, FilmLists.CATALOGUE, this.#filmsList.container));

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
    this.#cleanUpFilmsList();
    this.#renderFilmCatalogue();
    this.#renderTopRatedFilms();
  };

  #handleNavigationTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #cleanUpFilmsList = (updateType) => {
    this.#setFilmCards(FilmCardMethod.DESTROY);
    for (const filmList in this.#renderedFilms) {
      this.#renderedFilms[filmList].clear();
    }
    for (const filmList in ExtraFilmsLists) {
      this.#removeTopRatedFilmsSection(filmList);
    }

    this.#showMoreButton.destroy();

    if (this.#existfilmListEmpty) {
      this.#existfilmListEmpty = !this.#existfilmListEmpty;
      remove(this.#filmListEmpty);
    }
    const filmsCount = this.#filmsData.length;
    const currentUpdateType = updateType;
    if (currentUpdateType === UpdateType.MAJOR || !(filmsCount > 0)) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
      remove(this.#filmsSortMenu);
    }
  };

  #handleModelEvent = (updateType, updateData) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#setFilmCards(FilmCardMethod.UPDATE, updateData, updateData); 
        this.#renderTopRatedFilms();
        break;
      case UpdateType.MINOR:
        this.#filmsData = this.films;
        this.#cleanUpFilmsList();
        for (const filmList in ExtraFilmsLists) {
          this.#removeTopRatedFilmsSection(filmList);
        }
        this.#renderFilters();
        this.#renderFilmCatalogue();
        this.#renderTopRatedFilms();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DEFAULT;
        this.#filmsData = this.films;
        this.#cleanUpFilmsList(UpdateType.MAJOR);
        this.#renderFilters();
        this.#renderFilmCatalogue();
        this.#renderTopRatedFilms();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#renderFilters();
        this.#renderFilmCatalogue();
        this.#renderTopRatedFilms();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, updateData, userDetailsType = null) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_DETAILS:
        this.#setFilmCards(FilmCardMethod.SAVING, updateData, userDetailsType);
        try {
          await this.#filmsModel.updateFilm(updateType, updateData);
        } catch(err) {
          this.#setFilmCards(FilmCardMethod.ABORTING, updateData);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilmComments(updateType, updateData);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilmComments(updateType, updateData);
        break;
    }
    this.#uiBlocker.unblock();
  };
}
