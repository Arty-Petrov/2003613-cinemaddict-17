import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCommentView from '../view/film-details-comment-view';
import FilmDetailsNewCommentView from '../view/film-details-new-comment-view';

import { render, replace, remove } from '../framework/render';

const BLOCK_SCROLL_CLASS = 'hide-overflow';

export default class FilmDetailsPresenter {
  static #instance = null;
  #filmDetailsContainer = null;
  #filmDetailsPopup = null;
  #existFilmDetailsPopup = null;
  #filmDetailsNewComment = null;
  #filmData = null;
  #filmCommentsData = null;

  #handleCardAddToWatchList = null;
  #handleCardMarkAsWhatched = null;
  #handleCardMarkAsFavorite = null;


  constructor() {
    if (!FilmDetailsPresenter.#instance) {
      FilmDetailsPresenter.#instance = this;
      return;
    }
    return FilmDetailsPresenter.#instance;
  }

  init = (filmData, filmCommentsData, callback) => {
    this.#filmData = filmData;
    this.#filmCommentsData = filmCommentsData;
    this.#existFilmDetailsPopup = this.#filmDetailsPopup;

    const [
      handleAddToWatchList,
      handleMarkAsWhatched,
      handleMarkAsFavorite,
    ] = callback;

    this.#handleCardAddToWatchList = handleAddToWatchList;
    this.#handleCardMarkAsWhatched = handleMarkAsWhatched;
    this.#handleCardMarkAsFavorite = handleMarkAsFavorite;

    this.#filmDetailsContainer = document.body;
    this.#filmDetailsPopup = new FilmDetailsView(this.#filmData);

    this.#filmDetailsPopup.setCloseButtonHandler(this.#handleClosePopup);
    document.addEventListener('keydown', this.#handleEscKeydown);

    this.#filmDetailsPopup.setAddToWatchListHandler(this.#handleAddToWatchList);
    this.#filmDetailsPopup.setMarkAsWhatchedHandler(this.#handleMarkAsWhatched);
    this.#filmDetailsPopup.setMarkAsFavoriteHandler(this.#handleMarkAsFavorite);

    this.#filmDetailsNewComment = new FilmDetailsNewCommentView();

    if (!this.#existFilmDetailsPopup) {
      this.#toggleBlockScroll();
      render(this.#filmDetailsPopup, this.#filmDetailsContainer);

      this.#renderComments(this.#filmCommentsData);
      this.#renderNewCommentForm();

      this.#existFilmDetailsPopup = this.#filmDetailsPopup;

    } else if (this.#filmDetailsContainer.contains(this.#existFilmDetailsPopup.element)) {
      replace(this.#filmDetailsPopup, this.#existFilmDetailsPopup);
      this.#renderComments(this.#filmCommentsData);
      render(
        this.#filmDetailsNewComment,
        this.#filmDetailsPopup.newCommentContainer
      );
    }
  };

  #handleAddToWatchList = () => {
    const inWatchlist = !this.#filmData.userDetails.watchlist;
    this.#filmDetailsPopup.setAddToWatchList(inWatchlist);
    this.#handleCardAddToWatchList();
  };

  #handleMarkAsWhatched = () => {
    const isWatched = !this.#filmData.userDetails.alreadyWatched;
    this.#filmDetailsPopup.setMarkAsWhatched(isWatched);
    this.#handleCardMarkAsWhatched();
  };

  #handleMarkAsFavorite = () => {
    const isFavorite = !this.#filmData.userDetails.favorite;
    this.#filmDetailsPopup.setMarkAsFavorite(isFavorite);
    this.#handleCardMarkAsFavorite();
  };

  #handleClosePopup = () => {
    this.#toggleBlockScroll();
    document.removeEventListener('keydown', this.#handleEscKeydown);
    // document.removeEventListener('keydown', this.#handleCtrCmdEnterKeydown);
    this.destroy();
  };

  #handleEnterNewComment = () => {
    const dataToUpdate = {};
    dataToUpdate['id'] = this.#filmData.id;
    dataToUpdate['emotion'] = '';
    dataToUpdate['comment'] = '';
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Esc' || evt.code === 'Escape') {
      this.destroy();
    }
  };

  #handleCtrCmdEnterKeydown = (evt, newCommentInput) => {
    const {emotion, comment} = newCommentInput;
    const newCommentData = {
      author: 'new author',
      comment: comment,
      date: new Date(),
      emotion: emotion,
    };
    this.#renderComment(newCommentData);
  };

  #toggleBlockScroll = () => {
    const siteMainElement = document.body;
    if (!siteMainElement.classList.contains(BLOCK_SCROLL_CLASS)) {
      siteMainElement.classList.add(BLOCK_SCROLL_CLASS);
    } else {
      siteMainElement.classList.remove(BLOCK_SCROLL_CLASS);
    }
  };

  #renderNewCommentForm = () => {
    render(this.#filmDetailsNewComment, this.#filmDetailsPopup.newCommentContainer);
    this.#filmDetailsNewComment.setNewCommentEnter(this.#handleCtrCmdEnterKeydown);
  };

  #renderComments = (filmCommentsData) => {
    filmCommentsData.forEach((filmComment) => {
      this.#renderComment(filmComment);});
  };

  #renderComment = (filmComment) => {
    render(
      new FilmDetailsCommentView(filmComment),
      this.#filmDetailsPopup.commentsContainer
    );
  };

  destroy = () => {
    remove(this.#filmDetailsPopup);
    FilmDetailsPresenter.#instance = null;
  };
}
