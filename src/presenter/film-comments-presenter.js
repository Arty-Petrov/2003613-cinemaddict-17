import CommentsModel from '../model/comments-model';

import FilmCommentView from '../view/film-comment-view';
import FilmCommentFormView from '../view/film-comment-form-view';
import FilmCommentsView from '../view/film-comments-view';

import { render, remove } from '../framework/render';
import { UpdateType, UserAction } from '../enum';
export default class FilmCommentsPresenter {
  static #instance = null;
  #film = null;
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

    if (this.#commentsSection) {
      this.#clearCommentsSection();
    }

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

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
      case UpdateType.INIT:
        this.#renderComments();
        break;
    }
    // if (updateType === UpdateType.PATCH) {
    //   switch (typeof data) {
    //     case 'string':
    //       remove(this.#renderedComments.get(data));
    //       this.#renderedComments.delete(data);
    //       this.#commentsSection.setCommentsCount(this.#renderedComments.size);
    //       break;
    //     default:
    //       this.#renderComment(data);
    //       this.#commentsSection.setCommentsCount(this.#renderedComments.size);
    //       break;
    //   }
    // }
  };

  #handleViewAction = (actionType, updateType, updateData) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, this.#film, updateData);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, this.#film, updateData);
        break;
    }
  };
}
