import FilmsListView from '../view/films-list-view';
import FilmsListEmptyView from '../view/films-lsit-empty-view';
import FilmsListShowMoreButtonView from '../view/films-list-show-more-button-view';

import FilmCardView from '../view/film-card-view';
import FilmCardMarkAsWhatchedButtonView from '../view/film-card-mark-as-whatched-button-view';
import FilmCardAddToWatchListButtonView from '../view/film-card-add-to-watch-list-button-view';
import FilmCardAddToFavoriteButtonView from '../view/film-card-add-to-favorite-button-view';

import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCloseButtonView from '../view/film-details-close-button-view';
import FilmDetailsMarkAsWhatchedButtonView from '../view/film-details-mark-as-whatched-button-view';
import FilmDetailsAddToWatchListButtonView from '../view/film-details-add-to-watch-list-button-view';
import FilmDetailsAddToFavoriteButtonView from '../view/film-details-add-to-favorite-button-view';
import FilmDetailsCommentView from '../view/film-details-comment-view';
import FilmDetailsNewCommentView from '../view/film-details-new-comment-view';

import FilmsModel from '../model/films-model';
import CommentsModel from '../model/comments-model';
import { render } from '../framework/render';

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
    this.#filmListEmpty = new FilmsListEmptyView();
    this.#filmsModel = new FilmsModel();
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
    this.filmDetails = filmDetails;
    const filmCardComponent = new FilmCardView(filmDetails);
    const filmCardAddToWatchListButton = new FilmCardAddToWatchListButtonView();
    const filmCardMarkAsWhatchedButton = new FilmCardMarkAsWhatchedButtonView();
    const filmCardMarkAsFavoriteButton = new FilmCardAddToFavoriteButtonView();
    render(filmCardComponent, this.#filmsList.container);

    render(filmCardAddToWatchListButton , filmCardComponent.controlsContainer);
    render(filmCardMarkAsWhatchedButton, filmCardComponent.controlsContainer);
    render(filmCardMarkAsFavoriteButton, filmCardComponent.controlsContainer);

    filmCardComponent.setClickHandler(() => this.#renderFilmDetails(filmDetails));
    filmCardAddToWatchListButton.setClickHandler(this.#addToWatchListHandler);
    filmCardMarkAsWhatchedButton.setClickHandler(this.#markAsWhatchedHandler);
    filmCardMarkAsFavoriteButton.setClickHandler(this.#markAsFavoriteHandler);
  };

  #renderFilmCards = () => {
    if (this.#filmsData.length === 0) {
      render(this.#filmListEmpty, this.#filmsList.container);
    } else {
      for (let i = 0; i < Math.min(this.#filmsData.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilmCard(this.#filmsData[i]);
      }
      render(this.#filmsListShowMoreButton, this.#filmsList.element);
      this.#filmsListShowMoreButton.setClickHandler(this.#showMoreButtonHandler);
    }
  };

  #renderFilmDetails = (filmDetails) => {
    if (this.filmDetailsPopup){
      this.#removePopup();
    }
    this.filmDetailsPopup = new FilmDetailsView(filmDetails);
    const filmDetailsContainer = document.body;
    const filmDetailsCloseButton = new FilmDetailsCloseButtonView();
    const filmDetailsAddToWatchListButton = new FilmDetailsAddToWatchListButtonView();
    const filmDetailsMarkAsWhatchedButton = new FilmDetailsMarkAsWhatchedButtonView();
    const filmDetailsMarkAsFavoriteButton = new FilmDetailsAddToFavoriteButtonView();
    const filmDetailsNewComment = new FilmDetailsNewCommentView();

    const filmCommentsData = this.#getfilmCommentsData(filmDetails);

    this.#toggleBlockScroll();
    render(this.filmDetailsPopup, filmDetailsContainer);
    render(filmDetailsCloseButton, this.filmDetailsPopup.closeButtonContainer);
    render(filmDetailsAddToWatchListButton, this.filmDetailsPopup.controlsContainer);
    render(filmDetailsMarkAsWhatchedButton, this.filmDetailsPopup.controlsContainer);
    render(filmDetailsMarkAsFavoriteButton, this.filmDetailsPopup.controlsContainer);

    filmCommentsData.forEach((el) => render(
      new FilmDetailsCommentView(el),
      this.filmDetailsPopup.commentsContainer)
    );

    render(filmDetailsNewComment, this.filmDetailsPopup.newCommentContainer);

    filmDetailsCloseButton.setClickHandler(this.#closePopupHandler);
    document.addEventListener('keydown', this.#escKeydownHandler);
    filmDetailsAddToWatchListButton.setClickHandler(this.#addToWatchListHandler);
    filmDetailsMarkAsWhatchedButton.setClickHandler(this.#markAsWhatchedHandler);
    filmDetailsMarkAsFavoriteButton.setClickHandler(this.#markAsFavoriteHandler);
  };

  #getfilmCommentsData = (filmDetails) => {
    const filmId = filmDetails.id;
    const commentsData = new CommentsModel();
    return [...commentsData.comments[filmId]];
  };

  #closePopupHandler = () => {
    this.#removePopup();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Esc' || evt.code === 'Escape'){
      this.#removePopup();
    }
  };

  #markAsWhatchedHandler = () => {
  };

  #addToWatchListHandler = () => {
  };

  #markAsFavoriteHandler = () => {
  };

  #removePopup = () => {
    this.filmDetailsPopup.element.remove();
    this.filmDetailsPopup.removeElement();
    this.#toggleBlockScroll();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #showMoreButtonHandler = () => {
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
