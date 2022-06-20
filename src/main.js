import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';

import FilmsApiService from './api-services/films-api-service';

import FilmsCataloguePresenter from './presenter/films-catalogue-presenter';
import FiltersPresenter from './presenter/filters-presenter';

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';
const AUTH_KEY = 'Basic MYNzhzsu*-ZH9TimjwTfna7Z';

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTH_KEY));
const filterModel = new FilterModel();

const mainContainer = document.querySelector('main');
const profileMenuContainer = document.querySelector('.header');
const footerStatisticsContainer = document.querySelector('.footer__statistics');


new FiltersPresenter(mainContainer, profileMenuContainer, footerStatisticsContainer, filmsModel, filterModel);
new FilmsCataloguePresenter(mainContainer, filmsModel, filterModel);


// console.log('3');
// setTimeout(() => {;}, 5000);
// filmsModel.films();//?
// filtersPresenter.init();
filmsModel.init().finally();
// (() =>{
// });//?
// console.log('main', filmsModel.films());
// filtersPresenter.init();
// console.log(filmsModel.films);
// filmsCataloguePresenter.init();
