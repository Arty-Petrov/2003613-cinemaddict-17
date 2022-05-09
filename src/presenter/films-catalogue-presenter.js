import FilmsListView from '../view/films-list-view';
import FilmsListEmptyView from '../view/films-lsit-empty-view';
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
  #filmsListShowMoreButton = null;
  #filmsList = null;
  #filmListEmpty = null;

  #filmsModel = null;
  #filmsData = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  init = (filmsContainer) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsList = new FilmsListView();
    this.#filmsModel = new FilmsModel();
    this.#filmListEmpty = new FilmsListEmptyView();
    this.#filmsData = [...this.#filmsModel.films];
    this.#filmsListShowMoreButton = new FilmsListShowMoreButtonView();

    render(this.#filmsList, this.#filmsContainer);
    this.#renderFilmCards();
  };

  #toggleBlockScroll = () => {
    const siteMainElement = document.querySelector('main');
    if (!siteMainElement.classList.contains(BLOCK_SCROLL_CLASS)) {
      siteMainElement.classList.add(BLOCK_SCROLL_CLASS);
    } else {
      siteMainElement.classList.remove(BLOCK_SCROLL_CLASS);
    }
  };

  #renderFilmCard = (filmDetails) => {
    const filmCardComponent = new FilmCardView(filmDetails);
    render(filmCardComponent, this.#filmsList.container);
    filmCardComponent.showFilmDetailsButton.addEventListener('click', () => {this.#renderFilmDetails(filmDetails);});
    filmCardComponent.markAsWhatchedButton.addEventListener('click', () => {});
    filmCardComponent.addToWatchListButton.addEventListener('click', () => {});
    filmCardComponent.markAsFavoriteButton.addEventListener('click', () => {});
  };

  #renderFilmCards = () => {
    if (this.#filmsData.length === 0) {
      render(this.#filmListEmpty, this.#filmsList.container);
    } else {
      for (let i = 0; i < Math.min(this.#filmsData.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilmCard(this.#filmsData[i]);
      }
      render(this.#filmsListShowMoreButton, this.#filmsList.element);
      this.#filmsListShowMoreButton.element.addEventListener('click',this.#loadMoreButtonHandler);
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
    this.filmDetailsPopup.removeElement();
    this.#toggleBlockScroll();
  };

  #getfilmCommentsData = (filmDetails) => {
    const filmId = filmDetails.id;
    const commentsData = new CommentsModel();
    return [...commentsData.comments[filmId]];
  };

  #loadMoreButtonHandler = (evt) => {
    evt.preventDefault();
    this.#filmsData
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#filmsData.length) {
      this.#filmsListShowMoreButton.element.remove();
      this.#filmsListShowMoreButton.removeElement();
    }
  };
}
