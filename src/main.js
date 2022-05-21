import FilmsCataloguePresenter from './presenter/films-catalogue-presenter';

const filmsCataloguePresenter = new FilmsCataloguePresenter();

filmsCataloguePresenter.init();

const filmsCountElement = document.querySelector('.footer__statistics');
const filmsCount = filmsCataloguePresenter.filmCount;
const filmsCountText = `<p>${filmsCount} ${(filmsCount===1) ? 'movie' : 'movies'} inside</p>`;
filmsCountElement.insertAdjacentHTML('afterbegin',filmsCountText);
