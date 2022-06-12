import HeaderProfileView from '../view/header-profile-view';
import MainNavigationView from '../view/main-navigation-view';
import FooterStatisticsView from '../view/footer-statistics-view';
import { remove, render, replace } from '../framework/render';
import { filter } from '../utils/filter';
import { FilterType, UpdateType } from '../enum';


export default class FiltersPresenter {
  #filmsModel = null;
  #filterModel = null;
  #mainContainer = null;
  #profileMenu = null;
  #profileMenuContainer = null;
  #navigationMenu = null;
  #footerStatisticsContent = null;
  #footerStatisticsContainer = null;

  constructor (mainContainer, profileContainer, footerContainer, filmsModel, filtersModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filtersModel;
    this.#profileMenuContainer = profileContainer;
    this.#footerStatisticsContainer = footerContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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
    const filters = this.filters;
    const prevNavigationMenu = this.#navigationMenu;
    const prevProfileMenu = this.#profileMenu;

    this.#profileMenu = new HeaderProfileView(filters);
    this.#navigationMenu = new MainNavigationView(filters, this.#filterModel.filter);
    this.#footerStatisticsContent = new FooterStatisticsView(this.#filmsModel.films.length);

    if (prevNavigationMenu === null) {
      render(this.#profileMenu, this.#profileMenuContainer);
      render(this.#navigationMenu, this.#mainContainer);
      this.#navigationMenu.setNavigationTypeChangeHandler(this.#handleNavigationTypeChange);
      render(this.#footerStatisticsContent, this.#footerStatisticsContainer);
      return;
    }
    replace (this.#profileMenu, prevProfileMenu);
    remove (prevProfileMenu);
    replace (this.#navigationMenu, prevNavigationMenu);
    remove (prevNavigationMenu);
    this.#navigationMenu.setNavigationTypeChangeHandler(this.#handleNavigationTypeChange);
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this.init();
        break;
      case UpdateType.MAJOR:
        this.init();
        break;
    }
  };

  #handleNavigationTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
