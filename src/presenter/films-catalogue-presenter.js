import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmListContainerView from '../view/films-list-container-view';
import FilmCardView from '../view/film-card-view';
import FilmListShowMoreButtonView from '../view/films-list-show-more-button-view';
import { render } from '../render';

//const FILMS_COUNT_PER_STEP = 5;

export default class FilmsCataloguePresenter {
  #filmsContainer = null;
  #filmsSection = new FilmsView();
  #filmsList = new FilmsListView();
  #filmListContainer = new FilmListContainerView();

  #filmsModel = null;
  #filmsCatalogue = [];

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filmsCatalogue = [...this.#filmsModel.films];

    render(this.#filmsSection, this.#filmsContainer);
    render(this.#filmsList, this.#filmsSection.element);
    render(this.#filmListContainer, this.#filmsList.element);

    this.#filmsCatalogue.forEach((el) => this.#renderFilmCard(el));

    render(new FilmListShowMoreButtonView(), this.#filmsSection.element);
  };

  #renderFilmCard = (filmDetails) => {
    const filmCardComponent = new FilmCardView(filmDetails);
    render(filmCardComponent, this.#filmListContainer.element);
  };
}
