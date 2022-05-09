import FilmsView from '../view/films-view';
import FilmsListShowMoreButtonView from '../view/films-list-show-more-button-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCommentView from '../view/film-details-comment-view';
import FilmDetailsNewCommentView from '../view/film-details-new-comment-view';
import FilmsModel from '../model/films-model';
import CommentsModel from '../model/comments-model';
import { render } from '../render';

const FILMS_COUNT_PER_STEP = 5;
const BLOCK_SCROLL_CLASS = 'hide-overflow';

export default class FilmsCataloguePresenter {
  #filmsContainer = null;
  #filmsCatalogue = new FilmsView();

  #filmsModel = null;
  #filmsData = [];
  #filmsDataForStep = [];

  init = (filmsContainer) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = new FilmsModel();
    this.#filmsData = [...this.#filmsModel.films];

    render(this.#filmsCatalogue, this.#filmsContainer);

    this.#filmsDataForStep = this.#filmsData.slice(FILMS_COUNT_PER_STEP);
    this.#filmsDataForStep.forEach((el) => this.#renderFilmCard(el));

    render(new FilmsListShowMoreButtonView(), this.#filmsCatalogue.element);
  };

  #renderFilmCard = (filmDetails) => {
    const filmCardComponent = new FilmCardView(filmDetails);
    render(filmCardComponent, this.#filmsCatalogue.container);
    filmCardComponent.showFilmDetailsButton.addEventListener('click', () => {this.#renderFilmDetails(filmDetails);});
    filmCardComponent.markAsWhatchedButton.addEventListener('click', () => {});
    filmCardComponent.addToWatchListButton.addEventListener('click', () => {});
    filmCardComponent.markAsFavoriteButton.addEventListener('click', () => {});
  };

  #toggleBlockScroll = () => {
    const siteMainElement = document.querySelector('main');
    if (!siteMainElement.classList.contains(BLOCK_SCROLL_CLASS)) {
      siteMainElement.classList.add(BLOCK_SCROLL_CLASS);
    } else {
      siteMainElement.classList.remove(BLOCK_SCROLL_CLASS);
    }
  };

  #renderFilmDetails = (filmDetails) => {
    if (this.filmDetailsPopup){
      this.#removePopup();
    }
    const filmDetailsContainer = document.body;
    const filmCommentsData = this.#getfilmCommentsData(filmDetails);
    const filmDetailsNewComment = new FilmDetailsNewCommentView();
    this.filmDetailsPopup = new FilmDetailsView(filmDetails);
    this.#toggleBlockScroll();
    render(this.filmDetailsPopup, filmDetailsContainer);
    filmCommentsData.forEach((el) => render(new FilmDetailsCommentView(el), this.filmDetailsPopup.commentsContainer));
    render(filmDetailsNewComment, this.filmDetailsPopup.newCommentContainer);

    this.filmDetailsPopup.closeButton.addEventListener('click', this.#closePopupHandler);
    document.addEventListener('keydown', this.#closePopupHandler);
  };

  #closePopupHandler = (evt) => {
    if (evt.type === 'click' || evt.code === 'Escape'){
      this.#removePopup();
      document.removeEventListener('keydown', this.#closePopupHandler);
    }
  };

  #removePopup = () => {
    this.filmDetailsPopup.element.remove();
    this.#toggleBlockScroll();
  };

  #getfilmCommentsData = (filmDetails) => {
    const filmId = filmDetails.id;
    const commentsData = new CommentsModel();
    return [...commentsData.comments[filmId]];
  };
}
