/* eslint-disable indent */
import CommentsModel from '../model/comments-model';

import FilmCommentView from '../view/film-comment-view';
import FilmCommentFormView from '../view/film-comment-form-view';
import FilmCommentsView from '../view/film-comments-view';

import { render, remove } from '../framework/render';
import { UpdateType, UserAction } from '../enum';
import FilmsModel from '../model/films-model';
export default class FilmCommentsPresenter {
  static #instance = null;
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #renderedComments = new Map();

  #commentsSection = null;
  #commentsSectionContainer = null;
  #commentsListContainer = null;
  #commentForm = null;
  #commentFormContainer = null;

  constructor (container) {
    this.#commentsSectionContainer = container;
    if (!FilmCommentsPresenter.#instance) {
      this.#filmsModel = new FilmsModel();
      this.#commentsModel = new CommentsModel();
      FilmCommentsPresenter.#instance = this;
      this.#commentsModel.addObserver(this.#handleModelEvent);
      return;
    }
    return FilmCommentsPresenter.#instance;
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel.init(film);

    this.#commentsSection = new FilmCommentsView(this.#film);
    this.#commentsListContainer = this.#commentsSection.commentsListContainer;
    this.#commentFormContainer = this.#commentsSection.element;

    this.#commentForm = new FilmCommentFormView();

    render(this.#commentsSection, this.#commentsSectionContainer);
    this.#renderCommentForm();
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

  #renderComments = () => {
    const commentsSet = this.#commentsModel.comments;
    if (commentsSet.length){
      commentsSet.forEach((comment) => {this.#renderComment(comment);});
    }
  };

  #renderCommentForm = () => {
    render(this.#commentForm, this.#commentFormContainer);
    this.#commentForm.setNewCommentEnter(this.#handleViewAction);
  };

  #removeComment = (commentId) => {
    remove(this.#renderedComments.get(commentId));
    this.#renderedComments.delete(commentId);
  };

  updateFilmInfo = (data) => {
    this.#film = data;
    this.#commentsSection.setCommentsCount(this.#film.comments.length);
  };

  #handleModelEvent = async (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (typeof data === 'string') {
          this.#removeComment(data);
          this.#filmsModel.updateFilmById(UpdateType.PATCH, this.#film.id);
          return;
        }
        this.#renderComment(data);
        this.#commentForm.element.scrollIntoView(top);
        this.#filmsModel.updateFilmById(UpdateType.PATCH, this.#film.id);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
      case UpdateType.INIT:
        this.#renderComments();
        break;
    }
  };

  #handleViewAction = (actionType, updateComment) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(UpdateType.PATCH, this.#film, updateComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(UpdateType.PATCH, updateComment);
        break;
    }
  };
}
