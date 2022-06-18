import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';

import FilmsCataloguePresenter from './presenter/films-catalogue-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import CommentsModel from './model/comments-model';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
new CommentsModel(filmsModel.films);

const mainContainer = document.querySelector('main');
const profileMenuContainer = document.querySelector('.header');
const footerStatisticsContainer = document.querySelector('.footer__statistics');


const filtersPresenter = new FiltersPresenter(mainContainer, profileMenuContainer, footerStatisticsContainer, filmsModel, filterModel);
const filmsCataloguePresenter = new FilmsCataloguePresenter(mainContainer, filmsModel, filterModel);


filtersPresenter.init();
filmsCataloguePresenter.init();
