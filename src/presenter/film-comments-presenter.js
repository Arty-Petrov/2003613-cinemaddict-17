import FilmCommentView from '../view/film-comment-view';
import FilmCommentFormView from '../view/film-comment-form-view';
import CommentsModel from '../model/comments-model';

import { render, remove } from '../framework/render';
import { UpdateType, UserAction } from '../enum';
import FilmCommentsView from '../view/film-comments-view';
import FilmsModel from '../model/films-model';

export default class FilmCommentsPresenter {
  static #instance = null;
  #filmData = null;
  #commentsModel = null;
  #filmsModel = null;
  #renderedComments = new Map();

  #commentsSection = null;
  #commentsSectionContainer = null;
  #commentsListContainer = null;
  #commentForm = null;
  #commentFormContainer = null;

  constructor (container) {
    this.#commentsSectionContainer = container;
    if (!FilmCommentsPresenter.#instance) {
      FilmCommentsPresenter.#instance = this;
      return;
    }
    return FilmCommentsPresenter.#instance;
  }

  init = (filmData) => {
    this.#filmData = filmData;
    this.#commentsModel = new CommentsModel();
    this.#filmsModel = new FilmsModel();

    if (this.#commentsSection) {
      this.#clearCommentsSection();
    }

    this.#commentsSection = new FilmCommentsView(this.#filmData);
    this.#commentsListContainer = this.#commentsSection.commentsListContainer;
    this.#commentFormContainer = this.#commentsSection.element;

    this.#commentForm = new FilmCommentFormView();

    render(this.#commentsSection, this.#commentsSectionContainer);
    this.#renderComments(this.#filmData);
    this.#renderCommentForm();

    this.#commentsModel.addObserver(this.#handleModelEvent);
  };

  destroy () {
    this.#clearCommentsSection();
    FilmCommentsPresenter.#instance = null;
  }

  #clearCommentsSection = () => {
    this.#renderedComments.forEach(
      (comment, key, map) => {
        remove(comment);
        map.delete(key);
      });
    remove(this.#commentForm);
    remove(this.#commentsSection);
  };

  #renderComment = (comment) => {
    const commentData = comment;
    const commentComponent = new FilmCommentView(commentData);
    commentComponent.setDeleteCommentClickHandler(this.#handleViewAction);
    render(commentComponent, this.#commentsListContainer);
    this.#renderedComments.set(commentData.id, commentComponent);
  };

  #renderComments = (filmData) => {
    const filmCommentsSet = this.#getFilmCommentsData(filmData);
    if (filmCommentsSet.length){
      filmCommentsSet.forEach((comment) => {this.#renderComment(comment);});
    }
  };

  #renderCommentForm = () => {
    render(this.#commentForm, this.#commentFormContainer);
    this.#commentForm.setNewCommentEnter(this.#handleViewAction);
  };

  #getFilmCommentsData = (filmData) => {
    const commentsIds = filmData.comments;
    const comments = this.#commentsModel.comments;
    const filmCommetnsData = [];
    if (commentsIds.length){
      commentsIds.forEach((id) => {
        const commentIndex = comments.map((el) => el.id).indexOf(id);
        filmCommetnsData.push(comments[commentIndex]);
      });
    }
    return filmCommetnsData;
  };

  #handleModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      switch (typeof data) {
        case 'string':
          remove(this.#renderedComments.get(data));
          this.#renderedComments.delete(data);
          this.#commentsSection.setCommentsCount(this.#renderedComments.size);
          break;
        default:
          this.#renderComment(data);
          this.#commentsSection.setCommentsCount(this.#renderedComments.size);
          break;
      }
    }
  };

  #handleViewAction = (actionType, updateType, updateData) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, this.#filmData, updateData);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, this.#filmData, updateData);
        break;
    }
  };
}
