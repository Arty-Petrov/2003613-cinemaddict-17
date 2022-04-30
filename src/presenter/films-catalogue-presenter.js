
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmListContainerView from '../view/films-list-container-view';
import FilmCardView from '../view/film-card-view';
import FilmListShowMoreButtonView from '../view/films-list-show-more-button-view';
import { render } from '../render';

export default class FilmsCataloguePresenter {
  filmsSection = new FilmsView();
  filmsList = new FilmsListView();
  filmListContainer = new FilmListContainerView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsSection, this.filmsContainer);
    render(this.filmsList, this.filmsSection.getElement());
    render(this.filmListContainer, this.filmsList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmListContainer.getElement());
    }

    render(new FilmListShowMoreButtonView(), this.filmsSection.getElement());
  };
}
