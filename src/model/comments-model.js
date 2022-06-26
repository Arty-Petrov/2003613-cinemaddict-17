import Observable from '../framework/observable';
import { UpdateType } from '../utils/enum';
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

  addComment = async (updateType, film, update) => {
    try {
      const response = await this.#commentsApiService.addComment(film, update);
      // console.log(response);
      const commentsSet = {...response.comments};
      const updatedDataSet = response;
      let newComment = null;

      for (const key in commentsSet) {
        const result = this.#comments.findIndex((el) => commentsSet[key].id === el.id);
        if (result === -1) {
          newComment = commentsSet[key];
          break;
        }
      }
      updatedDataSet.comments = newComment;
      this.#comments = [
        ...this.#comments,
        newComment,
      ];
      this._notify(updateType, updatedDataSet);
    } catch(err) {
      throw new Error('Can\'t create comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const updateId = update.id;
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    try {
      const response = await this.#commentsApiService.deleteComment(update);
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
