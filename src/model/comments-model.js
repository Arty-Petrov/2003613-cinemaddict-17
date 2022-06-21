import Observable from '../framework/observable';
import { UpdateType } from '../enum';
export default class CommentsModel extends Observable {
  static #instance = null;
  #commentsApiService = [];
  #comments = null;

  constructor (commentsApiService) {
    if (!CommentsModel.#instance) {
      super();
      this.#commentsApiService = commentsApiService;
      CommentsModel.#instance = this;
      return;
    }
    return CommentsModel.#instance;
  }

  init = async (film) => {
    try {
      const comments = await this.#commentsApiService.comments(film);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (error) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT, this.#comments);
  };

  get comments () {
    return this.#comments;
  }

  createComment = async (updateType, film, update) => {
    try {
      const response = await this.#commentsApiService.createComment(film, update);
      const newComment = this.#adaptToClient(response);
      this.#comments = [
        ...this.#comments,
        newComment,
      ];
      this._notify(updateType, newComment);
    } catch(err) {
      throw new Error('Can\'t create comment');
    }
  };

  deleteComment = async (updateType, film, update) => {
    const updateId = update.id;
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    try {
      const response = await this.#commentsApiService.createComment(film, update);
      if (response.ok) {
        this.#comments = [
          ...this.#comments.slice(0, index),
          ...this.#comments.slice(index + 1),
        ];
        this._notify(updateType, updateId);
      }
    } catch(err) {
      throw new Error(`Can't delete comment, error: ${err}`);
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {
      id: comment.id,
      author: comment.author,
      emotion: comment.emotion,
      comment: comment.comment,
      date: comment.date,
    };
    return adaptedComment;
  };
}
