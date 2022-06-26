import CommentsModel from '../model/comments-model';

import FilmCommentView from '../view/film-comment-view';
import FilmCommentFormView from '../view/film-comment-form-view';
import FilmCommentsView from '../view/film-comments-view';

import { render, remove, replace } from '../framework/render';
import { UpdateType, UserAction } from '../utils/enum';
export default class FilmCommentsPresenter {
  static #instance = null;
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #renderedComments = new Map();
  #commentsSection = null;
  #existCommentsSection = null;
  #commentsSectionContainer = null;
  #commentsListContainer = null;
  #commentForm = null;
  #existCommentForm = null;
  #commentFormContainer = null;

  #handleDetailsActions;

  constructor (container, callback) {
    this.#handleDetailsActions = callback;
    this.#commentsSectionContainer = container;
    this.#commentsModel = new CommentsModel();
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel.init(film);

    this.#commentsModel.addObserver(this.#handleModelEvent);
  };

  destroy () {
    this.#commentsModel.removeObserver(this.#handleModelEvent);
    this.#clearCommentsSection();
  }

  static get instance() {
    return this.#instance;
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

  #renderComentsSection = () => {
    this.#existCommentsSection = this.#commentsSection;
    this.#commentsSection = new FilmCommentsView(this.#film);

    if (!this.#existCommentsSection) {
      render(this.#commentsSection, this.#commentsSectionContainer);
      return;
    }
    replace(this.#commentsSection, this.#existCommentsSection);
    remove(this.#existCommentsSection);
  };

  #renderComment = (comment) => {
    const commentData = comment;
    const commentComponent = new FilmCommentView(commentData);
    commentComponent.setDeleteCommentClickHandler(this.#handleCommentsViewActions);
    render(commentComponent, this.#commentsListContainer);
    this.#renderedComments.set(commentData.id, commentComponent);
  };

  #renderComments = () => {
    this.#commentsListContainer = this.#commentsSection.commentsListContainer;
    if (this.#renderedComments.size) {
      this.#renderedComments.forEach(
        (comment, key, map) => {
          remove(comment);
          map.delete(key);
        });
    }
    const commentsSet = this.#commentsModel.comments;
    if (commentsSet.length){
      commentsSet.forEach((comment) => {this.#renderComment(comment);});
    }
  };

  #renderCommentForm = () => {
    this.#commentFormContainer = this.#commentsSection.element;
    this.#existCommentForm = this.#commentForm;
    this.#commentForm = new FilmCommentFormView();
    if (!this.#existCommentForm) {
      render(this.#commentForm, this.#commentFormContainer);
      this.#commentForm.setNewCommentEnter(this.#handleCommentsViewActions);
      return;
    }
    replace(this.#commentForm, this.#existCommentForm);
    remove(this.#existCommentForm);
  };

  #removeComment = (commentId) => {
    remove(this.#renderedComments.get(commentId));
    this.#renderedComments.delete(commentId);
  };

  #removeCommentFromFilmData = (commentData) => {
    const index = this.#film.comments.findIndex((comment) => comment === commentData);
    this.#film.comments = [
      ...this.#film.comments.slice(0, index),
      ...this.#film.comments.slice(index + 1),
    ];
  };

  updateFilmInfo = (data) => {
    this.#film = data;
    this.#commentsSection.setCommentsCount(this.#film.comments.length);
  };

  #setDeleting = (element) => {
    element.updateElement({
      isDeleting: true,
    });
  };

  #setSaving = () => {
    this.#commentForm.updateElement({
      isSaving: true,
    });
  };

  #setAborting = (element) => {
    element.shake();
  };

  #handleModelEvent = (updateType, commentData) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (commentData.movie) {
          this.#renderComment(commentData.comments);
          this.#commentForm.element.scrollIntoView(top);
          this.#commentForm.reset();
          this.#handleDetailsActions(UserAction.ADD_COMMENT, UpdateType.PATCH, commentData.movie);
          return;
        }
        this.#removeComment(commentData);
        this.#removeCommentFromFilmData(commentData);
        this.#handleDetailsActions(UserAction.DELETE_COMMENT, UpdateType.PATCH, this.#film);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
      case UpdateType.INIT:
        this.#renderComentsSection();
        this.#renderComments();
        this.#renderCommentForm();
        break;
    }
  };

  #handleCommentsViewActions = async (actionType, updateComment) => {
    const commentElement = (UserAction.DELETE_COMMENT === actionType) ?
      this.#renderedComments.get(updateComment.id) : '';
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        try {
          this.#setSaving();
          this.#commentsModel.addComment(UpdateType.PATCH, this.#film, updateComment);
        } catch (err) {
          this.#setAborting(this.#commentForm);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          this.#setDeleting(commentElement);
          this.#commentsModel.deleteComment(UpdateType.PATCH, updateComment);
        } catch (err) {
          this.#setAborting(commentElement);
        }
        break;
    }
  };
}
