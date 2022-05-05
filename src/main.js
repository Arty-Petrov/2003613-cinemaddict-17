import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import MainSortView from './view/main-sort-view';
import FilmsCataloguePresenter from './presenter/films-catalogue-presenter';
import FilmsDetailsPopupPresenter from './presenter/film-details-popup-presenter';
import { render } from './render.js';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const filmsCataloguePresenter = new FilmsCataloguePresenter();
const filmsDetailsPopupPresenter = new FilmsDetailsPopupPresenter();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmId = 5;

render (new HeaderProfileView(), siteHeaderElement);
render (new MainNavigationView(), siteMainElement);
render (new MainSortView(), siteMainElement);

filmsCataloguePresenter.init(siteMainElement, filmsModel);
filmsDetailsPopupPresenter.init(siteFooterElement, filmsModel, commentsModel, filmId);
