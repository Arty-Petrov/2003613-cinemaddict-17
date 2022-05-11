import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import MainSortView from './view/main-sort-view';
import FilmsCataloguePresenter from './presenter/films-catalogue-presenter';
import { render } from './framework/render';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsCataloguePresenter = new FilmsCataloguePresenter();

render (new HeaderProfileView(), siteHeaderElement);
render (new MainNavigationView(), siteMainElement);
render (new MainSortView(), siteMainElement);

filmsCataloguePresenter.init(siteMainElement);
